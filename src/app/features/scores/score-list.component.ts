import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ScoreService } from './score.service';
import { Score } from './models/score.model';

@Component({
  selector: 'app-score-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="space-y-6 animate-fade-in">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold text-slate-800 font-heading">Scores</h2>
          <p class="text-slate-500">Manage student grades</p>
        </div>
        <a routerLink="/scores/new" class="btn-primary flex items-center gap-2">
          <span>+ Enter Score</span>
        </a>
      </div>

      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex gap-4">
        <div class="relative flex-1 max-w-md">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span class="text-slate-400">🔍</span>
          </div>
          <input type="text" [(ngModel)]="studentCode" placeholder="Enter Student Code..." class="input-primary pl-10">
        </div>
        <button (click)="loadScoresByStudent()" class="btn-primary">Search</button>
      </div>

      <div class="table-container" *ngIf="scores().length > 0">
        <table class="min-w-full divide-y divide-slate-200">
          <thead class="bg-slate-50">
            <tr>
              <th class="table-header px-6 py-3 text-left">Student</th>
              <th class="table-header px-6 py-3 text-left">Subject</th>
              <th class="table-header px-6 py-3 text-left">Score</th>
              <th class="table-header px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-slate-100">
            <tr *ngFor="let score of scores()" class="table-row">
              <td class="table-cell">
                <div class="font-medium text-slate-900">{{ score.studentName }}</div>
                <div class="text-xs text-slate-500">{{ score.studentCode }}</div>
              </td>
              <td class="table-cell">{{ score.subjectName }}</td>
              <td class="table-cell">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold"
                      [ngClass]="{'bg-emerald-100 text-emerald-700': score.finalScore >= 4, 'bg-rose-100 text-rose-700': score.finalScore < 4}">
                  {{ score.finalScore }}
                </span>
              </td>
              <td class="table-cell text-right">
                <button (click)="deleteScore(score.id)" class="text-rose-600 hover:text-rose-900 font-medium transition-colors">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div *ngIf="scores().length === 0 && studentCode" class="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
        <p class="text-slate-500">No scores found for this student.</p>
      </div>
    </div>
  `
})
export class ScoreListComponent {
  scoreService = inject(ScoreService);
  scores = signal<Score[]>([]);
  studentCode = '';

  loadScoresByStudent() {
    if (this.studentCode) {
      this.scoreService.getScoresByStudent(this.studentCode).subscribe({
        next: (data) => this.scores.set(data)
      });
    }
  }

  deleteScore(id: number) {
    if (confirm('Are you sure?')) {
      this.scoreService.deleteScore(id).subscribe({
        next: () => this.loadScoresByStudent()
      });
    }
  }
}
