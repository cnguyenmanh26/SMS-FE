import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiResponse } from '../../core/models/api-response.model';
import { Subject, SubjectRequest } from './models/subject.model';

import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SubjectService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/subjects`;

    getAllSubjects(): Observable<Subject[]> {
        return this.http.get<ApiResponse<Subject[]>>(this.apiUrl).pipe(
            map(response => response.data)
        );
    }

    getSubjectById(id: number): Observable<Subject> {
        return this.http.get<ApiResponse<Subject>>(`${this.apiUrl}/${id}`).pipe(
            map(response => response.data)
        );
    }

    createSubject(subject: SubjectRequest): Observable<Subject> {
        return this.http.post<ApiResponse<Subject>>(this.apiUrl, subject).pipe(
            map(response => response.data)
        );
    }

    updateSubject(id: number, subject: SubjectRequest): Observable<Subject> {
        return this.http.put<ApiResponse<Subject>>(`${this.apiUrl}/${id}`, subject).pipe(
            map(response => response.data)
        );
    }

    deleteSubject(id: number): Observable<void> {
        return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(
            map(() => void 0)
        );
    }

    searchSubjects(keyword: string): Observable<Subject[]> {
        const params = new HttpParams().set('keyword', keyword);
        return this.http.get<ApiResponse<Subject[]>>(`${this.apiUrl}/search`, { params }).pipe(
            map(response => response.data)
        );
    }
}
