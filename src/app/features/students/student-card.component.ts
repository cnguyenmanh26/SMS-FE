import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Student } from './models/student.model';

@Component({
  selector: 'app-student-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="card hover:shadow-lg transition-all duration-300 group relative">
      <div class="p-5">
        <div class="flex justify-between items-start mb-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
              {{ student.fullName.charAt(0) }}
            </div>
            <div>
              <h3 class="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">{{ student.fullName }}</h3>
              <span class="text-xs text-slate-500 font-mono">{{ student.studentCode }}</span>
            </div>
          </div>
        </div>
        
        <div class="space-y-2 text-sm text-slate-600 mb-5">
          <div class="flex items-center gap-2" *ngIf="student.className">
            <span class="w-4 text-center text-slate-400">🎓</span>
            <span class="font-medium text-slate-700">{{ student.className }}</span>
          </div>
          <div class="flex items-center gap-2" *ngIf="student.course">
            <span class="w-4 text-center text-slate-400">📚</span>
            <span class="font-medium text-slate-700">{{ student.course }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-4 text-center text-slate-400">✉️</span>
            <span class="truncate">{{ student.email }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-4 text-center text-slate-400">📱</span>
            <span>{{ student.phoneNumber }}</span>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100">
          <a [routerLink]="['/students', student.studentCode, 'detail']" 
             class="btn-primary text-center text-xs py-2">
            Xem
          </a>
          <a [routerLink]="['/students', student.studentCode]" 
             class="btn-secondary text-center text-xs py-2 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200">
            Sửa
          </a>
          <button (click)="onDelete()" 
                  class="btn-secondary text-center text-xs py-2 text-rose-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200">
            Xóa
          </button>
        </div>
      </div>
    </div>
  `
})
export class StudentCardComponent {
  @Input({ required: true }) student!: Student;
  @Output() deleteRequest = new EventEmitter<string>();

  onDelete() {
    this.deleteRequest.emit(this.student.studentCode);
  }
}
