export interface School {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    type: string;
    curriculum: string;
    rating: number;
    tuition: number;
    focus: string;
    facilities: string;
    student_teacher_ratio: number;
    test_scores: number;
    location?: string;
}