export interface Curriculum {
    id: number;
    title: string;
    description: string;
    credits: number;
    semester: number;
}

export interface Course {
    id: number;
    name: string;
    code: string;
    curriculumId: number;
}

export interface Student {
    id: number;
    name: string;
    email: string;
    enrolledCurriculumId: number;
}

export interface Enrollment {
    id: number;
    studentId: number;
    courseId: number;
    semester: number;
}