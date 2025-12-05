import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { LoadingService } from '../services/loading.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const loadingService = inject(LoadingService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            loadingService.hide();
            console.error('API Error:', error);
            // Handle specific error codes here (e.g., 401, 403)
            return throwError(() => error);
        })
    );
};
