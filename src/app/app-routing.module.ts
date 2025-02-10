import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuestGuard } from './auth/guards/guest.guard';
import { AuthGuard } from './auth/guards/auth.guard';
import { RoleGuard } from './auth/guards/role.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
    canActivate: [GuestGuard],
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomeModule),
    canActivate: [AuthGuard, RoleGuard],
  },
  {
    path: '',
    loadChildren: () =>
      import('./pages/landing-page/landing-page.module').then(
        (m) => m.LandingPageModule
      ),
    canActivate: [GuestGuard],
  },
  {
    path: 'favourite',
    loadChildren: () =>
      import('./pages/favourite/favourite.module').then(
        (m) => m.FavouriteModule
      ),
    canActivate: [AuthGuard, RoleGuard],
  },
  {
    path: 'studentDashboard',
    loadChildren: () =>
      import('./pages/student-dashboard/student-dashboard.module').then(
        (m) => m.StudentDashboardModule
      ),
    canActivate: [AuthGuard, RoleGuard],
  },
  {
    path: 'professionalDashboard',
    loadChildren: () =>
      import(
        './pages/professional-dashboard/professional-dashboard.module'
      ).then((m) => m.ProfessionalDashboardModule),
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
