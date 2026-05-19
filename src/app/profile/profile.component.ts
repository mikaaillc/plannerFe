import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService, User } from '../services/auth.service';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="profile-page">
      <!-- Navbar -->
      <nav class="navbar">
        <div class="nav-content">
          <button class="back-btn" (click)="router.navigate(['/dashboard'])">
            ← Dashboard'a Dön
          </button>
          <span class="page-title">Profilimi Düzenle</span>
          <label class="theme-switch">
  <input type="checkbox" [checked]="themeService.isDark()" (change)="themeService.toggleTheme()">
  <span class="slider round">
    <span class="icon sun">☀️</span>
    <span class="icon moon">🌙</span>
  </span>
</label>
          <span class="user-chip">{{ user?.fullName }}</span>
        </div>
      </nav>

      <div class="page-body">

        <!-- Sol: Profil Önizleme Kartı -->
        <aside class="preview-panel">
          <div class="preview-card">
            <div class="avatar-circle">{{ getInitials() }}</div>
            <h2>{{ form.fullName || user?.fullName }}</h2>
            <span class="role-badge">Şehir Plancısı</span>
            <p class="preview-location" *ngIf="form.location">
              📍 {{ form.location }}
            </p>
            <p class="preview-phone" *ngIf="form.phone">
              📞 {{ form.phone }}
            </p>

            <div class="skill-chips" *ngIf="form.skills">
              <span class="chip" *ngFor="let s of getSkillList()">{{ s }}</span>
            </div>

            <div class="preview-bio" *ngIf="form.bio">
              <h4>Hakkımda</h4>
              <p>{{ form.bio }}</p>
            </div>
          </div>
        </aside>

        <!-- Sağ: Düzenleme Formu -->
        <main class="edit-panel">
          <div class="section-card">
            <h3 class="section-title">👤 Kişisel Bilgiler</h3>
            <div class="form-row">
              <div class="form-group">
                <label>Ad Soyad</label>
                <input class="form-control" type="text" [(ngModel)]="form.fullName" placeholder="Adınız Soyadınız" />
              </div>
              <div class="form-group">
                <label>Konum / Şehir</label>
                <input class="form-control" type="text" [(ngModel)]="form.location" placeholder="Örn: İstanbul, Türkiye" />
              </div>
            </div>
            <div class="form-group">
              <label>Telefon Numarası</label>
              <input class="form-control" type="text" [(ngModel)]="form.phone" placeholder="+90 555 000 00 00" />
            </div>
          </div>

          <div class="section-card">
            <h3 class="section-title">📝 Hakkımda / Biyografi</h3>
            <div class="form-group">
              <label>Kendinizi tanıtın</label>
              <textarea class="form-control" rows="4" [(ngModel)]="form.bio"
                placeholder="Şehir plancısı olarak deneyimlerinizi, uzmanlık alanlarınızı ve çalışma felsefenizi kısaca tanıtın..."></textarea>
            </div>
          </div>

          <div class="section-card">
            <h3 class="section-title">⚡ Uzmanlık Alanları</h3>
            <div class="form-group">
              <label>Beceriler <small>(virgülle ayırın)</small></label>
              <input class="form-control" type="text" [(ngModel)]="form.skills"
                placeholder="Örn: İmar Planlaması, Kentsel Tasarım, CBS, Çevre Planlama" />
              <div class="skill-preview" *ngIf="form.skills">
                <span class="chip" *ngFor="let s of getSkillList()">{{ s }}</span>
              </div>
            </div>
          </div>

          <div class="section-card">
            <h3 class="section-title">🏗️ Tamamlanan İşler / Portfolyo</h3>
            <div class="form-group">
              <label>Geçmiş Projeler ve Deneyimler</label>
              <textarea class="form-control" rows="8" [(ngModel)]="form.completedWorks"
                placeholder="Örn:
• 2023 - İstanbul Kartal Bölgesi İmar Planı (5000 dönüm)
• 2022 - Ankara Çankaya Kentsel Dönüşüm Projesi
• 2021 - İzmir Konak Kıyı Düzenlemesi
...
Projelerinizi madde madde açıklayabilirsiniz."></textarea>
            </div>
          </div>

          <div class="save-bar">
            <div *ngIf="successMsg" class="success-msg">✅ {{ successMsg }}</div>
            <div *ngIf="errorMsg" class="error-msg">❌ {{ errorMsg }}</div>
            <button class="btn btn-primary" (click)="save()" [disabled]="isSaving">
              {{ isSaving ? 'Kaydediliyor...' : '💾 Profili Kaydet' }}
            </button>
          </div>
        </main>

      </div>
    </div>
  `,
  styles: [`
    /* Layout */
    .profile-page { min-height: 100vh; background: var(--bg-primary); color: var(--text-primary); font-family: 'Inter', sans-serif; }

    /* Navbar */
    .navbar { background: var(--bg-navbar); color: white; padding: 0.9rem 1.5rem; position: sticky; top: 0; z-index: 100; }
    .nav-content { display: flex; align-items: center; gap: 1rem; max-width: 1200px; margin: 0 auto; }
    .back-btn { background: transparent; border: 1.5px solid rgba(255,255,255,0.3); color: white; padding: 0.4rem 1rem; border-radius: 6px; font-size: 0.875rem; cursor: pointer; transition: background 0.2s; white-space: nowrap; }
    .back-btn:hover { background: rgba(255,255,255,0.1); }
    .page-title { font-size: 1rem; font-weight: 600; flex: 1; text-align: center; }
    .user-chip { background: #2d3748; padding: 0.35rem 0.9rem; border-radius: 20px; font-size: 0.8rem; white-space: nowrap; color: white; }

    /* Page body */
    .page-body { display: grid; grid-template-columns: 300px 1fr; gap: 2rem; max-width: 1200px; margin: 2rem auto; padding: 0 1.5rem; }

    /* Preview panel */
    .preview-panel { position: sticky; top: 70px; align-self: start; }
    .preview-card { background: var(--card-bg); border-radius: 16px; padding: 2rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid var(--border-color); }
    .avatar-circle { width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, var(--primary-color), #38b2ac); color: white; font-size: 2rem; font-weight: 700; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; }
    .preview-card h2 { font-size: 1.25rem; color: var(--text-primary); margin-bottom: 0.5rem; }
    .role-badge { background: #ebf8ff; color: #2b6cb0; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600; display: inline-block; margin-bottom: 1rem; }
    .preview-location, .preview-phone { font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 0.25rem; }
    .preview-bio { margin-top: 1rem; text-align: left; border-top: 1px solid var(--border-light); padding-top: 1rem; }
    .preview-bio h4 { font-size: 0.875rem; color: var(--text-primary); margin-bottom: 0.5rem; }
    .preview-bio p { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6; }

    /* Skill chips */
    .skill-chips, .skill-preview { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 1rem; justify-content: center; }
    .chip { background: #ebf8ff; color: #2b6cb0; padding: 0.2rem 0.7rem; border-radius: 20px; font-size: 0.8rem; font-weight: 500; }
    .skill-preview { justify-content: flex-start; margin-top: 0.75rem; }

    /* Edit panel */
    .edit-panel { display: flex; flex-direction: column; gap: 1.5rem; }
    .section-card { background: var(--card-bg); border-radius: 12px; padding: 1.75rem; box-shadow: 0 2px 4px rgba(0,0,0,0.04); border: 1px solid var(--border-color); }
    .section-title { font-size: 1rem; font-weight: 700; color: var(--text-primary); margin-bottom: 1.25rem; padding-bottom: 0.75rem; border-bottom: 2px solid var(--border-light); }

    /* Form elements */
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .form-group { margin-bottom: 1rem; }
    .form-group:last-child { margin-bottom: 0; }
    .form-group label { display: block; font-weight: 500; font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 0.4rem; }
    .form-group label small { font-weight: 400; color: var(--text-muted); }
    .form-control { background: var(--input-bg); width: 100%; padding: 0.7rem 0.9rem; border: 1.5px solid var(--input-border); border-radius: 8px; font-size: 0.95rem; color: var(--text-primary); transition: border-color 0.2s, box-shadow 0.2s; resize: vertical; }
    .form-control:focus { outline: none; border-color: var(--primary-color); box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.15); }

    /* Save bar */
    .save-bar { display: flex; align-items: center; justify-content: flex-end; gap: 1rem; flex-wrap: wrap; }
    .btn { padding: 0.8rem 2rem; border: none; border-radius: 8px; font-weight: 600; font-size: 1rem; transition: all 0.2s; }
    .btn-primary { background: var(--primary-color); color: white; }
    .btn-primary:hover:not(:disabled) { background: var(--primary-hover); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(66,153,225,0.35); }
    .btn-primary:disabled { background: var(--text-muted); cursor: not-allowed; }
    .success-msg { background: #c6f6d5; color: #276749; padding: 0.6rem 1rem; border-radius: 8px; font-size: 0.875rem; font-weight: 500; }
    .error-msg { background: #fed7d7; color: #9b2c2c; padding: 0.6rem 1rem; border-radius: 8px; font-size: 0.875rem; font-weight: 500; }

    /* Mobile */
    @media (max-width: 768px) {
      .page-body { grid-template-columns: 1fr; padding: 0 1rem; margin: 1rem auto; }
      .preview-panel { position: static; }
      .form-row { grid-template-columns: 1fr; }
      .save-bar { justify-content: stretch; }
      .btn { width: 100%; }
      .nav-content { flex-wrap: wrap; }
      .page-title { order: -1; width: 100%; text-align: left; }
    }
  `]
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  isSaving = false;
  successMsg = '';
  errorMsg = '';

  form = {
    fullName: '',
    bio: '',
    skills: '',
    completedWorks: '',
    location: '',
    phone: ''
  };

  private apiUrl = 'http://localhost:8080/api/users';

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    public router: Router,
    public themeService: ThemeService
  ) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    if (!this.user) {
      this.router.navigate(['/login']);
      return;
    }
    if (this.user.role !== 'ROLE_PLANNER') {
      this.router.navigate(['/dashboard']);
      return;
    }

    // En güncel profil bilgilerini sunucudan çek
    this.http.get<any>(`${this.apiUrl}/${this.user.id}`).subscribe(data => {
      this.form = {
        fullName: data.fullName || '',
        bio: data.bio || '',
        skills: data.skills || '',
        completedWorks: data.completedWorks || '',
        location: data.location || '',
        phone: data.phone || ''
      };
    });
  }

  getInitials(): string {
    const name = this.form.fullName || this.user?.fullName || '';
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  }

  getSkillList(): string[] {
    return (this.form.skills || '').split(',').map(s => s.trim()).filter(s => s.length > 0);
  }

  save() {
    this.isSaving = true;
    this.successMsg = '';
    this.errorMsg = '';

    this.http.put<any>(`${this.apiUrl}/${this.user?.id}`, this.form).subscribe({
      next: (updatedUser) => {
        this.isSaving = false;
        this.successMsg = 'Profiliniz başarıyla güncellendi!';

        // LocalStorage'daki kullanıcı bilgisini de güncelle
        const stored = JSON.parse(localStorage.getItem('currentUser') || '{}');
        const merged = { ...stored, ...updatedUser };
        localStorage.setItem('currentUser', JSON.stringify(merged));

        setTimeout(() => this.successMsg = '', 3000);
      },
      error: () => {
        this.isSaving = false;
        this.errorMsg = 'Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.';
      }
    });
  }
}
