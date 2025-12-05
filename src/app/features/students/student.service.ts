import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiResponse } from '../../core/models/api-response.model';
import { Student, StudentRequest } from './models/student.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class StudentService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/students`;

    getAllStudents(): Observable<Student[]> {
        return this.http.get<ApiResponse<Student[]>>(this.apiUrl).pipe(
            map(response => response.data)
        );
    }

    getStudentByCode(code: string): Observable<Student> {
        return this.http.get<ApiResponse<Student>>(`${this.apiUrl}/${code}`).pipe(
            map(response => response.data)
        );
    }

    createStudent(student: StudentRequest): Observable<Student> {
        return this.http.post<ApiResponse<Student>>(this.apiUrl, student).pipe(
            map(response => response.data)
        );
    }

    updateStudent(code: string, student: StudentRequest): Observable<Student> {
        return this.http.put<ApiResponse<Student>>(`${this.apiUrl}/${code}`, student).pipe(
            map(response => response.data)
        );
    }

    deleteStudent(code: string): Observable<void> {
        return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${code}`).pipe(
            map(() => void 0)
        );
    }

    searchStudents(keyword: string): Observable<Student[]> {
        const params = new HttpParams().set('keyword', keyword);
        return this.http.get<ApiResponse<Student[]>>(`${this.apiUrl}/search`, { params }).pipe(
            map(response => response.data)
        );
    }
}