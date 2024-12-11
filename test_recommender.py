import requests

# If running locally
BASE_URL = "http://localhost:8000"

def test_specific_schools():
    # Test with a specific school
    school_names = ["Seaview Academy"]  # You can add multiple schools
    
    # Modified to correctly pass multiple school names as query parameters
    params = {
        "school_names": school_names,
        "n_recommendations": 5
    }
    
    response = requests.get(
        f"{BASE_URL}/recommendations",  # Removed trailing slash
        params=params
    )
    
    if response.status_code == 200:
        results = response.json()
        print("\nRecommendations:")
        for rec in results["recommendations"]:
            print(f"\nSchool: {rec['Name']}")
            print(f"Similarity Score: {rec['similarity_score']:.2f}")
            print(f"Curriculum: {rec['Curriculum']}")
            print(f"Rating: {rec['Rating']}")
            print(f"Focus: {rec['Focus']}")
    else:
        print(f"Error: {response.status_code}")
        print(response.json())

if __name__ == "__main__":
    # First test if the recommender is working
    print("Testing recommender system...")
    response = requests.get(f"{BASE_URL}/test-recommender")
    print(response.json())
    
    # Then test with specific schools
    print("\nTesting with specific schools...")
    test_specific_schools() 