import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService, User } from '../services/auth.service';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard">
      <div class="content" *ngIf="user">
        <div class="welcome-section">
          <h2>Hoş Geldiniz, {{ user.fullName }}</h2>
          <p>CityPlanner platformuna hoş geldiniz. Hızlı erişim menüsünü kullanarak işlemlerinizi gerçekleştirebilirsiniz.</p>
        </div>

        <div class="quick-links">
          <!-- Entity Links -->
          <ng-container *ngIf="user.role === 'ROLE_ENTITY'">
            <div class="link-card" routerLink="/job-create">
              <h3>Yeni İş Oluştur</h3>
              <p>Planlama veya danışmanlık işleri için ilan açın.</p>
            </div>
            <div class="link-card" routerLink="/entity-jobs">
              <h3>İşlerim</h3>
              <p>Açtığınız ilanları yönetin ve gelen teklifleri değerlendirin.</p>
            </div>
          </ng-container>

          <!-- Planner Links -->
          <ng-container *ngIf="user.role === 'ROLE_PLANNER'">
            <div class="link-card" routerLink="/available-jobs">
              <h3>Açık İşler</h3>
              <p>Kurumların açtığı yeni iş fırsatlarını inceleyin ve teklif verin.</p>
            </div>
            <div class="link-card" routerLink="/accepted-jobs">
              <h3>Kabul Edilen Planlarım</h3>
              <p>Anlaşma sağladığınız işlerin detaylarına ulaşın.</p>
            </div>
          </ng-container>

          <div class="link-card" [routerLink]="user.role === 'ROLE_ENTITY' ? '/entity-profile' : '/profile'">
            <h3>Profilim</h3>
            <p>Profil bilgilerinizi güncelleyin ve portfolyonuzu düzenleyin.</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard { min-height: 100vh; background: var(--bg-primary); color: var(--text-primary); padding: 2rem; }
    .content { max-width: 1000px; margin: 0 auto; }
    .welcome-section { margin-bottom: 3rem; text-align: center; }
    .welcome-section h2 { font-size: 2rem; margin-bottom: 0.5rem; color: var(--primary-color); }
    .welcome-section p { color: var(--text-secondary); font-size: 1.1rem; }
    .quick-links { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; }
    .link-card { background: var(--card-bg); padding: 2rem; border-radius: 12px; border: 1px solid var(--border-color); cursor: pointer; transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s; text-align: center; }
    .link-card:hover { transform: translateY(-5px); box-shadow: 0 10px 15px rgba(0,0,0,0.1); border-color: var(--primary-color); }
    .link-card h3 { margin-top: 0; color: var(--text-primary); margin-bottom: 1rem; }
    .link-card p { margin: 0; color: var(--text-secondary); font-size: 0.95rem; line-height: 1.5; }
  `]
})
export class DashboardComponent implements OnInit {
  user: User | null = null;

  constructor(
    private authService: AuthService,
    public router: Router,
    public themeService: ThemeService
  ) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    if (!this.user) {
      this.router.navigate(['/login']);
    }
  }
}

