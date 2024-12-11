from fastapi import FastAPI, HTTPException, BackgroundTasks, Query
import pandas as pd
from recommender.rec_eng import HybridSchoolRecommender
from typing import Dict, List
import logging

app = FastAPI()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("recommender_api")

# Initialize hybrid recommender with path to CSV
recommender = HybridSchoolRecommender(
    data_path='data/schools.csv',
    model_dir='models'
)

async def load_and_train_model():
    """Background task to load/train the model"""
    if recommender.load_data():
        recommender.fit(recommender.schools_df)

@app.on_event("startup")
async def startup_event():
    await load_and_train_model()

@app.post("/retrain")
async def retrain_model(background_tasks: BackgroundTasks):
    """Force model retraining"""
    background_tasks.add_task(load_and_train_model)
    return {"status": "success", "message": "Retraining started in background"}

@app.get("/model-info")
async def get_model_info():
    """Get information about the current model"""
    return {
        "last_training_time": recommender.last_training_time,
        "feature_weights": recommender.feature_weights,
        "number_of_schools": len(recommender.schools_df) if recommender.schools_df is not None else 0
    }

@app.get("/recommendations")
async def get_recommendations(
    school_names: List[str] = Query(..., description="List of school names to base recommendations on"),
    n_recommendations: int = Query(5, description="Number of recommendations to return")
):
    """Get school recommendations based on given school names"""
    logger.info(f"Received recommendation request for schools: {school_names}")
    
    try:
        if recommender.schools_df is None:
            logger.error("Schools data not loaded")
            return {"error": "Schools data not loaded"}
            
        if recommender.load_models():
            logger.info("Models loaded successfully")
            recommendations = recommender.get_recommendations(
                school_ids=school_names,
                n_recommendations=n_recommendations
            )
            logger.info(f"Generated {len(recommendations)} recommendations")
            return {"recommendations": recommendations}
            
        logger.error("Failed to load models")
        return {"error": "Failed to load model"}
    except ValueError as e:
        logger.error(f"Error generating recommendations: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/test-recommender")
async def test_recommender():
    """Test if the recommender system is working"""
    try:
        logger.info("Testing recommender system...")
        
        # Test data loading
        if not recommender.load_data():
            return {"status": "error", "message": "Failed to load school data"}
            
        # Test model loading
        if not recommender.load_models():
            return {"status": "error", "message": "Failed to load models"}
            
        # Get first school from dataset
        test_school = recommender.schools_df['name'].iloc[0]
        logger.info(f"Testing with school: {test_school}")
        
        # Try to get recommendations
        recommendations = recommender.get_recommendations(
            school_ids=[test_school],
            n_recommendations=3
        )
        
        return {
            "status": "success",
            "test_school": test_school,
            "recommendations": recommendations
        }
        
    except Exception as e:
        logger.error(f"Test failed: {str(e)}")
        return {"status": "error", "message": str(e)}
