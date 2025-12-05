import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const userGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const user = authService.currentUser();

    if (user && user.roles.includes('ROLE_USER')) {
        return true;
    }

    // If ADMIN role, redirect to dashboard
    if (user && user.roles.includes('ROLE_ADMIN')) {
        router.navigate(['/dashboard']);
        return false;
    }

    // Not authenticated
    router.navigate(['/auth/login']);
    return false;
};
