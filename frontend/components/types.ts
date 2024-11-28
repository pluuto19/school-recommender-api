export interface School {
    location: string | undefined;
    id: string;
    Name: string;
    Latitude: number;
    Longitude: number;
    Type: string;
    Curriculum: string;
    Rating: number;
    Tuition: number;
    Focus: string;
    Facilities: string;
    'Student-Teacher Ratio': number;
    'Test Scores': number;
  }