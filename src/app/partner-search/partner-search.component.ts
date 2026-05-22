import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService, User } from '../services/auth.service';
import { API_URL } from '../config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-partner-search',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="partner-search-container">
      <div class="header">
        <h2>Partner Bulma Sistemi</h2>
        <p>Premium Plancı avantajıyla diğer plancılarla iletişime geçin ve ortaklık kurun.</p>
      </div>

      <div *ngIf="isLoading" class="loading">Yükleniyor...</div>
      
      <div *ngIf="!isLoading && error" class="error-msg">{{error}}</div>

      <div class="planners-grid" *ngIf="!isLoading && !error">
        <div class="planner-card" *ngFor="let planner of filteredPlanners">
          <div class="card-header">
            <h3>{{ planner.fullName }}</h3>
            <span class="badge" [ngClass]="'karne-' + planner.karne">{{ planner.karne }} Grubu</span>
          </div>
          <div class="card-body">
            <p class="bio">{{ planner.bio }}</p>
            <p><strong>Konum:</strong> {{ planner.location || 'Belirtilmedi' }}</p>
            <p><strong>Uzmanlık:</strong> {{ planner.skills || 'Belirtilmedi' }}</p>
          </div>
          <div class="card-footer">
            <button class="btn btn-primary" (click)="contactPlanner(planner)">İletişime Geç</button>
          </div>
        </div>
        
        <div *ngIf="filteredPlanners.length === 0" class="no-data">
          Şu anda kriterlerinize uygun partner bulunamadı.
        </div>
      </div>
    </div>
  `,
  styles: [`
    .partner-search-container { padding: 2rem; max-width: 1200px; margin: 0 auto; color: var(--text-primary); }
    .header { margin-bottom: 2rem; text-align: center; }
    .header h2 { font-size: 2rem; margin-bottom: 0.5rem; color: var(--primary-color); }
    .header p { color: var(--text-secondary); }
    
    .planners-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
    
    .planner-card { background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; display: flex; flex-direction: column; overflow: hidden; transition: transform 0.2s, box-shadow 0.2s; }
    .planner-card:hover { transform: translateY(-3px); box-shadow: 0 8px 12px rgba(0,0,0,0.1); }
    
    .card-header { padding: 1.5rem; border-bottom: 1px solid var(--border-light); display: flex; justify-content: space-between; align-items: center; background: var(--bg-secondary); }
    .card-header h3 { margin: 0; font-size: 1.1rem; color: var(--text-primary); }
    
    .badge { padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.8rem; font-weight: bold; color: white; }
    .karne-A { background: #e53e3e; }
    .karne-B { background: #dd6b20; }
    .karne-C { background: #d69e2e; }
    .karne-D { background: #38a169; }
    .karne-E { background: #3182ce; }
    .karne-F { background: #805ad5; }
    
    .card-body { padding: 1.5rem; flex-grow: 1; display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.9rem; color: var(--text-secondary); }
    .bio { margin-bottom: 1rem; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
    
    .card-footer { padding: 1.5rem; border-top: 1px solid var(--border-light); background: var(--bg-secondary); }
    .btn { width: 100%; padding: 0.75rem; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
    .btn-primary { background: var(--primary-color); color: white; }
    .btn-primary:hover { background: var(--primary-hover); }
    
    .error-msg { color: #e53e3e; text-align: center; font-size: 1.1rem; font-weight: bold; margin-top: 2rem; }
    .no-data { grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-muted); font-size: 1.1rem; }
  `]
})
export class PartnerSearchComponent implements OnInit {
  currentUser: User | null = null;
  filteredPlanners: User[] = [];
  isLoading = true;
  error = '';

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser || this.currentUser.role !== 'ROLE_PLANNER') {
      this.router.navigate(['/']);
      return;
    }

    if (this.currentUser.subscriptionType !== 'PREMIUM_PLANNER') {
      this.error = 'Partner arama özelliği sadece PREMIUM plancılar içindir.';
      this.isLoading = false;
      return;
    }

    this.fetchPartners();
  }

  fetchPartners() {
    this.http.get<User[]>(`${API_URL}/planners/partners?userId=${this.currentUser?.id}`)
      .subscribe({
        next: (data) => {
          // Frontend filter: show all for now, or could filter by higher Karne.
          this.filteredPlanners = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error(err);
          if (err.error && typeof err.error === 'string') {
            this.error = err.error;
          } else {
            this.error = 'Partnerler yüklenirken bir hata oluştu.';
          }
          this.isLoading = false;
        }
      });
  }

  contactPlanner(planner: User) {
    alert(`Ortaklık isteği gönderildi: ${planner.fullName}\n\n(Bu işlem şimdilik simüle edilmektedir. Gerçek sistemde mesajlaşma veya e-posta gönderimi sağlanacaktır.)`);
  }
}
