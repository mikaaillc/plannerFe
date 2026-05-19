import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { ThemeService } from '../services/theme.service';
import { API_URL } from '../config';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="register-container">
      <!-- Dark/Light Theme Toggle for Register Screen -->
      <label class="theme-switch register-theme-toggle">
  <input type="checkbox" [checked]="themeService.isDark()" (change)="themeService.toggleTheme()">
  <span class="slider round">
    <span class="icon sun">☀️</span>
    <span class="icon moon">🌙</span>
  </span>
</label>

      <div class="register-card">
        <h2 (click)="router.navigate(['/'])" style="cursor:pointer; text-align:center; color:#4299e1;">&larr; CityPlanner</h2>
        <h3>Hesap Oluştur</h3>
        <p class="subtitle">Platforma katılmak için bilgilerinizi girin.</p>
        
        <div class="form-group">
          <label>Kullanıcı Türü</label>
          <select [(ngModel)]="user.role" class="form-control">
            <option value="ROLE_PLANNER">Şehir Plancısı</option>
            <option value="ROLE_ENTITY">Kurum / Tüzel Kişi</option>
          </select>
        </div>

        <div class="form-group">
          <label>Kullanıcı Adı</label>
          <input type="text" [(ngModel)]="user.username" class="form-control" placeholder="Örn: ahmet123" />
        </div>

        <div class="form-group">
          <label>Şifre</label>
          <input type="password" [(ngModel)]="user.password" class="form-control" placeholder="Şifreniz" />
        </div>

        <div class="form-group">
          <label>{{user.role === 'ROLE_PLANNER' ? 'Ad Soyad' : 'Kurum/Firma Adı'}}</label>
          <input type="text" [(ngModel)]="user.fullName" class="form-control" placeholder="Tam adınızı girin" />
        </div>

        <div class="form-group" *ngIf="user.role === 'ROLE_PLANNER'">
          <label>Tamamladığınız İşler / Portfolyo</label>
          <textarea [(ngModel)]="user.completedWorks" class="form-control" rows="4" placeholder="Geçmişte yaptığınız projelerden bahsedin..."></textarea>
        </div>

        <button class="btn btn-primary" (click)="register()" [disabled]="isLoading">
          {{isLoading ? 'Kayıt Yapılıyor...' : 'Kayıt Ol'}}
        </button>
        
        <div *ngIf="error" class="error-msg">{{error}}</div>
        
        <p class="login-link">Zaten hesabınız var mı? <a routerLink="/login">Giriş Yapın</a></p>
      </div>
    </div>
  `,
  styles: [`
    .register-container { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: var(--bg-primary); font-family: 'Inter', sans-serif; padding: 2rem; box-sizing: border-box; position: relative; }
    .register-theme-toggle { position: absolute; top: 1.5rem; right: 1.5rem; z-index: 100; }
    .register-card { background: var(--card-bg); padding: 2.5rem; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); width: 100%; max-width: 450px; border: 1px solid var(--border-color); }
    h3 { text-align: center; margin-top: 1rem; margin-bottom: 0.5rem; color: var(--text-primary); font-size: 1.5rem; }
    .subtitle { text-align: center; color: var(--text-secondary); margin-bottom: 2rem; font-size: 0.95rem; }
    .form-group { margin-bottom: 1.25rem; }
    .form-group label { display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-weight: 500; font-size: 0.95rem; }
    .form-control { width: 100%; padding: 0.75rem; border: 1px solid var(--input-border); border-radius: 6px; box-sizing: border-box; font-size: 1rem; font-family: inherit; transition: border-color 0.2s; background: var(--input-bg); color: var(--text-primary); }
    .form-control:focus { outline: none; border-color: var(--primary-color); box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2); }
    .btn { width: 100%; padding: 0.85rem; border: none; border-radius: 6px; cursor: pointer; color: white; font-size: 1rem; font-weight: 600; transition: background-color 0.2s; margin-top: 1rem; }
    .btn-primary { background: var(--primary-color); }
    .btn-primary:hover { background: var(--primary-hover); }
    .btn-primary:disabled { background: var(--text-muted); cursor: not-allowed; }
    .error-msg { color: #e53e3e; margin-top: 1rem; text-align: center; font-size: 0.875rem; background: #fed7d7; padding: 0.5rem; border-radius: 4px; }
    .login-link { text-align: center; margin-top: 1.5rem; font-size: 0.9rem; color: var(--text-secondary); }
    .login-link a { color: var(--primary-color); text-decoration: none; font-weight: 600; }
    
    @media (max-width: 480px) {
      .register-container { padding: 1rem; }
      .register-card { padding: 1.5rem; }
    }
  `]
})
export class RegisterComponent {
  user = {
    username: '',
    password: '',
    fullName: '',
    role: 'ROLE_PLANNER',
    completedWorks: ''
  };
  error = '';
  isLoading = false;

  // Render Backend URL
  private apiUrl = API_URL + '/auth/register';

  constructor(
    private http: HttpClient,
    public router: Router,
    public themeService: ThemeService
  ) {}

  register() {
    if (!this.user.username || !this.user.password || !this.user.fullName) {
      this.error = 'Lütfen zorunlu alanları doldurun.';
      return;
    }

    this.isLoading = true;
    this.error = '';

    this.http.post(this.apiUrl, this.user).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err.error || 'Kayıt işlemi başarısız oldu. Kullanıcı adı alınmış olabilir.';
      }
    });
  }
}
