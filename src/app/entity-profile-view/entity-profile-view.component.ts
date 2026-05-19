import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-entity-profile-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <nav class="navbar">
        <div class="nav-content">
          <button class="back-btn" (click)="router.navigate(['/dashboard'])">← Geri Dön</button>
          <span class="page-title">Kurum Profili</span>
          <span></span>
        </div>
      </nav>

      <!-- Yükleniyor -->
      <div class="loading" *ngIf="loading">
        <div class="spinner"></div>
        <p>Profil yükleniyor...</p>
      </div>

      <div class="profile-wrapper" *ngIf="!loading && entity">
        <!-- Üst Hero -->
        <div class="hero-section">
          <div class="avatar-large">{{ getInitials(entity.fullName) }}</div>
          <div class="hero-info">
            <h1>{{ entity.fullName }}</h1>
            <span class="role-badge">🏢 Tüzel Kişi / Kurum</span>
            <div class="meta-row">
              <span class="meta-item" *ngIf="entity.location">📍 {{ entity.location }}</span>
              <span class="meta-item" *ngIf="entity.phone">📞 {{ entity.phone }}</span>
              <span class="meta-item" *ngIf="entity.website">🌐 {{ entity.website }}</span>
            </div>
          </div>
        </div>

        <div class="content-grid">
          <!-- Hakkımızda -->
          <div class="info-card full-width" *ngIf="entity.bio">
            <h2>📝 Hakkımızda</h2>
            <p>{{ entity.bio }}</p>
          </div>

          <!-- Faaliyet Alanları -->
          <div class="info-card" *ngIf="entity.skills">
            <h2>🎯 Faaliyet Alanları</h2>
            <div class="chip-list">
              <span class="chip" *ngFor="let s of getSkills(entity.skills)">{{ s }}</span>
            </div>
          </div>

          <!-- Geçmiş Projeler -->
          <div class="info-card" *ngIf="entity.completedWorks">
            <h2>🏗️ Geçmiş Projeler</h2>
            <p class="projects-text">{{ entity.completedWorks }}</p>
          </div>
        </div>

        <!-- Boş Profil -->
        <div class="empty-profile" *ngIf="!entity.bio && !entity.skills && !entity.completedWorks">
          <div class="empty-icon">🏢</div>
          <h3>{{ entity.fullName }}</h3>
          <p>Bu kurum henüz profil bilgilerini doldurmamış.</p>
        </div>
      </div>

      <!-- Bulunamadı -->
      <div class="not-found" *ngIf="!loading && !entity">
        <p>Kurum bulunamadı.</p>
        <button (click)="router.navigate(['/dashboard'])">Geri Dön</button>
      </div>
    </div>
  `,
  styles: [`
    .page { min-height: 100vh; background: #f1f5f9; font-family: 'Inter', sans-serif; }
    .navbar { background: #1a202c; color: white; padding: 0.9rem 1.5rem; position: sticky; top: 0; z-index: 100; }
    .nav-content { display: flex; align-items: center; justify-content: space-between; max-width: 900px; margin: 0 auto; }
    .back-btn { background: transparent; border: 1.5px solid rgba(255,255,255,0.3); color: white; padding: 0.4rem 1rem; border-radius: 6px; font-size: 0.875rem; cursor: pointer; }
    .back-btn:hover { background: rgba(255,255,255,0.1); }
    .page-title { font-weight: 600; font-size: 1rem; }

    .loading { text-align: center; padding: 5rem; color: #718096; }
    .spinner { width: 40px; height: 40px; border: 4px solid #e2e8f0; border-top-color: #805ad5; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 1rem; }
    @keyframes spin { to { transform: rotate(360deg); } }

    .profile-wrapper { max-width: 900px; margin: 2rem auto; padding: 0 1.5rem; }

    .hero-section { background: white; border-radius: 16px; padding: 2.5rem; display: flex; gap: 2rem; align-items: center; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; margin-bottom: 2rem; }
    .avatar-large { min-width: 90px; height: 90px; border-radius: 50%; background: linear-gradient(135deg, #805ad5, #d53f8c); color: white; font-size: 2.2rem; font-weight: 700; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 16px rgba(128,90,213,0.3); }
    .hero-info h1 { margin: 0 0 0.5rem; font-size: 1.75rem; color: #1a202c; }
    .role-badge { background: #faf5ff; color: #6b46c1; padding: 0.3rem 0.9rem; border-radius: 20px; font-size: 0.85rem; font-weight: 600; display: inline-block; margin-bottom: 0.75rem; }
    .meta-row { display: flex; flex-wrap: wrap; gap: 0.5rem; }
    .meta-item { font-size: 0.875rem; color: #718096; background: #f7fafc; padding: 0.25rem 0.6rem; border-radius: 6px; border: 1px solid #e2e8f0; }

    .content-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
    .info-card { background: white; border-radius: 12px; padding: 1.75rem; box-shadow: 0 2px 4px rgba(0,0,0,0.04); border: 1px solid #e2e8f0; }
    .info-card.full-width { grid-column: 1 / -1; }
    .info-card h2 { margin: 0 0 1rem; font-size: 1rem; color: #2d3748; padding-bottom: 0.75rem; border-bottom: 2px solid #edf2f7; }
    .info-card p { margin: 0; color: #4a5568; line-height: 1.7; font-size: 0.95rem; }
    .projects-text { white-space: pre-line; }

    .chip-list { display: flex; flex-wrap: wrap; gap: 0.5rem; }
    .chip { background: #faf5ff; color: #6b46c1; padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.825rem; font-weight: 500; border: 1px solid #e9d8fd; }

    .empty-profile { text-align: center; padding: 4rem 2rem; background: white; border-radius: 16px; border: 2px dashed #e2e8f0; }
    .empty-icon { font-size: 3rem; margin-bottom: 1rem; }
    .empty-profile h3 { color: #4a5568; margin-bottom: 0.5rem; }
    .empty-profile p { color: #a0aec0; }

    .not-found { text-align: center; padding: 4rem; }

    @media (max-width: 768px) {
      .hero-section { flex-direction: column; text-align: center; padding: 1.5rem; }
      .meta-row { justify-content: center; }
      .content-grid { grid-template-columns: 1fr; }
      .info-card.full-width { grid-column: 1; }
      .profile-wrapper { padding: 0 1rem; margin: 1rem auto; }
    }
  `]
})
export class EntityProfileViewComponent implements OnInit {
  entity: any = null;
  loading = true;

  private apiUrl = 'https://plannerbe.onrender.com/api/users';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    public router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.http.get<any>(`${this.apiUrl}/${id}`).subscribe({
        next: (data) => {
          if (data && data.role === 'ROLE_ENTITY') {
            this.entity = data;
          }
          this.loading = false;
        },
        error: () => { this.loading = false; }
      });
    } else {
      this.loading = false;
    }
  }

  getInitials(name: string): string {
    return name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || '?';
  }

  getSkills(skills: string): string[] {
    return skills.split(',').map(s => s.trim()).filter(s => s.length > 0);
  }
}
