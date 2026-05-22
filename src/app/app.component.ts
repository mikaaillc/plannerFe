import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ChatbotComponent, NavbarComponent, CommonModule],
  template: `
    <app-navbar></app-navbar>
    <div [class.has-sidebar]="(authService.currentUser$ | async) !== null">
      <router-outlet></router-outlet>
    </div>
    <app-chatbot *ngIf="hasPaidSubscription()"></app-chatbot>
  `,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'frontend';
  private idleTimeout: any;
  private readonly IDLE_TIME = 5 * 60 * 1000; // 5 minutes

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.resetIdleTimeout();
      } else {
        this.clearIdleTimeout();
      }
    });
  }

  ngOnDestroy() {
    this.clearIdleTimeout();
  }

  hasPaidSubscription(): boolean {
    const user = this.authService.getCurrentUser();
    if (!user) return false;
    const s = user.subscriptionType;
    return s === 'PRO_PLANNER' || s === 'PREMIUM_PLANNER' || s === 'PRO_ENTITY';
  }

  @HostListener('window:mousemove')
  @HostListener('window:keydown')
  @HostListener('window:click')
  @HostListener('window:scroll')
  resetIdleTimeout() {
    if (this.authService.getCurrentUser()) {
      this.clearIdleTimeout();
      this.idleTimeout = setTimeout(() => {
        this.authService.logout();
        this.router.navigate(['/login']);
      }, this.IDLE_TIME);
    }
  }

  private clearIdleTimeout() {
    if (this.idleTimeout) {
      clearTimeout(this.idleTimeout);
      this.idleTimeout = null;
    }
  }
}
