import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const user = authService.currentUser();

    if (user && user.roles.includes('ROLE_ADMIN')) {
        return true;
    }

    // If USER role, redirect to profile
    if (user && user.roles.includes('ROLE_USER')) {
        router.navigate(['/profile']);
        return false;
    }

    // Not authenticated
    router.navigate(['/auth/login']);
    return false;
};
