export interface Student {
    studentCode: string;
    fullName: string;
    dateOfBirth: string; // ISO date string
    gender: string;
    className?: string;
    course?: string;
    email: string;
    phoneNumber: string;
    address?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface StudentRequest {
    fullName: string;
    dateOfBirth: string;
    gender: string;
    className?: string;
    course?: string;
    email: string;
    phoneNumber: string;
    address?: string;
}

