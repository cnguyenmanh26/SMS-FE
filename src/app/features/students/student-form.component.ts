import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { StudentService } from './student.service';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="max-w-3xl mx-auto animate-fade-in">
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-slate-800 font-heading">{{ isEditMode ? 'Update Student' : 'Add New Student' }}</h2>
        <p class="text-slate-500">Enter student information below</p>
      </div>
      
      <form [formGroup]="studentForm" (ngSubmit)="onSubmit()" class="card p-8 space-y-6">
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Student Code -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Student Code</label>
            <input type="text" formControlName="studentCode" class="input-primary" placeholder="e.g. SV001">
            <div *ngIf="studentForm.get('studentCode')?.invalid && studentForm.get('studentCode')?.touched" class="text-rose-500 text-xs mt-1">
              Student code is required
            </div>
          </div>

          <!-- Full Name -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
            <input type="text" formControlName="fullName" class="input-primary" placeholder="e.g. Nguyen Van A">
            <div *ngIf="studentForm.get('fullName')?.invalid && studentForm.get('fullName')?.touched" class="text-rose-500 text-xs mt-1">
              Full name is required
            </div>
          </div>

          <!-- Date of Birth -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Date of Birth</label>
            <input type="date" formControlName="dateOfBirth" class="input-primary">
          </div>

          <!-- Gender -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Gender</label>
            <select formControlName="gender" class="input-primary">
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Email</label>
            <input type="email" formControlName="email" class="input-primary" placeholder="student@example.com">
          </div>

          <!-- Phone -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
            <input type="tel" formControlName="phoneNumber" class="input-primary" placeholder="0912345678">
          </div>

          <!-- Class Name -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Class Name</label>
            <input type="text" formControlName="className" class="input-primary" placeholder="e.g. K17DCAT">
          </div>

          <!-- Course -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Course</label>
            <input type="text" formControlName="course" class="input-primary" placeholder="e.g. K17">
          </div>
          
          <!-- Address -->
          <div class="col-span-2">
            <label class="block text-sm font-medium text-slate-700 mb-2">Address</label>
            <textarea formControlName="address" rows="3" class="input-primary" placeholder="123 Street, City"></textarea>
          </div>
        </div>

        <div class="flex gap-4 pt-6 border-t border-slate-100">
          <button type="submit" [disabled]="studentForm.invalid" 
                  class="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed">
            {{ isEditMode ? 'Update Student' : 'Create Student' }}
          </button>
          <a routerLink="/students" class="btn-secondary flex-1 text-center">
            Cancel
          </a>
        </div>
      </form>
    </div>
  `
})
export class StudentFormComponent implements OnInit {
  studentService = inject(StudentService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  studentForm = new FormGroup({
    studentCode: new FormControl('', [Validators.required]),
    fullName: new FormControl('', [Validators.required]),
    dateOfBirth: new FormControl('', [Validators.required]),
    gender: new FormControl('Nam', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phoneNumber: new FormControl('', [Validators.required]),
    address: new FormControl(''),
    className: new FormControl(''),
    course: new FormControl('')
  });

  isEditMode = false;
  studentCode: string | null = null;

  ngOnInit() {
    const code = this.route.snapshot.params['id']; // Route param is :id but we use it as code
    if (code && code !== 'new') {
      this.isEditMode = true;
      this.studentCode = code;
      this.studentService.getStudentByCode(code).subscribe({
        next: (student) => {
          this.studentForm.patchValue({
            studentCode: student.studentCode,
            fullName: student.fullName,
            dateOfBirth: student.dateOfBirth,
            gender: student.gender,
            email: student.email,
            phoneNumber: student.phoneNumber,
            address: student.address,
            className: student.className,
            course: student.course
          });
        },
        error: () => {
          alert('Student not found');
          this.router.navigate(['/students']);
        }
      });
    }
  }

  onSubmit() {
    if (this.studentForm.valid) {
      const formValue = this.studentForm.value;

      console.log('=== STUDENT FORM DEBUG ===');
      console.log('Form Value:', formValue);
      console.log('Is Edit Mode:', this.isEditMode);

      if (this.isEditMode && this.studentCode) {
        this.studentService.updateStudent(this.studentCode, formValue as any).subscribe({
          next: () => this.router.navigate(['/students']),
          error: (err) => {
            console.error('Update Error:', err);
            alert('Failed to update student');
          }
        });
      } else {
        this.studentService.createStudent(formValue as any).subscribe({
          next: () => this.router.navigate(['/students']),
          error: (err) => {
            console.error('Create Error:', err);
            console.error('Error Details:', err.error);
            alert('Failed to create student');
          }
        });
      }
    } else {
      console.log('Form is INVALID');
      console.log('Form Errors:', this.studentForm.errors);
      Object.keys(this.studentForm.controls).forEach(key => {
        const control = this.studentForm.get(key);
        if (control?.invalid) {
          console.log(`${key} is invalid:`, control.errors);
        }
      });
    }
  }
}
