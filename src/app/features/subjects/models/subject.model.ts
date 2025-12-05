export interface Subject {
    id: number;
    subjectCode: string;
    subjectName: string;
    creditHours: number;
    processScoreRatio: number;
    componentScoreRatio: number;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface SubjectRequest {
    subjectCode: string;
    subjectName: string;
    creditHours: number;
    processScoreRatio: number;
    componentScoreRatio: number;
    description?: string;
}

