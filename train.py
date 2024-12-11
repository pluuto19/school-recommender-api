from recommender.rec_eng import HybridSchoolRecommender

def main():
    # Initialize recommender with path to your CSV file
    recommender = HybridSchoolRecommender(
        data_path='data/schools.csv',
        model_dir='models'
    )
    
    # Load and train
    if recommender.load_data():
        # Pass the loaded DataFrame to fit()
        recommender.fit(recommender.schools_df)
        # Add error handling for fit operation
        try:
            recommender.fit(recommender.schools_df)
            print("Training completed successfully!")
        except Exception as e:
            print(f"Training failed: {str(e)}")
    else:
        print("Failed to load data. Please check the CSV file path.")

if __name__ == "__main__":
    main()