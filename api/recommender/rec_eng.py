import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.decomposition import PCA
from sklearn.compose import ColumnTransformer
from typing import List, Dict
import joblib
import os
from datetime import datetime
import logging

logger = logging.getLogger("recommender_engine")

class HybridSchoolRecommender:
    def __init__(self, data_path: str, model_dir='models', feature_weights=None):
        """
        Initialize the recommender
        
        Args:
            data_path: Path to the CSV file containing school data
            model_dir: Directory to save/load trained models
            feature_weights: Optional custom weights for features
        """
        self.data_path = data_path
        self.model_dir = model_dir
        self.schools_df = None
        self.features_matrix = None
        
        # Create models directory if it doesn't exist
        os.makedirs(model_dir, exist_ok=True)
        
        self.feature_weights = feature_weights or {
            'type': 1.0,
            'curriculum': 1.0,
            'focus': 1.0,
            'facilities': 0.8,
            'rating': 1.5,
            'tuition': 1.5,
            'student_teacher_ratio': 0.6,
            'test_scores': 1.2
        }
        
        self.numerical_features = ['rating', 'tuition', 'student_teacher_ratio', 'test_scores']
        self.categorical_features = ['type', 'curriculum', 'focus', 'facilities']
        
        self.preprocessor = ColumnTransformer(
            transformers=[
                ('num', StandardScaler(), self.numerical_features),
                ('cat', OneHotEncoder(handle_unknown='ignore'), self.categorical_features)
            ])
        
        self.pca = PCA(n_components=0.95)
        
        self.last_training_time = None

    def load_data(self):
        """Load school data from CSV"""
        try:
            logger.info(f"Loading data from {self.data_path}")
            self.schools_df = pd.read_csv(self.data_path)
            logger.info(f"Loaded {len(self.schools_df)} schools")
            return True
        except Exception as e:
            logger.error(f"Error loading data: {e}")
            return False

    def _get_model_paths(self):
        """Get paths for all model components"""
        return {
            'preprocessor': os.path.join(self.model_dir, 'preprocessor.joblib'),
            'pca': os.path.join(self.model_dir, 'pca.joblib'),
            'features_matrix': os.path.join(self.model_dir, 'features_matrix.npy'),
            'schools_df': os.path.join(self.model_dir, 'schools_df.pkl'),
            'metadata': os.path.join(self.model_dir, 'metadata.joblib')
        }
    
    def save_models(self):
        """Save all model components and metadata"""
        paths = self._get_model_paths()
        
        # Save transformers
        joblib.dump(self.preprocessor, paths['preprocessor'])
        joblib.dump(self.pca, paths['pca'])
        
        # Save processed data
        np.save(paths['features_matrix'], self.features_matrix)
        self.schools_df.to_pickle(paths['schools_df'])
        
        # Save metadata
        metadata = {
            'feature_weights': self.feature_weights,
            'last_training_time': self.last_training_time,
            'numerical_features': self.numerical_features,
            'categorical_features': self.categorical_features
        }
        joblib.dump(metadata, paths['metadata'])
        
        print(f"Models and data saved to {self.model_dir}")
    
    def load_models(self) -> bool:
        """Load all model components and metadata"""
        paths = self._get_model_paths()
        
        try:
            # Check if all files exist
            if not all(os.path.exists(path) for path in paths.values()):
                return False
            
            # Load transformers
            self.preprocessor = joblib.load(paths['preprocessor'])
            self.pca = joblib.load(paths['pca'])
            
            # Load processed data
            self.features_matrix = np.load(paths['features_matrix'])
            self.schools_df = pd.read_pickle(paths['schools_df'])
            
            # Load metadata
            metadata = joblib.load(paths['metadata'])
            self.feature_weights = metadata['feature_weights']
            self.last_training_time = metadata['last_training_time']
            self.numerical_features = metadata['numerical_features']
            self.categorical_features = metadata['categorical_features']
            
            print(f"Models loaded successfully. Last trained: {self.last_training_time}")
            return True
            
        except Exception as e:
            print(f"Error loading models: {str(e)}")
            return False
    
    def needs_retraining(self, schools_data: pd.DataFrame) -> bool:
        """Check if model needs retraining based on data changes"""
        if self.schools_df is None:
            return True
            
        # Compare current data with loaded data
        if len(schools_data) != len(self.schools_df):
            return True
            
        # Check if any school data has changed
        return not schools_data.equals(self.schools_df)
    
    def _apply_feature_weights(self, features_matrix: np.ndarray, feature_names: List[str]) -> np.ndarray:
        """Apply feature weights to the transformed features"""
        weighted_features = features_matrix.copy()
        
        for feature, weight in self.feature_weights.items():
            # Find all columns that start with this feature name
            feature_cols = [i for i, name in enumerate(feature_names) 
                          if name == feature or name.startswith(f"{feature}_")]
            
            # Apply weight to those columns
            weighted_features[:, feature_cols] *= weight
            
        return weighted_features
    
    def fit(self, schools_data: pd.DataFrame, force_retrain=False):
        """Prepare the recommender with transformed and weighted features"""
        try:
            # Check if we can load existing models
            if not force_retrain and self.load_models():
                if not self.needs_retraining(schools_data):
                    print("Using existing models - no retraining needed")
                    return
            
            print("Training new models...")
            self.schools_df = schools_data.copy()
            
            # Validate required columns exist
            required_columns = self.numerical_features + self.categorical_features
            missing_columns = [col for col in required_columns if col not in self.schools_df.columns]
            if missing_columns:
                raise ValueError(f"Missing required columns: {missing_columns}")
            
            # Transform features
            features_matrix = self.preprocessor.fit_transform(self.schools_df)
            
            # Convert sparse matrix to dense if necessary
            if hasattr(features_matrix, 'toarray'):
                features_matrix = features_matrix.toarray()
                
            # Get feature names
            feature_names = (
                self.numerical_features +
                self.preprocessor.named_transformers_['cat'].get_feature_names_out(self.categorical_features).tolist()
            )
            
            # Apply feature weights
            weighted_features = self._apply_feature_weights(features_matrix, feature_names)
            
            # Apply PCA
            self.features_matrix = self.pca.fit_transform(weighted_features)
            
            # Update training timestamp
            self.last_training_time = datetime.now()
            
            # Save the models
            self.save_models()
            
            print(f"Training completed. Reduced dimensions from {features_matrix.shape[1]} to {self.features_matrix.shape[1]}")
            
        except Exception as e:
            raise Exception(f"Training failed: {str(e)}")

    def get_recommendations(self, school_ids: List[str], n_recommendations: int = 5) -> List[Dict]:
        """Get recommendations based on school IDs"""
        logger.info(f"Getting recommendations for schools: {school_ids}")
        
        if not isinstance(school_ids, list) or len(school_ids) == 0:
            raise ValueError("school_ids must be a non-empty list")

        # Get indices of input schools
        input_indices = []
        for school_id in school_ids:
            try:
                idx = self.schools_df[self.schools_df['name'] == school_id].index[0]
                input_indices.append(idx)
                logger.info(f"Found index {idx} for school {school_id}")
            except (IndexError, KeyError) as e:
                logger.error(f"School not found: {school_id}. Error: {str(e)}")
                continue

        if not input_indices:
            raise ValueError("No valid schools found")

        # Calculate average feature vector for input schools
        average_features = np.mean([self.features_matrix[idx] for idx in input_indices], axis=0)
        
        # Calculate similarity scores using euclidean distance
        distances = np.linalg.norm(self.features_matrix - average_features, axis=1)
        
        # Convert distances to similarities (inverse of distance)
        similarities = 1 / (1 + distances)
        
        # Get top similar schools
        school_indices = similarities.argsort()[::-1]
        
        # Filter out input schools and create recommendations
        recommended_schools = []
        for idx in school_indices:
            if self.schools_df.iloc[idx]['name'] not in school_ids:
                school_data = self.schools_df.iloc[idx].to_dict()
                school_data['id'] = str(idx)
                school_data['similarity_score'] = float(similarities[idx])
                recommended_schools.append(school_data)
                if len(recommended_schools) >= n_recommendations:
                    break

        logger.info(f"Generated {len(recommended_schools)} recommendations")
        return recommended_schools