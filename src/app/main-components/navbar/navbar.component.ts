import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Role } from '../../enums/role';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  isMenuCollapsed: boolean = true;
  isLoggedIn: boolean = true;
  isStudent: boolean = false;
  dashboardLink: string = '';

  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });

    this.authService.user$.subscribe((user) => {
      if (user?.roles.includes(Role.ROLE_STUDENT)) {
        this.isStudent = true;
        this.dashboardLink = '/studentDashboard';
      } else if (user?.roles.includes(Role.ROLE_PROFESSIONAL)) {
        this.isStudent = false;
        this.dashboardLink = '/professionalDashboard';
      }
    });
  }

  toggleMenu(): void {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }

  closeMenu(): void {
    this.isMenuCollapsed = true;
  }

  logout() {
    this.authService.logout();
  }
}
