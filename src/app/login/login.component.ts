import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h2>Giriş Yap</h2>
        <div class="form-group">
          <label>Kullanıcı Adı</label>
          <input type="text" [(ngModel)]="username" class="form-control" placeholder="planner1 veya entity1" />
        </div>
        <div class="form-group">
          <label>Şifre</label>
          <input type="password" [(ngModel)]="password" class="form-control" placeholder="pass" (keyup.enter)="login()" />
        </div>
        <button class="btn btn-primary" (click)="login()">Giriş</button>
        <div *ngIf="error" class="error-msg">{{error}}</div>
      </div>
    </div>
  `,
  styles: [`
    .login-container { display: flex; justify-content: center; align-items: center; height: 100vh; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); font-family: 'Inter', sans-serif; }
    .login-card { background: white; padding: 2.5rem; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); width: 100%; max-width: 400px; }
    h2 { text-align: center; margin-top: 0; color: #2d3748; }
    .form-group { margin-bottom: 1.5rem; }
    .form-group label { display: block; margin-bottom: 0.5rem; color: #4a5568; font-weight: 500; }
    .form-control { width: 100%; padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 6px; box-sizing: border-box; font-size: 1rem; transition: border-color 0.2s; }
    .form-control:focus { outline: none; border-color: #4299e1; box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2); }
    .btn { width: 100%; padding: 0.75rem; border: none; border-radius: 6px; cursor: pointer; color: white; font-size: 1rem; font-weight: 600; transition: background-color 0.2s, transform 0.1s; }
    .btn-primary { background: #4299e1; }
    .btn-primary:hover { background: #3182ce; }
    .btn:active { transform: translateY(1px); }
    .error-msg { color: #e53e3e; margin-top: 1rem; text-align: center; font-size: 0.875rem; }
  `]
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.username, this.password).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: () => this.error = 'Hatalı kullanıcı adı veya şifre'
    });
  }
}
