import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SubjectService } from './subject.service';

@Component({
  selector: 'app-subject-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="max-w-2xl mx-auto animate-fade-in">
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-slate-800 font-heading">{{ isEditMode ? 'Update Subject' : 'Add New Subject' }}</h2>
        <p class="text-slate-500">Enter subject details below</p>
      </div>
      
      <form [formGroup]="subjectForm" (ngSubmit)="onSubmit()" class="card p-8 space-y-6">
        
        <!-- Code & Name -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Subject Code</label>
            <input type="text" formControlName="subjectCode" class="input-primary" placeholder="e.g. CS101">
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Subject Name</label>
            <input type="text" formControlName="subjectName" class="input-primary" placeholder="e.g. Intro to Programming">
          </div>
        </div>

        <!-- Credit & Credit Hours -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Credit</label>
            <input type="number" formControlName="credit" class="input-primary" placeholder="3">
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Credit Hours (Số tiết học)</label>
            <input type="number" formControlName="creditHours" class="input-primary" placeholder="45">
          </div>
        </div>

        <!-- Score Ratios -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Process Score Ratio (Tỷ lệ điểm QT %)</label>
            <input type="number" formControlName="processScoreRatio" class="input-primary" placeholder="30" min="0" max="100">
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Component Score Ratio (Tỷ lệ điểm CK %)</label>
            <input type="number" formControlName="componentScoreRatio" class="input-primary" placeholder="70" min="0" max="100">
          </div>
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Description</label>
          <textarea formControlName="description" rows="4" class="input-primary" placeholder="Enter subject description..."></textarea>
        </div>

        <div class="flex gap-4 pt-6 border-t border-slate-100">
          <button type="submit" [disabled]="subjectForm.invalid" 
                  class="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed">
            {{ isEditMode ? 'Update Subject' : 'Create Subject' }}
          </button>
          <a routerLink="/subjects" class="btn-secondary flex-1 text-center">
            Cancel
          </a>
        </div>
      </form>
    </div>
  `
})
export class SubjectFormComponent implements OnInit {
  subjectService = inject(SubjectService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  subjectForm = new FormGroup({
    subjectCode: new FormControl('', [Validators.required]),
    subjectName: new FormControl('', [Validators.required]),
    credit: new FormControl(0, [Validators.required, Validators.min(1)]),
    creditHours: new FormControl(0, [Validators.required, Validators.min(1)]),
    processScoreRatio: new FormControl(30, [Validators.required, Validators.min(0), Validators.max(100)]),
    componentScoreRatio: new FormControl(70, [Validators.required, Validators.min(0), Validators.max(100)]),
    description: new FormControl('')
  });

  isEditMode = false;
  subjectId: number | null = null;

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    if (id && id !== 'new') {
      this.isEditMode = true;
      this.subjectId = Number(id);
      this.subjectService.getSubjectById(this.subjectId).subscribe({
        next: (subject) => {
          this.subjectForm.patchValue(subject);
        },
        error: () => this.router.navigate(['/subjects'])
      });
    }
  }

  onSubmit() {
    if (this.subjectForm.valid) {
      const formValue = this.subjectForm.value;

      // Convert percentage to decimal (0-1)
      const payload = {
        ...formValue,
        processScoreRatio: (formValue.processScoreRatio || 0) / 100,
        componentScoreRatio: (formValue.componentScoreRatio || 0) / 100
      };

      if (this.isEditMode && this.subjectId) {
        this.subjectService.updateSubject(this.subjectId, payload as any).subscribe({
          next: () => this.router.navigate(['/subjects']),
          error: (err) => {
            console.error('Update error:', err);
            alert('Failed to update: ' + (err.error?.message || 'Unknown error'));
          }
        });
      } else {
        this.subjectService.createSubject(payload as any).subscribe({
          next: () => this.router.navigate(['/subjects']),
          error: (err) => {
            console.error('Create error:', err);
            alert('Failed to create: ' + (err.error?.message || 'Unknown error'));
          }
        });
      }
    }
  }
}
