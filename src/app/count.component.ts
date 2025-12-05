// // File: src/app/count.component.ts
// import { Component, inject } from '@angular/core';
// import { StudentService } from './student.service'; // 1. Import Service

// @Component({
//     selector: 'app-coun', // Tên thẻ HTML do mình tự đặt
//     standalone: true,
//     // Viết HTML trực tiếp ở đây cho nhanh (gọi là Inline Template)
//     template: `
//     <div class="box-dem">
//       <h3>📊 Thống kê (Component B)</h3>
//       <p>Tổng số sinh viên hiện tại: <strong>{{ studentService.danhSachSV().length }}</strong></p>
//     </div>
//   `,
//     styles: [`
//     .box-dem { background: #ffeb3b; padding: 10px; margin-bottom: 20px; border-radius: 8px; border: 1px solid #fbc02d; }
//   `]
// })
// export class CountComponent {
//     // 2. Inject Service (Y hệt bên App Component)
//     // Angular sẽ đưa đúng cái service đang chứa dữ liệu cho component này
//     studentService = inject(StudentService);
// }