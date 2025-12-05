export interface Score {
    id: number;
    student?: {
        studentCode: string;
        fullName: string;
    };
    subject?: {
        id: number;
        subjectCode: string;
        subjectName: string;
    };
    studentCode?: string; // For flat response
    studentName?: string; // For flat response
    subjectId?: number; // For flat response
    subjectCode?: string; // For flat response
    subjectName?: string; // For flat response
    processScore?: number;
    componentScore?: number;
    finalScore: number;
    status: string; // ĐẠT or TRƯỢT
    semester?: string;
    academicYear?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ScoreRequest {
    studentCode: string;
    subjectId: number;
    processScore: number;
    componentScore: number;
    semester?: string;
    academicYear?: string;
}

