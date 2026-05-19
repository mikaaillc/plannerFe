import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, User } from '../services/auth.service';
import { OfferService } from '../services/offer.service';

@Component({
  selector: 'app-planners',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="planners-container">
      <!-- Navbar -->
      <nav class="navbar">
        <div class="nav-content">
          <button class="back-btn" (click)="router.navigate(['/dashboard'])">← Geri Dön</button>
          <h1>Şehir Plancıları</h1>
          <span class="user-badge" *ngIf="user">{{ user.fullName }}</span>
        </div>
      </nav>

      <div class="content">
        <div class="page-header">
          <h2>Plancıları Keşfedin</h2>
          <p>Projeleriniz için en uygun şehir plancısını bulun, profillerini inceleyin ve hemen teklif gönderin.</p>
          <span class="count-badge">{{ planners.length }} Plancı Listelendi</span>
        </div>

        <!-- Yükleniyor -->
        <div class="loading" *ngIf="loading">
          <div class="spinner"></div>
          <p>Plancılar yükleniyor...</p>
        </div>

        <!-- Plancı Kartları -->
        <div class="grid" *ngIf="!loading">
          <div class="planner-card" *ngFor="let planner of planners">

            <!-- Kart Başlık -->
            <div class="card-header">
              <div class="avatar">{{ getInitials(planner.fullName) }}</div>
              <div class="header-info">
                <h3>{{ planner.fullName }}</h3>
                <span class="role-tag">🏙️ Şehir Plancısı</span>
                <div class="meta-row">
                  <span class="meta-item" *ngIf="planner.location">📍 {{ planner.location }}</span>
                  <span class="meta-item" *ngIf="planner.phone">📞 {{ planner.phone }}</span>
                </div>
              </div>
            </div>

            <!-- Biyografi -->
            <div class="bio-section" *ngIf="planner.bio">
              <p>{{ planner.bio }}</p>
            </div>
            <div class="bio-section empty" *ngIf="!planner.bio">
              <p>Bu plancı henüz biyografi eklememiş.</p>
            </div>

            <!-- Uzmanlık Alanları -->
            <div class="skills-section" *ngIf="planner.skills">
              <h4>⚡ Uzmanlık Alanları</h4>
              <div class="skill-chips">
                <span class="chip" *ngFor="let skill of getSkills(planner.skills)">{{ skill }}</span>
              </div>
            </div>

            <!-- Tamamlanan İşler -->
            <div class="portfolio-section" *ngIf="planner.completedWorks">
              <h4>🏗️ Tamamlanan İşler</h4>
              <p class="portfolio-text" *ngIf="!planner._expanded">{{ truncate(planner.completedWorks, 180) }}</p>
              <button class="read-more" *ngIf="planner.completedWorks.length > 180" (click)="toggleExpand(planner)">
                {{ planner._expanded ? 'Daha Az Göster ↑' : 'Tamamını Gör ↓' }}
              </button>
              <p class="portfolio-text" *ngIf="planner._expanded">{{ planner.completedWorks }}</p>
            </div>
            <div class="portfolio-section empty" *ngIf="!planner.completedWorks">
              <h4>🏗️ Tamamlanan İşler</h4>
              <p>Henüz portfolyo bilgisi eklenmemiş.</p>
            </div>

            <!-- Teklif Gönder -->
            <div class="card-footer">
              <button class="btn-offer" (click)="openOfferModal(planner)">
                📨 Teklif Gönder
              </button>
            </div>

          </div>
        </div>

        <!-- Boş Durum -->
        <div class="empty-state" *ngIf="!loading && planners.length === 0">
          <div class="empty-icon">👤</div>
          <h3>Henüz kayıtlı plancı bulunmuyor</h3>
          <p>Sisteme plancı kaydı yapıldığında burada görünecekler.</p>
        </div>
      </div>

      <!-- Teklif Modalı -->
      <div class="modal-backdrop" *ngIf="showModal" (click)="showModal = false">
        <div class="modal-box" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>📨 Teklif Gönder</h3>
            <p>Alıcı: <strong>{{ selectedPlanner?.fullName }}</strong></p>
            <button class="close-btn" (click)="showModal = false">✕</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>Başlık</label>
              <input type="text" [(ngModel)]="newOffer.title" class="form-control"
                placeholder="Örn: X Bölgesi İmar Planı Hazırlanması" />
            </div>
            <div class="form-group">
              <label>İş Detayı / Açıklama</label>
              <textarea [(ngModel)]="newOffer.description" class="form-control" rows="4"
                placeholder="Projenin detaylarını açıklayın..."></textarea>
            </div>
            <div class="form-group">
              <label>Önerilen Ücret (₺)</label>
              <input type="number" [(ngModel)]="newOffer.proposedPrice" class="form-control" min="0" />
            </div>
          </div>
          <div class="modal-actions">
            <button class="btn-cancel" (click)="showModal = false">İptal</button>
            <button class="btn-send" (click)="sendOffer()" [disabled]="isSending">
              {{ isSending ? 'Gönderiliyor...' : '📨 Teklifi Gönder' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Toast Bildirimi -->
      <div class="toast" *ngIf="toastMsg">✅ {{ toastMsg }}</div>
    </div>
  `,
  styles: [`
    .planners-container { min-height: 100vh; background: #f1f5f9; font-family: 'Inter', sans-serif; }

    /* Navbar */
    .navbar { background: #1a202c; color: white; padding: 0.9rem 1.5rem; position: sticky; top: 0; z-index: 100; box-shadow: 0 2px 8px rgba(0,0,0,0.2); }
    .nav-content { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; gap: 1rem; }
    .back-btn { background: transparent; border: 1.5px solid rgba(255,255,255,0.3); color: white; padding: 0.4rem 0.9rem; border-radius: 6px; font-size: 0.875rem; cursor: pointer; transition: background 0.2s; white-space: nowrap; }
    .back-btn:hover { background: rgba(255,255,255,0.1); }
    .navbar h1 { margin: 0; font-size: 1.1rem; font-weight: 700; flex: 1; text-align: center; }
    .user-badge { background: #2d3748; padding: 0.35rem 0.9rem; border-radius: 20px; font-size: 0.8rem; white-space: nowrap; }

    /* Content */
    .content { max-width: 1200px; margin: 0 auto; padding: 2.5rem 1.5rem; }
    .page-header { margin-bottom: 2.5rem; }
    .page-header h2 { font-size: 2rem; color: #1a202c; margin-bottom: 0.5rem; }
    .page-header p { color: #718096; font-size: 1rem; margin-bottom: 1rem; }
    .count-badge { background: #ebf8ff; color: #2b6cb0; padding: 0.3rem 0.9rem; border-radius: 20px; font-size: 0.85rem; font-weight: 600; }

    /* Loading */
    .loading { text-align: center; padding: 4rem; color: #718096; }
    .spinner { width: 40px; height: 40px; border: 4px solid #e2e8f0; border-top-color: #4299e1; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 1rem; }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* Grid */
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(370px, 1fr)); gap: 1.75rem; }

    /* Card */
    .planner-card { background: white; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 2px 8px rgba(0,0,0,0.04); display: flex; flex-direction: column; overflow: hidden; transition: transform 0.2s, box-shadow 0.2s; }
    .planner-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0,0,0,0.08); }

    /* Card Header */
    .card-header { padding: 1.25rem 1.5rem; display: flex; gap: 1rem; align-items: flex-start; background: linear-gradient(135deg, #f8fafc 0%, #edf2f7 100%); border-bottom: 1px solid #e2e8f0; }
    .avatar { min-width: 54px; height: 54px; border-radius: 50%; background: linear-gradient(135deg, #4299e1, #38b2ac); color: white; font-size: 1.3rem; font-weight: 700; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 8px rgba(66,153,225,0.3); }
    .header-info { flex: 1; min-width: 0; }
    .header-info h3 { margin: 0 0 0.2rem; font-size: 1.05rem; color: #1a202c; font-weight: 700; }
    .role-tag { display: inline-block; background: #ebf8ff; color: #2b6cb0; padding: 0.15rem 0.6rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600; margin-bottom: 0.4rem; }
    .meta-row { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.2rem; }
    .meta-item { font-size: 0.78rem; color: #718096; background: white; padding: 0.15rem 0.5rem; border-radius: 6px; border: 1px solid #e2e8f0; }

    /* Bio */
    .bio-section { padding: 1rem 1.5rem; border-bottom: 1px solid #f0f4f8; }
    .bio-section p { font-size: 0.875rem; color: #4a5568; line-height: 1.65; margin: 0; }
    .bio-section.empty p { color: #a0aec0; font-style: italic; font-size: 0.825rem; }

    /* Skills */
    .skills-section { padding: 0.9rem 1.5rem; border-bottom: 1px solid #f0f4f8; }
    .skills-section h4 { font-size: 0.75rem; font-weight: 700; color: #718096; margin: 0 0 0.5rem; text-transform: uppercase; letter-spacing: 0.5px; }
    .skill-chips { display: flex; flex-wrap: wrap; gap: 0.35rem; }
    .chip { background: #ebf8ff; color: #2b6cb0; padding: 0.2rem 0.65rem; border-radius: 20px; font-size: 0.78rem; font-weight: 500; border: 1px solid #bee3f8; }

    /* Portfolio */
    .portfolio-section { padding: 0.9rem 1.5rem; flex: 1; }
    .portfolio-section h4 { font-size: 0.75rem; font-weight: 700; color: #718096; margin: 0 0 0.5rem; text-transform: uppercase; letter-spacing: 0.5px; }
    .portfolio-text { font-size: 0.875rem; color: #4a5568; line-height: 1.6; margin: 0; white-space: pre-line; }
    .portfolio-section.empty h4 { color: #a0aec0; }
    .portfolio-section.empty p { font-size: 0.825rem; color: #a0aec0; font-style: italic; margin: 0; }
    .read-more { background: none; border: none; color: #4299e1; font-size: 0.8rem; font-weight: 600; cursor: pointer; padding: 0.3rem 0; display: block; margin-top: 0.4rem; }
    .read-more:hover { text-decoration: underline; }

    /* Footer */
    .card-footer { padding: 1.1rem 1.5rem; border-top: 1px solid #edf2f7; background: #fafbfc; }
    .btn-offer { width: 100%; padding: 0.7rem; background: linear-gradient(135deg, #4299e1, #3182ce); color: white; border: none; border-radius: 8px; font-weight: 600; font-size: 0.9rem; cursor: pointer; transition: all 0.2s; box-shadow: 0 2px 6px rgba(66,153,225,0.25); }
    .btn-offer:hover { background: linear-gradient(135deg, #3182ce, #2b6cb0); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(66,153,225,0.35); }

    /* Empty state */
    .empty-state { text-align: center; padding: 5rem 2rem; background: white; border-radius: 16px; border: 2px dashed #e2e8f0; }
    .empty-icon { font-size: 3rem; margin-bottom: 1rem; }
    .empty-state h3 { color: #4a5568; margin-bottom: 0.5rem; }
    .empty-state p { color: #a0aec0; }

    /* Modal */
    .modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.55); display: flex; justify-content: center; align-items: center; z-index: 1000; padding: 1rem; backdrop-filter: blur(4px); }
    .modal-box { background: white; border-radius: 16px; width: 100%; max-width: 500px; box-shadow: 0 25px 50px rgba(0,0,0,0.25); overflow: hidden; }
    .modal-header { padding: 1.25rem 1.5rem; border-bottom: 1px solid #edf2f7; position: relative; }
    .modal-header h3 { margin: 0 0 0.2rem; color: #1a202c; font-size: 1.05rem; }
    .modal-header p { margin: 0; font-size: 0.85rem; color: #718096; }
    .close-btn { position: absolute; top: 1rem; right: 1rem; background: #f7fafc; border: none; width: 28px; height: 28px; border-radius: 50%; cursor: pointer; font-size: 0.85rem; color: #4a5568; }
    .close-btn:hover { background: #e2e8f0; }
    .modal-body { padding: 1.25rem 1.5rem; }
    .form-group { margin-bottom: 1rem; }
    .form-group label { display: block; font-size: 0.875rem; font-weight: 600; color: #4a5568; margin-bottom: 0.35rem; }
    .form-control { width: 100%; padding: 0.7rem 0.9rem; border: 1.5px solid #e2e8f0; border-radius: 8px; font-size: 0.95rem; box-sizing: border-box; font-family: inherit; transition: border-color 0.2s; }
    .form-control:focus { outline: none; border-color: #4299e1; box-shadow: 0 0 0 3px rgba(66,153,225,0.15); }
    .modal-actions { display: flex; gap: 0.75rem; padding: 1rem 1.5rem; border-top: 1px solid #edf2f7; }
    .btn-cancel { flex: 1; padding: 0.7rem; border: 1.5px solid #e2e8f0; border-radius: 8px; background: white; color: #4a5568; font-weight: 600; cursor: pointer; }
    .btn-cancel:hover { background: #f7fafc; }
    .btn-send { flex: 2; padding: 0.7rem; background: #4299e1; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
    .btn-send:hover:not(:disabled) { background: #3182ce; }
    .btn-send:disabled { background: #a0aec0; cursor: not-allowed; }

    /* Toast */
    .toast { position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%); background: #276749; color: white; padding: 0.85rem 2rem; border-radius: 10px; font-weight: 600; font-size: 0.9rem; box-shadow: 0 8px 24px rgba(0,0,0,0.2); z-index: 9999; animation: slideUp 0.3s ease; white-space: nowrap; }
    @keyframes slideUp { from { opacity: 0; transform: translateX(-50%) translateY(20px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }

    /* Mobile */
    @media (max-width: 768px) {
      .nav-content { flex-wrap: wrap; }
      .navbar h1 { order: -1; width: 100%; text-align: left; font-size: 1rem; }
      .grid { grid-template-columns: 1fr; }
      .modal-actions { flex-direction: column; }
      .content { padding: 1.5rem 1rem; }
      .toast { width: 90%; text-align: center; white-space: normal; }
    }
  `]
})
export class PlannersComponent implements OnInit {
  user: User | null = null;
  planners: any[] = [];
  loading = true;

  showModal = false;
  selectedPlanner: any = null;
  isSending = false;
  toastMsg = '';

  newOffer = {
    title: '',
    description: '',
    proposedPrice: 0,
    receiverId: null as any
  };

  constructor(
    private authService: AuthService,
    private offerService: OfferService,
    public router: Router
  ) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    if (!this.user || this.user.role !== 'ROLE_ENTITY') {
      this.router.navigate(['/dashboard']);
      return;
    }

    this.authService.getAllUsers().subscribe(users => {
      this.planners = users
        .filter((u: any) => u.role === 'ROLE_PLANNER')
        .map((u: any) => ({ ...u, _expanded: false }));
      this.loading = false;
    });
  }

  getInitials(name: string): string {
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  }

  getSkills(skills: string): string[] {
    return skills.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0);
  }

  truncate(text: string, max: number): string {
    return text.length <= max ? text : text.slice(0, max) + '...';
  }

  toggleExpand(planner: any) {
    planner._expanded = !planner._expanded;
  }

  openOfferModal(planner: any) {
    this.selectedPlanner = planner;
    this.newOffer = { title: '', description: '', proposedPrice: 0, receiverId: planner.id };
    this.showModal = true;
  }

  sendOffer() {
    if (!this.user || !this.selectedPlanner) return;
    this.isSending = true;
    const data = { ...this.newOffer, senderId: this.user.id };
    this.offerService.createOffer(data).subscribe({
      next: () => {
        this.isSending = false;
        this.showModal = false;
        this.toastMsg = `${this.selectedPlanner.fullName} adlı plancıya teklif gönderildi!`;
        setTimeout(() => this.toastMsg = '', 3500);
      },
      error: () => {
        this.isSending = false;
      }
    });
  }
}
