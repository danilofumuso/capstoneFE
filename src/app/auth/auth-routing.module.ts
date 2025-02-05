import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { RegisterStudentComponent } from './register-student/register-student.component';
import { RegisterProfessionalComponent } from './register-professional/register-professional.component';

const routes: Routes = [
  { path: '', component: AuthComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registerStudent', component: RegisterStudentComponent },
  { path: 'registerProfessional', component: RegisterProfessionalComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
