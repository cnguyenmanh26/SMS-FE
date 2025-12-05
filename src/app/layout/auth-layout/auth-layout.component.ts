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
        <div class="glass p-8 rounded-2xl shadow-2xl border border-white/40">
          <div class="text-center mb-8">
            <div class="w-16 h-16 bg-indigo-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/30">
              <span class="text-3xl font-bold text-white font-heading">S</span>
            </div>
            <h2 class="text-3xl font-bold text-slate-800 font-heading">Welcome Back</h2>
            <p class="text-slate-500 mt-2">Sign in to access your dashboard</p>
          </div>
          <router-outlet></router-outlet>
        </div>
        
        <p class="text-center text-white/80 mt-6 text-sm">
          &copy; 2025 Student Management System
        </p>
      </div>
    </div>
  `
})
export class AuthLayoutComponent { }
