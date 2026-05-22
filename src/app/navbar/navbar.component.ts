import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { AuthService, User } from '../services/auth.service';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  user: User | null = null;
  isSidebarOpen = false;

  constructor(
    public themeService: ThemeService,
    public authService: AuthService,
    public router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
    });
  }

  goHome() {
    this.router.navigate(['/']);
  }

  goToLogin() {
    if (this.router.url === '/login') {
      window.location.reload();
    } else {
      this.router.navigate(['/login']);
    }
  }

  logout() {
    this.authService.logout();
    this.closeSidebar();
    this.router.navigate(['/login']);
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }
}