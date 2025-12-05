import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { authGuard } from './core/auth/auth.guard';
import { adminGuard } from './core/auth/admin.guard';
import { userGuard } from './core/auth/user.guard';

export const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [authGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            {
                path: 'dashboard',
                canActivate: [adminGuard],
                loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
            },
            {
                path: 'profile',
                canActivate: [userGuard],
                loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent)
            },
            {
                path: 'students',
                canActivate: [adminGuard],
                loadComponent: () => import('./features/students/student-list.component').then(m => m.StudentListComponent)
            },
            {
                path: 'students/new',
                canActivate: [adminGuard],
                loadComponent: () => import('./features/students/student-form.component').then(m => m.StudentFormComponent)
            },
            {
                path: 'students/:code/detail',
                canActivate: [adminGuard],
                loadComponent: () => import('./features/students/student-detail.component').then(m => m.StudentDetailComponent)
            },
            {
                path: 'students/:id',
                canActivate: [adminGuard],
                loadComponent: () => import('./features/students/student-form.component').then(m => m.StudentFormComponent)
            },
            {
                path: 'subjects',
                canActivate: [adminGuard],
                loadComponent: () => import('./features/subjects/subject-list.component').then(m => m.SubjectListComponent)
            },
            {
                path: 'subjects/new',
                canActivate: [adminGuard],
                loadComponent: () => import('./features/subjects/subject-form.component').then(m => m.SubjectFormComponent)
            },
            {
                path: 'subjects/:id',
                canActivate: [adminGuard],
                loadComponent: () => import('./features/subjects/subject-form.component').then(m => m.SubjectFormComponent)
            },
            {
                path: 'scores',
                canActivate: [adminGuard],
                loadComponent: () => import('./features/scores/score-list.component').then(m => m.ScoreListComponent)
            },
            {
                path: 'scores/new',
                canActivate: [adminGuard],
                loadComponent: () => import('./features/scores/score-form.component').then(m => m.ScoreFormComponent)
            }
        ]
    },
    {
        path: 'auth',
        component: AuthLayoutComponent,
        children: [
            {
                path: 'login',
                loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
            }
        ]
    },
    { path: '**', redirectTo: '' }
];
