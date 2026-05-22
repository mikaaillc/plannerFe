import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { JobService } from '../services/job.service';
import { AuthService, User } from '../services/auth.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <div class="content-wrapper">
        <button class="back-btn" (click)="goBack()">🔙 Geri Dön</button>
        
        <div *ngIf="isLoading" class="loading">Yükleniyor...</div>
        <div *ngIf="error" class="error-msg">{{ error }}</div>

        <div *ngIf="job && !isLoading" class="detail-card">
          <div class="card-header">
            <div class="header-main">
              <span class="badge" [ngClass]="job.jobType === 'PLANLAMA' ? 'badge-blue' : 'badge-green'">
                {{ job.jobType }}
              </span>
              <span class="badge badge-purple" *ngIf="job.status === 'OPEN'">AÇIK</span>
            </div>
            <h1 class="job-title">{{ job.title }}</h1>
            <p class="job-location" *ngIf="job.locationDetails">📍 {{ job.locationDetails }}</p>
          </div>

          <div class="card-body">
            <div class="info-section">
              <h3>Genel Açıklama</h3>
              <p class="description">{{ job.description }}</p>
            </div>

            <div class="info-grid">
              <div class="info-box">
                <span class="box-label">İşveren Kurum</span>
                <span class="box-value">{{ job.creator?.fullName }} ({{ job.creator?.entityType === 'KAMU' ? 'Kamu' : 'Tüzel' }})</span>
              </div>
              <div class="info-box">
                <span class="box-label">İstenen Karne</span>
                <span class="box-value">{{ job.minKarne }} Grubu ve Üstü</span>
              </div>
              <div class="info-box" *ngIf="job.priceRangeMin && job.priceRangeMax">
                <span class="box-label">Bütçe Aralığı</span>
                <span class="box-value">{{ job.priceRangeMin | currency:'TRY':'symbol':'1.0-0' }} - {{ job.priceRangeMax | currency:'TRY':'symbol':'1.0-0' }}</span>
              </div>
            </div>

            <!-- PLANLAMA DETAYLARI -->
            <div class="planner-details-section" *ngIf="job.jobType === 'PLANLAMA'">
              <h3>📋 Planlama & Teknik Detaylar</h3>
              
              <div class="info-box" *ngIf="job.areaSize">
                <span class="box-label">Planlama Alanı</span>
                <span class="box-value">{{ job.areaSize }} Hektar</span>
              </div>

              <div class="specs-grid">
                <div class="spec-item" [ngClass]="{'has-it': job.isNazimImarPlani, 'lacks-it': !job.isNazimImarPlani}">
                  <span class="icon">{{ job.isNazimImarPlani ? '✅' : '❌' }}</span>
                  <span class="text">1/5000 Nazım İmar Planı</span>
                </div>
                <div class="spec-item" [ngClass]="{'has-it': job.isUygulamaImarPlani, 'lacks-it': !job.isUygulamaImarPlani}">
                  <span class="icon">{{ job.isUygulamaImarPlani ? '✅' : '❌' }}</span>
                  <span class="text">1/1000 Uygulama İmar Planı</span>
                </div>
                <div class="spec-item" [ngClass]="{'has-it': job.hasHalihazirHarita, 'lacks-it': !job.hasHalihazirHarita}">
                  <span class="icon">{{ job.hasHalihazirHarita ? '✅' : '❌' }}</span>
                  <span class="text">Onaylı Hâlihazır Harita</span>
                </div>
                <div class="spec-item" [ngClass]="{'has-it': job.hasZeminEtudu, 'lacks-it': !job.hasZeminEtudu}">
                  <span class="icon">{{ job.hasZeminEtudu ? '✅' : '❌' }}</span>
                  <span class="text">Onaylı Zemin Etüdü</span>
                </div>
                <div class="spec-item" [ngClass]="{'has-it': job.hasKurumGorusleri, 'lacks-it': !job.hasKurumGorusleri}">
                  <span class="icon">{{ job.hasKurumGorusleri ? '✅' : '❌' }}</span>
                  <span class="text">Kurum Görüşleri</span>
                </div>
                <div class="spec-item" [ngClass]="{'has-it': job.isParselasyon, 'lacks-it': !job.isParselasyon}">
                  <span class="icon">{{ job.isParselasyon ? '✅' : '❌' }}</span>
                  <span class="text">Parselasyon (18. Madde)</span>
                </div>
              </div>
            </div>

            <!-- EK BİLGİLER / ADA PARSEL -->
            <div class="info-section" *ngIf="job.detailedInfo">
              <h3>📌 Ek Mülkiyet / Ada-Parsel Bilgisi</h3>
              <p class="description">{{ job.detailedInfo }}</p>
            </div>

          </div>

          <!-- Aksiyon -->
          <div class="card-footer" *ngIf="isPlannerAndJobOpen()">
            <button class="btn btn-primary" (click)="goToMakeOffer()">Teklif Ver / Başvur</button>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { min-height: 100vh; background: var(--bg-primary); font-family: 'Inter', sans-serif; padding: 2rem; color: var(--text-primary); }
    .content-wrapper { max-width: 800px; margin: 0 auto; }
    
    .back-btn { background: transparent; border: 1px solid var(--border-color); color: var(--text-secondary); padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; margin-bottom: 1.5rem; transition: all 0.2s; font-weight: 500; }
    .back-btn:hover { background: var(--card-bg); color: var(--primary-color); border-color: var(--primary-color); }
    
    .detail-card { background: var(--card-bg); border-radius: 12px; border: 1px solid var(--border-color); box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden; }
    
    .card-header { padding: 2rem; border-bottom: 1px solid var(--border-light); }
    .header-main { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
    .badge { padding: 0.35rem 0.75rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600; }
    .badge-blue { background: #ebf8ff; color: #2b6cb0; }
    .badge-green { background: #f0fff4; color: #2f855a; }
    .badge-purple { background: #faf5ff; color: #6b46c1; }
    
    .job-title { margin: 0 0 0.5rem 0; font-size: 1.75rem; font-weight: 700; color: var(--text-primary); }
    .job-location { margin: 0; color: var(--text-secondary); font-size: 0.95rem; }
    
    .card-body { padding: 2rem; }
    .info-section { margin-bottom: 2rem; }
    .info-section h3 { margin-top: 0; margin-bottom: 0.75rem; font-size: 1.1rem; color: var(--text-primary); }
    .description { line-height: 1.6; color: var(--text-secondary); font-size: 1rem; white-space: pre-wrap; }
    
    .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
    .info-box { background: var(--bg-navbar); padding: 1.25rem; border-radius: 8px; border: 1px solid var(--border-color); }
    .box-label { display: block; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.25rem; }
    .box-value { display: block; font-size: 1.05rem; font-weight: 600; color: var(--text-primary); }
    
    .planner-details-section { margin-top: 2rem; padding-top: 2rem; border-top: 1px solid var(--border-light); }
    .planner-details-section h3 { margin-top: 0; margin-bottom: 1.5rem; font-size: 1.25rem; color: var(--primary-color); }
    .specs-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; }
    .spec-item { display: flex; align-items: center; gap: 0.75rem; padding: 1rem; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-navbar); }
    .spec-item.has-it { border-left: 4px solid #48bb78; }
    .spec-item.lacks-it { border-left: 4px solid #f56565; opacity: 0.7; }
    .spec-item .icon { font-size: 1.2rem; }
    .spec-item .text { font-weight: 500; font-size: 0.95rem; }
    
    .card-footer { padding: 1.5rem 2rem; border-top: 1px solid var(--border-light); background: var(--bg-navbar); display: flex; justify-content: flex-end; }
    .btn { padding: 0.8rem 2rem; border: none; border-radius: 6px; font-weight: 600; font-size: 1rem; cursor: pointer; transition: all 0.2s; }
    .btn-primary { background: var(--primary-color); color: white; }
    .btn-primary:hover { background: var(--primary-hover); transform: translateY(-1px); }
    
    .loading { text-align: center; color: var(--text-secondary); padding: 2rem; }
    .error-msg { background: #fed7d7; color: #9b2c2c; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; }

    @media (max-width: 600px) {
      .card-header, .card-body, .card-footer { padding: 1.5rem; }
      .specs-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class JobDetailComponent implements OnInit {
  job: any = null;
  isLoading = true;
  error = '';
  currentUser: User | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobService: JobService,
    private authService: AuthService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    const jobId = this.route.snapshot.paramMap.get('id');
    if (jobId) {
      this.loadJobDetails(Number(jobId));
    } else {
      this.error = 'Geçersiz İş ID';
      this.isLoading = false;
    }
  }

  loadJobDetails(id: number) {
    this.jobService.getAvailableJobs().subscribe({
      next: (jobs) => {
        // Geçici çözüm: normalde findById endpoint'i olur
        // Burada listelenen işlerden ID eşleşmesini buluyoruz.
        // İdealde API'de GET /api/jobs/:id olmalıdır.
        const found = jobs.find((j: any) => j.id === id);
        if (found) {
          this.job = found;
        } else {
          this.error = 'İş bulunamadı veya erişim yetkiniz yok.';
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'İş detayları yüklenirken hata oluştu.';
        this.isLoading = false;
      }
    });
  }

  goBack() {
    this.location.back();
  }

  isPlannerAndJobOpen() {
    return this.currentUser?.role === 'ROLE_PLANNER' && this.job?.status === 'OPEN';
  }

  goToMakeOffer() {
    // Sadece örnek teklif modalına/sayfasına yönlendirme (İleride geliştirilebilir)
    // Şimdilik listeye geri atalım veya direkt alert verelim
    alert('Bu iş için teklif verme ekranı yakında eklenecektir!');
  }
}
