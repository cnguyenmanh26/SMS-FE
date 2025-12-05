import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SubjectService } from './subject.service';
import { Subject } from './models/subject.model';

@Component({
  selector: 'app-subject-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-6 animate-fade-in">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold text-slate-800 font-heading">Subjects</h2>
          <p class="text-slate-500">Manage course curriculum</p>
        </div>
        <a routerLink="/subjects/new" class="btn-primary flex items-center gap-2">
          <span>+ Add Subject</span>
        </a>
      </div>

      <div class="table-container">
        <table class="min-w-full divide-y divide-slate-200">
          <thead class="bg-slate-50">
            <tr>
              <th class="table-header px-6 py-3 text-left">Code</th>
              <th class="table-header px-6 py-3 text-left">Name</th>
              <th class="table-header px-6 py-3 text-left">Credit</th>
              <th class="table-header px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-slate-100">
            <tr *ngFor="let subject of subjects()" class="table-row">
              <td class="table-cell font-medium text-slate-900">{{ subject.subjectCode }}</td>
              <td class="table-cell">{{ subject.subjectName }}</td>
              <td class="table-cell">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  {{ subject.creditHours }} Credits
                </span>
              </td>
              <td class="table-cell text-right space-x-3">
                <a [routerLink]="['/subjects', subject.id]" class="text-indigo-600 hover:text-indigo-900 font-medium transition-colors">Edit</a>
                <button (click)="deleteSubject(subject.id)" class="text-rose-600 hover:text-rose-900 font-medium transition-colors">Delete</button>
              </td>
            </tr>
            <tr *ngIf="subjects().length === 0">
              <td colspan="4" class="px-6 py-12 text-center text-slate-500">
                No subjects found. Add one to get started.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class SubjectListComponent implements OnInit {
  subjectService = inject(SubjectService);
  subjects = signal<Subject[]>([]);

  ngOnInit() {
    this.loadSubjects();
  }

  loadSubjects() {
    this.subjectService.getAllSubjects().subscribe({
      next: (data) => this.subjects.set(data),
      error: (err) => console.error('Failed to load subjects', err)
    });
  }

  deleteSubject(id: number) {
    if (confirm('Are you sure?')) {
      this.subjectService.deleteSubject(id).subscribe({
        next: () => this.loadSubjects()
      });
    }
  }
}
