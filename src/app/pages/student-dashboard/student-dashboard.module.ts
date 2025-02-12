import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentDashboardRoutingModule } from './student-dashboard-routing.module';
import { StudentDashboardComponent } from './student-dashboard.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [StudentDashboardComponent],
  imports: [CommonModule, StudentDashboardRoutingModule, ReactiveFormsModule],
})
export class StudentDashboardModule {}
