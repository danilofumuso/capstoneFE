import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { iLoginRequest } from '../../interfaces/i-login-request';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { iAuthResponse } from '../../interfaces/i-auth-response';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  form!: FormGroup;
  alertMessage?: string;
  alertType: 'success' | 'danger' = 'success';

  constructor(
    private authSvc: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  onSubmit(event: Event) {
    event.preventDefault();
    if (this.form.valid) {
      this.login();
    }
  }

  ngOnInit() {
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  login() {
    if (this.form.valid) {
      const formData: iLoginRequest = this.form.value;
      this.authSvc.login(formData).subscribe({
        next: () => {
          this.alertType = 'success';
          this.alertMessage = 'Logged in successfully';
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1000);
        },
        error: () => {
          this.alertType = 'danger';
          this.alertMessage = 'Error while logging in, please try again';
        },
      });
    }
  }

  clearAlert(): void {
    this.alertMessage = '';
  }
}
