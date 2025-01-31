import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../environments/environment.development';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { iUser } from '../interfaces/i-user';
import { iAuthResponse } from '../interfaces/i-auth-response';
import { iLoginRequest } from '../interfaces/i-login-request';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  jwtHelper = new JwtHelperService();

  registerUrl: string = environment.registerUrl;
  loginUrl: string = environment.loginUrl;
  usersUrl: string = environment.usersUrl;

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

  register(newUser: Partial<iUser>) {
    return this.http.post<iAuthResponse>(this.registerUrl, newUser);
  }

  login(authData: iLoginRequest) {
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

    if (this.jwtHelper.isTokenExpired(accessData.accessToken)) {
      localStorage.removeItem('accessData');
      return;
    }

    this.authSubject$.next(accessData);
  }

  getAllUsers(): Observable<iUser[]> {
    return this.http.get<iUser[]>(this.usersUrl);
  }
}
