import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ScoreService } from './score.service';
import { StudentService } from '../students/student.service';
import { SubjectService } from '../subjects/subject.service';
import { Student } from '../students/models/student.model';
import { Subject } from '../subjects/models/subject.model';

@Component({
  selector: 'app-score-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="max-w-md mx-auto animate-fade-in">
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-slate-800 font-heading">Đăng ký môn học</h2>
        <p class="text-slate-500">Đăng ký môn học cho sinh viên</p>
      </div>
      
      <form [formGroup]="enrollmentForm" (ngSubmit)="onSubmit()" class="card p-8 space-y-6">
        
        <!-- Student Selection -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Sinh viên</label>
          <select formControlName="studentCode" class="input-primary">
            <option value="">Chọn sinh viên</option>
            <option *ngFor="let s of students()" [value]="s.studentCode">
              {{ s.fullName }} ({{ s.studentCode }})
            </option>
          </select>
        </div>

        <!-- Subject Selection -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Môn học</label>
          <select formControlName="subjectId" class="input-primary">
            <option value="">Chọn môn học</option>
            <option *ngFor="let s of subjects()" [value]="s.id">
              {{ s.subjectName }} ({{ s.subjectCode }})
            </option>
          </select>
        </div>

        <!-- Semester -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Học kỳ</label>
          <select formControlName="semester" class="input-primary">
            <option value="1">Học kỳ 1</option>
            <option value="2">Học kỳ 2</option>
            <option value="3">Học kỳ 3</option>
          </select>
        </div>

        <!-- Academic Year -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Năm học</label>
          <input type="text" formControlName="academicYear" class="input-primary" placeholder="e.g. 2023-2024">
        </div>

        <div class="flex gap-3 pt-4">
          <button type="submit" [disabled]="enrollmentForm.invalid" class="btn-primary flex-1">
            Đăng ký
          </button>
          <a routerLink="/scores" class="btn-secondary flex-1 text-center">
            Hủy
          </a>
        </div>
      </form>
    </div>
  `
})
export class ScoreFormComponent implements OnInit {
  scoreService = inject(ScoreService);
  studentService = inject(StudentService);
  subjectService = inject(SubjectService);
  router = inject(Router);

  students = signal<Student[]>([]);
  subjects = signal<Subject[]>([]);

  enrollmentForm = new FormGroup({
    studentCode: new FormControl('', [Validators.required]),
    subjectId: new FormControl('', [Validators.required]),
    semester: new FormControl('1', [Validators.required]),
    academicYear: new FormControl('2024-2025', [Validators.required])
  });

  ngOnInit() {
    this.loadStudents();
    this.loadSubjects();
  }

  loadStudents() {
    this.studentService.getAllStudents().subscribe({
      next: (data) => this.students.set(data),
      error: (err) => console.error('Failed to load students', err)
    });
  }

  loadSubjects() {
    this.subjectService.getAllSubjects().subscribe({
      next: (data) => this.subjects.set(data),
      error: (err) => console.error('Failed to load subjects', err)
    });
  }

  onSubmit() {
    if (this.enrollmentForm.invalid) {
      return;
    }

    const formValue = this.enrollmentForm.value;

    // Always send null for scores when enrolling
    const enrollmentData = {
      studentCode: formValue.studentCode,
      subjectId: Number(formValue.subjectId),
      processScore: null,
      componentScore: null,
      semester: formValue.semester,
      academicYear: formValue.academicYear
    };

    console.log('Enrolling student in subject:', enrollmentData);

    this.scoreService.registerSubject(enrollmentData as any).subscribe({
      next: () => {
        alert('Đăng ký môn học thành công!');
        this.router.navigate(['/scores']);
      },
      error: (err) => {
        if (err.status === 409) {
          alert('Lỗi: Sinh viên này đã đăng ký môn học này rồi!');
        } else {
          alert('Có lỗi xảy ra. Vui lòng thử lại.');
        }
        console.error(err);
      }
    });
  }
}
