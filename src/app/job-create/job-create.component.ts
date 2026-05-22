import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { JobService } from '../services/job.service';
import { AuthService, User } from '../services/auth.service';

@Component({
  selector: 'app-job-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="job-create-container">
      <div class="card">
        <h2>Yeni İş Oluştur</h2>
        
        <div class="form-group">
          <label>İş Tipi</label>
          <select [(ngModel)]="jobData.jobType" class="form-control">
            <option value="PLANLAMA">Planlama İşi</option>
            <option value="DANISMANLIK">Danışmanlık İşi</option>
          </select>
        </div>

        <div class="form-group">
          <label>İş Başlığı</label>
          <input type="text" [(ngModel)]="jobData.title" class="form-control" placeholder="Örn: Kartal Kuzey Bölgesi İmar Planı" />
        </div>

        <div class="form-group">
          <label>İş Açıklaması</label>
          <textarea [(ngModel)]="jobData.description" class="form-control" rows="4" placeholder="İşin genel detayları, kapsamı, beklentiler..."></textarea>
        </div>

        <div class="form-group">
          <label>Minimum İstek (Plancı Karne Grubu)</label>
          <select [(ngModel)]="jobData.minKarne" class="form-control">
            <option value="A">A Grubu</option>
            <option value="B">B Grubu</option>
            <option value="C">C Grubu</option>
            <option value="D">D Grubu</option>
            <option value="E">E Grubu</option>
            <option value="F">F Grubu</option>
          </select>
        </div>

        <ng-container *ngIf="isKamu()">
          <div class="form-group">
            <label>Fiyat Aralığı (Min - Max) ₺</label>
            <div style="display: flex; gap: 1rem;">
              <input type="number" [(ngModel)]="jobData.priceRangeMin" class="form-control" placeholder="Min Bütçe" />
              <input type="number" [(ngModel)]="jobData.priceRangeMax" class="form-control" placeholder="Max Bütçe" />
            </div>
          </div>
        </ng-container>

        <div class="form-group">
          <label>Konum (İl / İlçe / Mahalle)</label>
          <input type="text" [(ngModel)]="jobData.locationDetails" class="form-control" placeholder="Örn: İstanbul / Kartal / Uğur Mumcu" />
        </div>

        <div class="form-group" *ngIf="isKamu()">
          <label>Ada / Parsel ve Ek Bilgiler</label>
          <textarea [(ngModel)]="jobData.detailedInfo" class="form-control" rows="2" placeholder="Ada/Parsel veya diğer mülkiyet bilgileri"></textarea>
        </div>

        <!-- PLANLAMA İŞİ İÇİN ÖZEL DETAYLAR -->
        <ng-container *ngIf="jobData.jobType === 'PLANLAMA'">
          <div class="planner-details-box">
            <h4 style="margin-top:0; color:var(--primary-color);">Planlama Teknik Detayları</h4>
            
            <div class="form-group">
              <label>Planlama Alanı Büyüklüğü (Hektar)</label>
              <input type="number" [(ngModel)]="jobData.areaSize" class="form-control" placeholder="Örn: 50.5" />
            </div>

            <div class="checkbox-grid">
              <label class="checkbox-label">
                <input type="checkbox" [(ngModel)]="jobData.isNazimImarPlani"> 
                1/5000 Nazım İmar Planı
              </label>

              <label class="checkbox-label">
                <input type="checkbox" [(ngModel)]="jobData.isUygulamaImarPlani"> 
                1/1000 Uygulama İmar Planı
              </label>

              <label class="checkbox-label">
                <input type="checkbox" [(ngModel)]="jobData.hasHalihazirHarita"> 
                Onaylı Hâlihazır Harita Var
              </label>

              <label class="checkbox-label">
                <input type="checkbox" [(ngModel)]="jobData.hasZeminEtudu"> 
                Onaylı Jeolojik/Jeoteknik Etüt (Zemin Etüdü) Var
              </label>

              <label class="checkbox-label">
                <input type="checkbox" [(ngModel)]="jobData.hasKurumGorusleri"> 
                Kurum Görüşleri Tamamlandı
              </label>

              <label class="checkbox-label">
                <input type="checkbox" [(ngModel)]="jobData.isParselasyon"> 
                İmar Uygulaması (18. Madde / Parselasyon) Dahil
              </label>
            </div>
          </div>
        </ng-container>

        <button class="btn btn-primary" (click)="createJob()" [disabled]="isLoading">
          {{isLoading ? 'Oluşturuluyor...' : 'İşi Oluştur ve Yayınla'}}
        </button>
        <div *ngIf="error" class="error-msg">{{error}}</div>
      </div>
    </div>
  `,
  styles: [`
    .job-create-container { padding: 2rem; display: flex; justify-content: center; background: var(--bg-primary); min-height:100vh;}
    .card { background: var(--card-bg); padding: 2.5rem; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); width: 100%; max-width: 650px; border: 1px solid var(--border-color); color: var(--text-primary); }
    h2 { margin-top: 0; margin-bottom: 1.5rem; color: var(--text-primary); font-size:1.5rem; font-weight:700;}
    .form-group { margin-bottom: 1.25rem; }
    .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 500; font-size: 0.95rem; color: var(--text-secondary); }
    .form-control { width: 100%; padding: 0.75rem; border: 1px solid var(--input-border); border-radius: 6px; box-sizing: border-box; background: var(--input-bg); color: var(--text-primary); font-family: inherit; font-size:1rem; transition: border-color 0.2s; }
    .form-control:focus { outline:none; border-color: var(--primary-color); }
    
    .planner-details-box { background: var(--bg-navbar); padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem; border: 1px solid var(--border-color); }
    .checkbox-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem; }
    .checkbox-label { display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; cursor: pointer; color: var(--text-primary); }
    .checkbox-label input { width: 18px; height: 18px; cursor: pointer; }

    .btn { padding: 0.9rem 1.5rem; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; width: 100%; font-size: 1rem; transition: all 0.2s;}
    .btn-primary { background: var(--primary-color); color: white; margin-top: 1rem; }
    .btn-primary:hover:not(:disabled) { background: var(--primary-hover); transform: translateY(-1px); }
    .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
    .error-msg { color: #e53e3e; margin-top: 1rem; text-align: center; font-weight: 500;}

    @media (max-width: 600px) {
      .checkbox-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class JobCreateComponent implements OnInit {
  currentUser: User | null = null;
  isLoading = false;
  error = '';
  
  jobData = {
    title: '',
    description: '',
    jobType: 'PLANLAMA',
    minKarne: 'F',
    priceRangeMin: null,
    priceRangeMax: null,
    detailedInfo: '',
    locationDetails: '',
    areaSize: null,
    isNazimImarPlani: false,
    isUygulamaImarPlani: false,
    hasZeminEtudu: false,
    hasHalihazirHarita: false,
    hasKurumGorusleri: false,
    isParselasyon: false
  };

  constructor(
    private authService: AuthService,
    private jobService: JobService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser || this.currentUser.role !== 'ROLE_ENTITY') {
      this.router.navigate(['/']);
    }
  }

  isKamu(): boolean {
    return this.currentUser?.entityType === 'KAMU';
  }

  createJob() {
    if (!this.jobData.title || !this.jobData.description || !this.jobData.locationDetails) {
      this.error = 'Lütfen başlık, açıklama ve konum alanlarını doldurunuz.';
      return;
    }

    if (this.isKamu()) {
      if (!this.jobData.priceRangeMin || !this.jobData.priceRangeMax) {
        this.error = 'Kamu kurumları için fiyat aralığı girmek zorunludur.';
        return;
      }
    }

    this.isLoading = true;
    this.error = '';

    const payload = {
      ...this.jobData,
      creatorId: this.currentUser?.id
    };

    this.jobService.createJob(payload).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/entity-jobs']);
      },
      error: (err) => {
        this.isLoading = false;
        this.error = 'İş oluşturulurken bir hata oluştu.';
        console.error(err);
      }
    });
  }
}
