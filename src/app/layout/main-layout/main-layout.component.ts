import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LoadingService } from '../../core/services/loading.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen flex bg-slate-50 font-sans">
      <!-- Sidebar -->
      <aside class="w-64 bg-slate-900 text-white flex flex-col shadow-xl z-20 transition-all duration-300">
        <div class="p-6 border-b border-slate-800 flex items-center gap-3">
          <div class="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-white">S</div>
          <h1 class="text-xl font-bold font-heading tracking-tight">SMS Portal</h1>
        </div>
        
        <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
          <a routerLink="/dashboard" routerLinkActive="bg-indigo-600 text-white shadow-lg shadow-indigo-500/30" 
             class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200 group">
             <span class="font-medium">Dashboard</span>
          </a>
          <a routerLink="/students" routerLinkActive="bg-indigo-600 text-white shadow-lg shadow-indigo-500/30" 
             class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200 group">
             <span class="font-medium">Students</span>
          </a>
          <a routerLink="/subjects" routerLinkActive="bg-indigo-600 text-white shadow-lg shadow-indigo-500/30" 
             class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200 group">
             <span class="font-medium">Subjects</span>
          </a>
          <a routerLink="/scores" routerLinkActive="bg-indigo-600 text-white shadow-lg shadow-indigo-500/30" 
             class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200 group">
             <span class="font-medium">Enrollments</span>
          </a>
        </nav>

        <div class="p-4 border-t border-slate-800">
          <button (click)="logout()" class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-all duration-200">
            <span class="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      <!-- Main Content Wrapper -->
      <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
        <!-- Header -->
        <header class="bg-white/80 backdrop-blur-md border-b border-slate-200 h-16 flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 class="text-xl font-semibold text-slate-800 font-heading">
            Overview
          </h2>
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div class="text-right hidden sm:block">
                <p class="text-sm font-semibold text-slate-700">{{ authService.currentUser()?.username }}</p>
                <p class="text-xs text-slate-500">Admin</p>
              </div>
              <div class="w-10 h-10 rounded-full bg-indigo-100 border-2 border-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
                {{ authService.currentUser()?.username?.charAt(0)?.toUpperCase() }}
              </div>
            </div>
          </div>
        </header>

        <!-- Main Content -->
        <main class="flex-1 overflow-auto p-8 relative scroll-smooth">
          <!-- Loading Overlay -->
          <div *ngIf="loadingService.isLoading()" class="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
            <div class="flex flex-col items-center gap-3">
              <div class="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <span class="text-sm font-medium text-indigo-600">Loading...</span>
            </div>
          </div>
          
          <div class="max-w-7xl mx-auto animate-fade-in">
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>
    </div>
  `
})
export class MainLayoutComponent {
  authService = inject(AuthService);
  loadingService = inject(LoadingService);

  logout(): void {
    this.authService.logout();
  }
}
