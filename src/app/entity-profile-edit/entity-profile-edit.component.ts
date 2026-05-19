import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService, User } from '../services/auth.service';

@Component({
  selector: 'app-entity-profile-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <nav class="navbar">
        <div class="nav-content">
          <button class="back-btn" (click)="router.navigate(['/dashboard'])">← Dashboard'a Dön</button>
          <span class="page-title">Kurum Profilim</span>
          <span class="user-chip">{{ user?.fullName }}</span>
        </div>
      </nav>

      <div class="page-body">

        <!-- Sol: Önizleme -->
        <aside class="preview-panel">
          <div class="preview-card">
            <div class="avatar-circle entity">{{ getInitials() }}</div>
            <h2>{{ form.fullName || user?.fullName }}</h2>
            <span class="role-badge">🏢 Tüzel Kişi / Kurum</span>
            <p class="preview-location" *ngIf="form.location">📍 {{ form.location }}</p>
            <p class="preview-phone" *ngIf="form.phone">📞 {{ form.phone }}</p>
            <p class="preview-website" *ngIf="form.website">🌐 {{ form.website }}</p>

            <div class="preview-bio" *ngIf="form.bio">
              <h4>Hakkımızda</h4>
              <p>{{ form.bio }}</p>
            </div>

            <div class="skill-chips" *ngIf="form.skills">
              <span class="chip" *ngFor="let s of getSkillList()">{{ s }}</span>
            </div>
          </div>
        </aside>

        <!-- Sağ: Form -->
        <main class="edit-panel">
          <div class="section-card">
            <h3 class="section-title">🏢 Kurum Bilgileri</h3>
            <div class="form-row">
              <div class="form-group">
                <label>Kurum / Firma Adı</label>
                <input class="form-control" type="text" [(ngModel)]="form.fullName" placeholder="Kurum adınız" />
              </div>
              <div class="form-group">
                <label>Konum / Şehir</label>
                <input class="form-control" type="text" [(ngModel)]="form.location" placeholder="Örn: İstanbul, Türkiye" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Telefon</label>
                <input class="form-control" type="text" [(ngModel)]="form.phone" placeholder="+90 212 000 00 00" />
              </div>
              <div class="form-group">
                <label>Web Sitesi</label>
                <input class="form-control" type="text" [(ngModel)]="form.website" placeholder="https://kurumunuz.com" />
              </div>
            </div>
          </div>

          <div class="section-card">
            <h3 class="section-title">📝 Hakkımızda</h3>
            <div class="form-group">
              <label>Kurumunuzu tanıtın</label>
              <textarea class="form-control" rows="4" [(ngModel)]="form.bio"
                placeholder="Kurumunuzun faaliyet alanları, misyonu ve vizyonu hakkında bilgi verin..."></textarea>
            </div>
          </div>

          <div class="section-card">
            <h3 class="section-title">🎯 Faaliyet Alanları</h3>
            <div class="form-group">
              <label>Sektörler / Faaliyet Alanları <small>(virgülle ayırın)</small></label>
              <input class="form-control" type="text" [(ngModel)]="form.skills"
                placeholder="Örn: Kentsel Dönüşüm, İmar Planlaması, Altyapı" />
              <div class="skill-preview" *ngIf="form.skills">
                <span class="chip" *ngFor="let s of getSkillList()">{{ s }}</span>
              </div>
            </div>
          </div>

          <div class="section-card">
            <h3 class="section-title">🏗️ Geçmiş Projeler</h3>
            <div class="form-group">
              <label>Tamamlanan veya devam eden projeler</label>
              <textarea class="form-control" rows="7" [(ngModel)]="form.completedWorks"
                placeholder="Örn:
• 2024 - Kadıköy Kentsel Dönüşüm Projesi (10.000 konut)
• 2023 - Başakşehir Yeni Mahalle İmar Çalışması
• 2022 - İzmir Büyükşehir Çevre Yolu Planlaması
..."></textarea>
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
    .page { min-height: 100vh; background: #f1f5f9; font-family: 'Inter', sans-serif; }
    .navbar { background: #1a202c; color: white; padding: 0.9rem 1.5rem; position: sticky; top: 0; z-index: 100; }
    .nav-content { display: flex; align-items: center; gap: 1rem; max-width: 1200px; margin: 0 auto; }
    .back-btn { background: transparent; border: 1.5px solid rgba(255,255,255,0.3); color: white; padding: 0.4rem 1rem; border-radius: 6px; font-size: 0.875rem; cursor: pointer; white-space: nowrap; }
    .back-btn:hover { background: rgba(255,255,255,0.1); }
    .page-title { font-size: 1rem; font-weight: 600; flex: 1; text-align: center; }
    .user-chip { background: #2d3748; padding: 0.35rem 0.9rem; border-radius: 20px; font-size: 0.8rem; white-space: nowrap; }

    .page-body { display: grid; grid-template-columns: 300px 1fr; gap: 2rem; max-width: 1200px; margin: 2rem auto; padding: 0 1.5rem; }
    .preview-panel { position: sticky; top: 70px; align-self: start; }
    .preview-card { background: white; border-radius: 16px; padding: 2rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
    .avatar-circle { width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #805ad5, #d53f8c); color: white; font-size: 2rem; font-weight: 700; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; }
    .preview-card h2 { font-size: 1.25rem; color: #2d3748; margin-bottom: 0.5rem; }
    .role-badge { background: #faf5ff; color: #6b46c1; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600; display: inline-block; margin-bottom: 1rem; }
    .preview-location, .preview-phone, .preview-website { font-size: 0.875rem; color: #718096; margin-bottom: 0.25rem; }
    .preview-bio { margin-top: 1rem; text-align: left; border-top: 1px solid #edf2f7; padding-top: 1rem; }
    .preview-bio h4 { font-size: 0.875rem; color: #4a5568; margin-bottom: 0.5rem; }
    .preview-bio p { font-size: 0.85rem; color: #718096; line-height: 1.6; }
    .skill-chips, .skill-preview { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 1rem; justify-content: center; }
    .chip { background: #faf5ff; color: #6b46c1; padding: 0.2rem 0.7rem; border-radius: 20px; font-size: 0.8rem; font-weight: 500; border: 1px solid #e9d8fd; }
    .skill-preview { justify-content: flex-start; margin-top: 0.75rem; }

    .edit-panel { display: flex; flex-direction: column; gap: 1.5rem; }
    .section-card { background: white; border-radius: 12px; padding: 1.75rem; box-shadow: 0 2px 4px rgba(0,0,0,0.04); border: 1px solid #e2e8f0; }
    .section-title { font-size: 1rem; font-weight: 700; color: #2d3748; margin-bottom: 1.25rem; padding-bottom: 0.75rem; border-bottom: 2px solid #edf2f7; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .form-group { margin-bottom: 1rem; }
    .form-group:last-child { margin-bottom: 0; }
    .form-group label { display: block; font-weight: 500; font-size: 0.875rem; color: #4a5568; margin-bottom: 0.4rem; }
    .form-group label small { font-weight: 400; color: #a0aec0; }
    .form-control { width: 100%; padding: 0.7rem 0.9rem; border: 1.5px solid #e2e8f0; border-radius: 8px; font-size: 0.95rem; color: #2d3748; transition: border-color 0.2s; resize: vertical; box-sizing: border-box; }
    .form-control:focus { outline: none; border-color: #805ad5; box-shadow: 0 0 0 3px rgba(128,90,213,0.15); }

    .save-bar { display: flex; align-items: center; justify-content: flex-end; gap: 1rem; flex-wrap: wrap; }
    .btn { padding: 0.8rem 2rem; border: none; border-radius: 8px; font-weight: 600; font-size: 1rem; cursor: pointer; transition: all 0.2s; }
    .btn-primary { background: #805ad5; color: white; }
    .btn-primary:hover:not(:disabled) { background: #6b46c1; transform: translateY(-1px); }
    .btn-primary:disabled { background: #a0aec0; cursor: not-allowed; }
    .success-msg { background: #c6f6d5; color: #276749; padding: 0.6rem 1rem; border-radius: 8px; font-size: 0.875rem; font-weight: 500; }
    .error-msg { background: #fed7d7; color: #9b2c2c; padding: 0.6rem 1rem; border-radius: 8px; font-size: 0.875rem; font-weight: 500; }

    @media (max-width: 768px) {
      .page-body { grid-template-columns: 1fr; padding: 0 1rem; margin: 1rem auto; }
      .preview-panel { position: static; }
      .form-row { grid-template-columns: 1fr; }
      .save-bar { justify-content: stretch; }
      .btn { width: 100%; }
    }
  `]
})
export class EntityProfileEditComponent implements OnInit {
  user: User | null = null;
  isSaving = false;
  successMsg = '';
  errorMsg = '';

  form = {
    fullName: '', bio: '', skills: '', completedWorks: '',
    location: '', phone: '', website: ''
  };

  private apiUrl = 'https://plannerbe.onrender.com/api/users';

  constructor(private authService: AuthService, private http: HttpClient, public router: Router) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    if (!this.user) { this.router.navigate(['/login']); return; }
    if (this.user.role !== 'ROLE_ENTITY') { this.router.navigate(['/dashboard']); return; }

    this.http.get<any>(`${this.apiUrl}/${this.user.id}`).subscribe(data => {
      this.form = {
        fullName: data.fullName || '',
        bio: data.bio || '',
        skills: data.skills || '',
        completedWorks: data.completedWorks || '',
        location: data.location || '',
        phone: data.phone || '',
        website: data.phone || ''
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
      next: (updated) => {
        this.isSaving = false;
        this.successMsg = 'Profiliniz başarıyla güncellendi!';
        const stored = JSON.parse(localStorage.getItem('currentUser') || '{}');
        localStorage.setItem('currentUser', JSON.stringify({ ...stored, ...updated }));
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: () => {
        this.isSaving = false;
        this.errorMsg = 'Kayıt sırasında bir hata oluştu.';
      }
    });
  }
}
