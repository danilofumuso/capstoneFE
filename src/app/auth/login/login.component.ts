import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { iLoginRequest } from '../../interfaces/i-login-request';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  formData: iLoginRequest = {
    username: '',
    password: '',
  };

  constructor(private authSvc: AuthService, private router: Router) {}

  login() {
    this.authSvc.login(this.formData).subscribe((data) => {
      this.router.navigate(['/profilePage']);
    });
  }
}
