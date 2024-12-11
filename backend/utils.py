def format_school_for_frontend(school_data):
    """Convert school data to frontend format with capitalized keys"""
    return {
        'id': str(school_data.get('id', school_data.get('_id', ''))),
        'Name': school_data.get('name'),
        'Latitude': school_data.get('latitude'),
        'Longitude': school_data.get('longitude'),
        'Type': school_data.get('type'),
        'Curriculum': school_data.get('curriculum'),
        'Rating': school_data.get('rating'),
        'Tuition': school_data.get('tuition'),
        'Focus': school_data.get('focus'),
        'Facilities': school_data.get('facilities'),
        'Student-Teacher Ratio': school_data.get('student_teacher_ratio'),
        'Test Scores': school_data.get('test_scores'),
        'similarity_score': school_data.get('similarity_score')
    } 