export interface User {
    id: number;
    username: string;
    email: string;
    studentCode: string | null;
    roles: string[];
}
