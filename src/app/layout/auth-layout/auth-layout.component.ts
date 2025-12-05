import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-white/10 opacity-20"></div>
      
      <div class="w-full max-w-md relative z-10">
        <router-outlet></router-outlet>
        
        <p class="text-center text-white/80 mt-6 text-sm">
          &copy; 2025 Student Management System
        </p>
      </div>
    </div>
  `
})
export class AuthLayoutComponent { }
