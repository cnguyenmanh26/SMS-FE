import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface StudentDetail {
    studentCode: string;
    fullName: string;
    gender: string;
    dateOfBirth: string;
    className: string;
    course: string;
    email: string;
    phoneNumber: string;
    address: string;
}

interface Score {
    id: number;
    subjectName: string;
    processScore: number;
    componentScore: number;
    finalScore: number;
    status: string;
}

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
    student: StudentDetail | null = null;
    scores: Score[] = [];
    loading = true;
    error = '';

    constructor(
        public authService: AuthService,
        private http: HttpClient
    ) { }

    ngOnInit(): void {
        this.loadStudentData();
    }

    loadStudentData(): void {
        const user = this.authService.currentUser();
        if (!user || !user.studentCode) {
            this.error = 'Không tìm thấy thông tin sinh viên';
            this.loading = false;
            return;
        }

        const apiUrl = environment.apiUrl || 'http://localhost:8080/api';

        // Load student details
        this.http.get<any>(`${apiUrl}/students/${user.studentCode}/detail`).subscribe({
            next: (response) => {
                if (response.success) {
                    this.student = response.data;
                }
            },
            error: (err) => {
                console.error('Error loading student:', err);
                this.error = 'Không thể tải thông tin sinh viên';
            }
        });

        // Load scores
        this.http.get<any>(`${apiUrl}/scores/student/${user.studentCode}`).subscribe({
            next: (response) => {
                if (response.success) {
                    this.scores = response.data;
                }
                this.loading = false;
            },
            error: (err) => {
                console.error('Error loading scores:', err);
                this.loading = false;
            }
        });
    }

    get passedScores(): Score[] {
        return this.scores.filter(s => s.status === 'ĐẠT');
    }

    get failedScores(): Score[] {
        return this.scores.filter(s => s.status === 'TRƯỢT');
    }

    get averageScore(): number {
        if (this.scores.length === 0) return 0;
        const sum = this.scores.reduce((acc, s) => acc + s.finalScore, 0);
        return Math.round((sum / this.scores.length) * 100) / 100;
    }
}
