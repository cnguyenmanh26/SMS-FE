import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { StudentService } from './student.service';
import { ScoreService } from '../scores/score.service';
import { Student } from './models/student.model';
import { Score } from '../scores/models/score.model';

@Component({
  selector: 'app-student-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="space-y-6 animate-fade-in">
      <!-- Header with Back Button -->
      <div class="flex items-center gap-4">
        <button (click)="goBack()" class="btn-secondary px-4 py-2">
          ← Quay lại
        </button>
        <div>
          <h2 class="text-2xl font-bold text-slate-800 font-heading">Chi tiết Sinh viên</h2>
          <p class="text-slate-500">Thông tin và kết quả học tập</p>
        </div>
      </div>

      <!-- Student Info Card -->
      <div class="card p-6" *ngIf="student()">
        <div class="flex items-start gap-6">
          <div class="w-20 h-20 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-3xl font-bold">
            {{ student()!.fullName.charAt(0) }}
          </div>
          <div class="flex-1">
            <h3 class="text-2xl font-bold text-slate-900 mb-2">{{ student()!.fullName }}</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div class="flex items-center gap-2">
                <span class="text-slate-400">🎓</span>
                <span class="font-medium text-slate-700">Mã SV:</span>
                <span class="text-slate-900 font-mono">{{ student()!.studentCode }}</span>
              </div>
              <div class="flex items-center gap-2" *ngIf="student()!.className">
                <span class="text-slate-400">📚</span>
                <span class="font-medium text-slate-700">Lớp:</span>
                <span class="text-slate-900">{{ student()!.className }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-slate-400">✉️</span>
                <span class="font-medium text-slate-700">Email:</span>
                <span class="text-slate-900">{{ student()!.email }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-slate-400">📱</span>
                <span class="font-medium text-slate-700">SĐT:</span>
                <span class="text-slate-900">{{ student()!.phoneNumber }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="card p-6 text-center">
          <div class="text-3xl font-bold text-indigo-600">{{ totalSubjects() }}</div>
          <div class="text-sm text-slate-500 mt-1">Tổng số môn</div>
        </div>
        <div class="card p-6 text-center">
          <div class="text-3xl font-bold text-emerald-600">{{ passedSubjects() }}</div>
          <div class="text-sm text-slate-500 mt-1">Môn đạt</div>
        </div>
        <div class="card p-6 text-center">
          <div class="text-3xl font-bold text-rose-600">{{ failedSubjects() }}</div>
          <div class="text-sm text-slate-500 mt-1">Môn trượt</div>
        </div>
      </div>

      <!-- Scores Table -->
      <div class="card">
        <div class="p-6 border-b border-slate-100">
          <h3 class="text-lg font-bold text-slate-800">Bảng điểm các môn học</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-200">
            <thead class="bg-slate-50">
              <tr>
                <th class="table-header px-6 py-3 text-left">Mã MH</th>
                <th class="table-header px-6 py-3 text-left">Tên môn học</th>
                <th class="table-header px-6 py-3 text-center">Điểm QT</th>
                <th class="table-header px-6 py-3 text-center">Điểm TP</th>
                <th class="table-header px-6 py-3 text-center">Điểm TK</th>
                <th class="table-header px-6 py-3 text-center">Kết quả</th>
                <th class="table-header px-6 py-3 text-left">Học kỳ</th>
                <th class="table-header px-6 py-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-slate-100">
              <tr *ngFor="let score of scores()" class="table-row">
                <td class="table-cell font-mono text-sm">{{ score.subjectCode }}</td>
                <td class="table-cell font-medium">{{ score.subjectName }}</td>
                <td class="table-cell text-center">{{ score.processScore ?? '-' }}</td>
                <td class="table-cell text-center">{{ score.componentScore ?? '-' }}</td>
                <td class="table-cell text-center">
                  <span class="font-bold text-lg" *ngIf="score.finalScore != null"
                        [ngClass]="{'text-emerald-600': score.finalScore >= 4, 'text-rose-600': score.finalScore < 4}">
                    {{ score.finalScore }}
                  </span>
                  <span *ngIf="score.finalScore == null" class="text-slate-400">-</span>
                </td>
                <td class="table-cell text-center">
                  <span *ngIf="score.status" class="px-3 py-1 rounded-full text-xs font-bold"
                        [ngClass]="{'bg-emerald-100 text-emerald-700': score.status === 'ĐẠT', 'bg-rose-100 text-rose-700': score.status !== 'ĐẠT'}">
                    {{ score.status }}
                  </span>
                  <span *ngIf="!score.status" class="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500">
                    Chưa có điểm
                  </span>
                </td>
                <td class="table-cell text-sm">{{ score.semester }} - {{ score.academicYear }}</td>
                <td class="table-cell text-center">
                  <button *ngIf="score.status === 'CHƯA CÓ ĐIỂM' || (score.processScore == null && score.componentScore == null)" 
                          (click)="openScoreModal(score)" 
                          class="px-3 py-1 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer">
                    Nhập điểm
                  </button>
                  <span *ngIf="score.status !== 'CHƯA CÓ ĐIỂM' && score.processScore != null && score.componentScore != null" class="text-slate-400 text-xs">—</span>
                </td>
              </tr>
              <tr *ngIf="scores().length === 0">
                <td colspan="8" class="px-6 py-12 text-center text-slate-500">
                  Chưa có điểm nào.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Score Entry Modal -->
      <div *ngIf="showModal()" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
           (click)="closeModal()">
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 animate-slide-up" (click)="$event.stopPropagation()">
          <div class="p-6 border-b border-slate-100">
            <h3 class="text-xl font-bold text-slate-800">Nhập điểm</h3>
            <p class="text-sm text-slate-500 mt-1">{{ selectedScore()?.subjectName }}</p>
          </div>
          
          <form (ngSubmit)="submitScore()" class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Điểm Quá trình (0-10)</label>
              <input type="number" [(ngModel)]="processScoreInput" name="processScore"
                     min="0" max="10" step="0.1" required
                     class="input-primary" placeholder="Nhập điểm quá trình">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Điểm Thành phần (0-10)</label>
              <input type="number" [(ngModel)]="componentScoreInput" name="componentScore"
                     min="0" max="10" step="0.1" required
                     class="input-primary" placeholder="Nhập điểm thành phần">
            </div>
            
            <div class="flex gap-3 pt-4">
              <button type="submit" class="btn-primary flex-1">
                Lưu điểm
              </button>
              <button type="button" (click)="closeModal()" class="btn-secondary flex-1">
                Hủy
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class StudentDetailComponent implements OnInit {
  studentService = inject(StudentService);
  scoreService = inject(ScoreService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  student = signal<Student | null>(null);
  scores = signal<Score[]>([]);
  showModal = signal<boolean>(false);
  selectedScore = signal<Score | null>(null);

  processScoreInput: number | null = null;
  componentScoreInput: number | null = null;

  totalSubjects = computed(() => this.scores().length);
  passedSubjects = computed(() => this.scores().filter(s => s.status === 'ĐẠT').length);
  failedSubjects = computed(() => this.scores().filter(s => s.status === 'TRƯỢT').length);

  ngOnInit() {
    const studentCode = this.route.snapshot.params['code'];
    if (studentCode) {
      this.loadStudentInfo(studentCode);
      this.loadStudentScores(studentCode);
    }
  }

  loadStudentInfo(code: string) {
    this.studentService.getStudentByCode(code).subscribe({
      next: (data) => this.student.set(data),
      error: (err) => {
        console.error('Failed to load student', err);
        alert('Không tìm thấy sinh viên');
        this.router.navigate(['/students']);
      }
    });
  }

  loadStudentScores(code: string) {
    this.scoreService.getScoresByStudent(code).subscribe({
      next: (data) => this.scores.set(data),
      error: (err) => console.error('Failed to load scores', err)
    });
  }

  openScoreModal(score: Score) {
    this.selectedScore.set(score);
    this.processScoreInput = score.processScore ?? null;
    this.componentScoreInput = score.componentScore ?? null;
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.selectedScore.set(null);
    this.processScoreInput = null;
    this.componentScoreInput = null;
  }

  submitScore() {
    const score = this.selectedScore();
    const student = this.student();

    if (!score || !student || this.processScoreInput === null || this.componentScoreInput === null) {
      alert('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    const scoreData = {
      studentCode: student.studentCode,
      subjectId: score.subjectId,
      processScore: this.processScoreInput,
      componentScore: this.componentScoreInput,
      semester: score.semester || 'HK1',
      academicYear: score.academicYear || '2024-2025'
    };

    // If score.id exists, it means the subject is already registered, so we UPDATE
    // Otherwise, we CREATE a new score entry
    const request = score.id
      ? this.scoreService.updateScore(score.id, scoreData as any)
      : this.scoreService.enterScore(scoreData as any);

    request.subscribe({
      next: () => {
        alert('Nhập điểm thành công!');
        this.closeModal();
        this.loadStudentScores(student.studentCode);
      },
      error: (err) => {
        console.error('Error:', err);
        if (err.status === 409) {
          alert('Lỗi: Sinh viên này đã có điểm cho môn học này rồi!');
        } else {
          alert('Có lỗi xảy ra khi nhập điểm');
        }
      }
    });
  }

  goBack() {
    this.router.navigate(['/students']);
  }
}
