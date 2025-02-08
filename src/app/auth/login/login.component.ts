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

  response: boolean = false;
  toastMessage?: string;

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
          this.response = true;
          this.toastMessage = 'Logged in successfully!';
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1000);
        },
        error: () => {
          this.response = false;
          this.toastMessage = 'Incorrect credentials!';
          setTimeout(() => {
            this.clearToast();
          }, 3000);
        },
      });
    }
  }
  clearToast(): void {
    this.toastMessage = '';
    this.response = false;
  }
}
