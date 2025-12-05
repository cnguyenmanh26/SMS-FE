import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentService } from '../students/student.service';
import { SubjectService } from '../subjects/subject.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-gray-500 text-sm font-medium">Total Students</h3>
        <p class="text-3xl font-bold text-blue-600 mt-2">{{ totalStudents() }}</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-gray-500 text-sm font-medium">Total Subjects</h3>
        <p class="text-3xl font-bold text-green-600 mt-2">{{ totalSubjects() }}</p>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  studentService = inject(StudentService);
  subjectService = inject(SubjectService);

  totalStudents = signal<number>(0);
  totalSubjects = signal<number>(0);

  ngOnInit() {
    this.studentService.getAllStudents().subscribe(data => this.totalStudents.set(data.length));
    this.subjectService.getAllSubjects().subscribe(data => this.totalSubjects.set(data.length));
  }
}
