from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
import json
import requests
from datetime import datetime
from requests.exceptions import RequestException
import pandas as pd
from utils import format_school_for_frontend

app = Flask(__name__)
CORS(app)

# MongoDB connection
client = MongoClient('mongodb://localhost:27017/')
db = client['school_recommendations']
schools_collection = db['schools']
users_collection = db['users']

# Helper function to convert ObjectId to string
def parse_json(data):
    return json.loads(json.dumps(data, default=str))

# Add after MongoDB connection setup
def init_schools():
    # Check if schools collection is empty
    if schools_collection.count_documents({}) == 0:
        # Read schools from CSV
        schools_df = pd.read_csv('api/data/schools.csv')
        # Convert DataFrame to list of dictionaries
        schools_data = schools_df.to_dict('records')
        # Insert schools into MongoDB
        schools_collection.insert_many(schools_data)

# Call this after creating MongoDB connection
init_schools()

@app.route('/api/schools', methods=['GET'])
def get_schools():
    schools = list(schools_collection.find())
    # Transform _id to id for frontend compatibility
    for school in schools:
        school['id'] = str(school['_id'])
        del school['_id']
    return jsonify(parse_json(schools))

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    
    user = users_collection.find_one({
        'username': data.get('username'),
        'password': data.get('password')
    })
        
    if user:
        response = {'success': True, 'user': parse_json(user)}
        return jsonify(response)
    
    return jsonify({'success': False, 'message': 'Invalid credentials'}), 401

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Check if user already exists
    if users_collection.find_one({'username': data['username']}):
        return jsonify({'success': False, 'message': 'Username already exists'}), 400
    
    # Insert new user
    user = {
        'username': data['username'],
        'password': data['password'],  # In production, hash the password
        'name': data['name']
    }
    users_collection.insert_one(user)
    
    return jsonify({'success': True, 'message': 'User registered successfully'})

@app.route('/api/user/interactions', methods=['POST'])
def update_user_interactions():
    data = request.get_json()
    
    user_id = data.get('userId')
    school_name = data.get('school_name')
    interaction_type = data.get('type')
    
    if not all([user_id, school_name, interaction_type]):
        return jsonify({'success': False, 'message': 'Missing required fields'}), 400
    
    # First find the school by name
    school = schools_collection.find_one({'name': school_name})
    if not school:
        return jsonify({'success': False, 'message': 'School not found'}), 404
        
    users_collection.update_one(
        {'_id': ObjectId(user_id)},
        {
            '$addToSet': {
                'interacted_schools': {
                    'school_name': school_name,
                    'type': interaction_type,
                    'timestamp': datetime.now()
                }
            }
        },
        upsert=True
    )
    
    return jsonify({'success': True})

@app.route('/api/recommendations/<user_id>', methods=['GET'])
def get_recommendations(user_id):
    try:
        user = users_collection.find_one({'_id': ObjectId(user_id)})
        if not user:
            return jsonify({'error': 'User not found'}), 404

        interacted_schools = user.get('interacted_schools', [])
        if not interacted_schools:
            return jsonify({'success': False, 'message': 'No school interactions found'}), 400

        # Get unique school names from interactions
        school_names = list(set(
            interaction['school_name'] 
            for interaction in interacted_schools 
            if interaction.get('school_name')
        ))
        
        if not school_names:
            return jsonify({'success': False, 'message': 'No valid school names found'}), 400

        params = []
        for name in school_names:
            params.append(('school_names', name))
        params.append(('n_recommendations', 5))

        try:
            response = requests.get(
                'http://localhost:8000/recommendations',
                params=params,
                timeout=5
            )
            if response.status_code == 200:
                print(response.json())
                raw_recommendations = response.json().get('recommendations', [])
                formatted_recommendations = [format_school_for_frontend(rec) for rec in raw_recommendations]
                return jsonify({'success': True, 'recommendations': formatted_recommendations})
            else:
                return jsonify({'success': False, 'message': f'API Error: {response.text}'}), 500
                
        except RequestException as e:
            return jsonify({
                'success': False, 
                'message': 'Recommender service unavailable'
            }), 503
            
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)