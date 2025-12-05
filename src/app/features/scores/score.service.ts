import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiResponse } from '../../core/models/api-response.model';
import { Score, ScoreRequest } from './models/score.model';

import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ScoreService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/scores`;

    enterScore(score: ScoreRequest): Observable<Score> {
        return this.http.post<ApiResponse<Score>>(this.apiUrl, score).pipe(
            map(response => response.data)
        );
    }

    registerSubject(score: ScoreRequest): Observable<Score> {
        return this.http.post<ApiResponse<Score>>(`${this.apiUrl}/register`, score).pipe(
            map(response => response.data)
        );
    }

    updateScore(id: number, score: ScoreRequest): Observable<Score> {
        return this.http.put<ApiResponse<Score>>(`${this.apiUrl}/${id}`, score).pipe(
            map(response => response.data)
        );
    }

    deleteScore(id: number): Observable<void> {
        return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(
            map(() => void 0)
        );
    }

    getScoresByStudent(studentCode: string): Observable<Score[]> {
        return this.http.get<ApiResponse<Score[]>>(`${this.apiUrl}/student/${studentCode}`).pipe(
            map(response => response.data)
        );
    }

    getScoresBySubject(subjectId: number): Observable<Score[]> {
        return this.http.get<ApiResponse<Score[]>>(`${this.apiUrl}/subject/${subjectId}`).pipe(
            map(response => response.data)
        );
    }
}
