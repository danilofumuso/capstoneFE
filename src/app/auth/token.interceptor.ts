import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authSvc: AuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const accessData = this.authSvc.authSubject$.getValue();
    if (!accessData) {
      return next.handle(request);
    }

    const newRequest = request.clone({
      headers: request.headers.append(
        'Authorization',
        `Bearer ${accessData.accessToken}`
      ),
    });

    return next.handle(newRequest).pipe(
      catchError((error) => {
        if (error.status === 401) {
          this.authSvc.logout();
        }
        return throwError(() => error);
      })
    );
  }
}
