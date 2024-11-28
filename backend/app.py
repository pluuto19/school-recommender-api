from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
import json

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

@app.route('/api/schools', methods=['GET'])
def get_schools():
    schools = list(schools_collection.find())
    # Transform _id to id for frontend compatibility
    for school in schools:
        school['id'] = str(school['_id'])
        del school['_id']
    print(schools)
    return jsonify(parse_json(schools))

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    print("Login attempt - Request data:", data)
    
    user = users_collection.find_one({
        'username': data.get('username'),
        'password': data.get('password')
    })
    
    print("Database query result:", user)
    
    if user:
        response = {'success': True, 'user': parse_json(user)}
        print("Login successful - Response:", response)
        return jsonify(response)
    
    print("Login failed - Invalid credentials")
    return jsonify({'success': False, 'message': 'Invalid credentials'}), 401

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    print("Register attempt - Request data:", data)
    
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
    
    print("Registration successful for user:", user['username'])
    return jsonify({'success': True, 'message': 'User registered successfully'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)