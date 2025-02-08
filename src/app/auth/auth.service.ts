import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../environments/environment.development';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { iAuthResponse } from '../interfaces/i-auth-response';
import { iLoginRequest } from '../interfaces/i-login-request';
import { iRegisterDTO } from '../interfaces/i-register-dto';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  jwtHelper = new JwtHelperService();

  registerUrl: string = environment.registerUrl;
  registerStudentUrl: string = environment.registerStudentUrl;
  registerProfessionalUrl: string = environment.registerProfessionalUrl;
  loginUrl: string = environment.loginUrl;

  authSubject$ = new BehaviorSubject<iAuthResponse | null>(null);

  user$ = this.authSubject$
    .asObservable()
    .pipe(map((accessData) => accessData?.user));

  isLoggedIn$ = this.authSubject$
    .asObservable()
    .pipe(map((accessData) => !!accessData));

  autoLogoutTimer: any;

  constructor(private http: HttpClient, private router: Router) {
    this.restoreUser();
  }

  register(formData: FormData): Observable<iRegisterDTO> {
    return this.http.post<iRegisterDTO>(this.registerUrl, formData);
  }

  registerStudent(formData: FormData): Observable<iRegisterDTO> {
    return this.http.post<iRegisterDTO>(this.registerStudentUrl, formData);
  }

  registerProfessional(formData: FormData): Observable<iRegisterDTO> {
    return this.http.post<iRegisterDTO>(this.registerProfessionalUrl, formData);
  }

  login(authData: iLoginRequest): Observable<iAuthResponse> {
    return this.http.post<iAuthResponse>(this.loginUrl, authData).pipe(
      tap((accessData) => {
        this.authSubject$.next(accessData);
        localStorage.setItem('accessData', JSON.stringify(accessData));

        const expDate = this.jwtHelper.getTokenExpirationDate(
          accessData.accessToken
        );

        if (!expDate) return;

        this.autoLogout(expDate);
      })
    );
  }

  logout() {
    this.authSubject$.next(null);
    localStorage.removeItem('accessData');
    this.router.navigate(['/auth/login']);
  }

  autoLogout(expDate: Date) {
    const expMs = expDate.getTime() - new Date().getTime();

    this.autoLogoutTimer = setTimeout(() => {}, expMs);
  }

  restoreUser() {
    const userJson: string | null = localStorage.getItem('accessData');
    if (!userJson) return;
    const accessData: iAuthResponse = JSON.parse(userJson);

    this.authSubject$.next(accessData);
  }
}
