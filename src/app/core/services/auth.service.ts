import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
    id: number;
    username: string;
    email: string;
    studentCode: string | null;
    roles: string[];
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface JwtResponse {
    token: string;
    type: string;
    id: number;
    username: string;
    email: string;
    studentCode: string | null;
    roles: string[];
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = environment.apiUrl || 'http://localhost:8080/api';
    currentUser = signal<User | null>(null);
    private tokenKey = 'jwt_token';

    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        this.loadUserFromToken();
    }

    private loadUserFromToken(): void {
        const token = this.getToken();
        if (token) {
            // Decode JWT to get user info (simple base64 decode)
            try {
                const payload = this.decodeToken(token);
                if (payload && !this.isTokenExpired(payload)) {
                    // Load user from stored data
                    const storedUser = localStorage.getItem('current_user');
                    if (storedUser) {
                        this.currentUser.set(JSON.parse(storedUser));
                    }
                } else {
                    this.clearAuth();
                }
            } catch (error) {
                this.clearAuth();
            }
        }
    }

    login(username: string, password: string): Observable<ApiResponse<JwtResponse>> {
        const loginRequest: LoginRequest = { username, password };

        return this.http.post<ApiResponse<JwtResponse>>(`${this.apiUrl}/auth/login`, loginRequest)
            .pipe(
                tap(response => {
                    if (response.success && response.data) {
                        const jwtData = response.data;

                        // Store token
                        this.setToken(jwtData.token);

                        // Create user object
                        const user: User = {
                            id: jwtData.id,
                            username: jwtData.username,
                            email: jwtData.email,
                            studentCode: jwtData.studentCode,
                            roles: jwtData.roles
                        };

                        // Store user
                        this.currentUser.set(user);
                        localStorage.setItem('current_user', JSON.stringify(user));

                        // Role-based redirect
                        if (user.roles.includes('ROLE_ADMIN')) {
                            this.router.navigate(['/dashboard']);
                        } else if (user.roles.includes('ROLE_USER')) {
                            this.router.navigate(['/profile']);
                        }
                    }
                })
            );
    }

    logout(): void {
        this.clearAuth();
        this.router.navigate(['/auth/login']);
    }

    private clearAuth(): void {
        this.currentUser.set(null);
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem('current_user');
    }

    isAuthenticated(): boolean {
        const token = this.getToken();
        if (!token) return false;

        try {
            const payload = this.decodeToken(token);
            return payload && !this.isTokenExpired(payload);
        } catch {
            return false;
        }
    }

    hasRole(role: string): boolean {
        const user = this.currentUser();
        return user ? user.roles.includes(role) : false;
    }

    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    private setToken(token: string): void {
        localStorage.setItem(this.tokenKey, token);
    }

    private decodeToken(token: string): any {
        try {
            const parts = token.split('.');
            if (parts.length !== 3) {
                return null;
            }
            const payload = parts[1];
            const decoded = atob(payload);
            return JSON.parse(decoded);
        } catch (error) {
            return null;
        }
    }

    private isTokenExpired(payload: any): boolean {
        if (!payload.exp) return false;
        const expirationDate = new Date(payload.exp * 1000);
        return expirationDate < new Date();
    }
}
