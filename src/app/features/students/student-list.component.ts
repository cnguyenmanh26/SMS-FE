import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StudentService } from './student.service';
import { StudentCardComponent } from './student-card.component';
import { Student } from './models/student.model';
import { LoadingService } from '../../core/services/loading.service';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, RouterModule, StudentCardComponent],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold text-slate-800 font-heading">Students</h2>
          <p class="text-slate-500">Manage your student records</p>
        </div>
        <a routerLink="/students/new" class="btn-primary flex items-center gap-2">
          <span>+ Add Student</span>
        </a>
      </div>

      <!-- Search Bar -->
      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div class="relative max-w-md">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span class="text-slate-400">🔍</span>
          </div>
          <input type="text" 
                 placeholder="Search students by name or code..." 
                 class="input-primary pl-10"
                 (input)="onSearch($event)">
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <app-student-card 
          *ngFor="let sv of students()"
          [student]="sv"
          (deleteRequest)="handleDelete($event)"
        ></app-student-card>
      </div>

      <div *ngIf="students().length === 0 && !loadingService.isLoading()" class="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
        <div class="text-4xl mb-4">🎓</div>
        <p class="text-lg font-medium text-slate-900">No students found</p>
        <p class="text-slate-500">Try adjusting your search or add a new student.</p>
      </div>
    </div>
  `
})
export class StudentListComponent implements OnInit {
  studentService = inject(StudentService);
  loadingService = inject(LoadingService);
  students = signal<Student[]>([]);

  ngOnInit() {
    this.loadStudents();
  }

  loadStudents() {
    this.studentService.getAllStudents().subscribe({
      next: (data) => this.students.set(data || []),
      error: (err) => console.error('Failed to load students', err)
    });
  }

  handleDelete(studentCode: string) {
    if (confirm('Are you sure you want to delete this student?')) {
      this.studentService.deleteStudent(studentCode).subscribe({
        next: () => {
          this.students.update(list => list.filter(s => s.studentCode !== studentCode));
        },
        error: (err) => alert('Failed to delete student')
      });
    }
  }

  onSearch(event: Event) {
    const keyword = (event.target as HTMLInputElement).value;
    if (keyword.trim()) {
      this.studentService.searchStudents(keyword).subscribe({
        next: (data) => this.students.set(data || [])
      });
    } else {
      this.loadStudents();
    }
  }
}
