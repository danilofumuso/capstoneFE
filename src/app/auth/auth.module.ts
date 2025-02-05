import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';

import { ReactiveFormsModule } from '@angular/forms';
import { RegisterStudentComponent } from './register-student/register-student.component';
import { RegisterProfessionalComponent } from './register-professional/register-professional.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    RegisterStudentComponent,
    RegisterProfessionalComponent,
  ],
  imports: [CommonModule, AuthRoutingModule, ReactiveFormsModule, NgbModule],
})
export class AuthModule {}
