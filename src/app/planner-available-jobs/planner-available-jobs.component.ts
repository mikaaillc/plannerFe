import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { JobService, Job } from '../services/job.service';
import { OfferService } from '../services/offer.service';
import { AuthService, User } from '../services/auth.service';

@Component({
  selector: 'app-planner-available-jobs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="jobs-container">
      <h2>Teklif Verebileceğim İşler</h2>

      <div *ngIf="isLoading" class="loading">Yükleniyor...</div>
      
      <div *ngIf="!currentUser?.isPaid" class="alert-box error">
        İşleri görmek ve teklif vermek için aktif bir aboneliğiniz (üyeliğiniz) olmalıdır. 
        <button class="btn btn-primary" (click)="router.navigate(['/subscription'])">Abonelik Al</button>
      </div>

      <div *ngIf="currentUser?.isPaid && !isLoading && jobs.length === 0" class="no-data">
        Şu an açık bir planlama işi bulunmuyor.
      </div>

      <div class="jobs-list" *ngIf="currentUser?.isPaid && !isLoading && jobs.length > 0">
        <div class="job-card" *ngFor="let job of jobs">
          <div class="job-header">
            <h3>{{ job.title }}</h3>
            <span class="entity-name">{{ job.creator.fullName }} ({{ job.creator.entityType }})</span>
          </div>
          
          <p class="job-desc">{{ job.description }}</p>
          
          <div class="job-meta">
            <span><strong>Tip:</strong> {{ job.jobType }}</span>
            <span><strong>İstenen Karne:</strong> {{ job.minKarne }}</span>
            <span *ngIf="job.priceRangeMin"><strong>Kurum Bütçesi:</strong> {{ job.priceRangeMin }}₺ - {{ job.priceRangeMax }}₺</span>
          </div>
          
          <div *ngIf="job.detailedInfo" class="job-detailed-info">
            <strong>Detaylı Bilgi:</strong> {{ job.detailedInfo }}
          </div>
          
          <button class="btn btn-primary" (click)="openOfferModal(job)">Teklif Ver</button>
        </div>
      </div>

      <!-- Teklif Verme Modalı -->
      <div class="modal-overlay" *ngIf="showModal">
        <div class="modal-content">
          <h3>Teklif Ver: {{ selectedJob?.title }}</h3>
          
          <div class="form-group">
            <label>Teklif Başlığı / Ön Yazı</label>
            <input type="text" [(ngModel)]="offerData.title" class="form-control" />
          </div>
          
          <div class="form-group">
            <label>Açıklama (Nasıl yapacaksınız?)</label>
            <textarea [(ngModel)]="offerData.description" class="form-control" rows="3"></textarea>
          </div>
          
          <div class="form-group">
            <label>Miktar / Plan (Fiyat ₺)</label>
            <input type="number" [(ngModel)]="offerData.proposedPrice" class="form-control" />
          </div>
          
          <div class="form-group">
            <label>Kendi karneniz yetersizse, beraber çalışacağınız plancıların karnelerini seçin:</label>
            <div class="checkbox-group">
              <label><input type="checkbox" (change)="toggleKarne('A')"> A Grubu</label>
              <label><input type="checkbox" (change)="toggleKarne('B')"> B Grubu</label>
              <label><input type="checkbox" (change)="toggleKarne('C')"> C Grubu</label>
              <label><input type="checkbox" (change)="toggleKarne('D')"> D Grubu</label>
              <label><input type="checkbox" (change)="toggleKarne('E')"> E Grubu</label>
              <label><input type="checkbox" (change)="toggleKarne('F')"> F Grubu</label>
            </div>
          </div>
          
          <div class="modal-actions">
            <button class="btn btn-outline" (click)="closeOfferModal()">İptal</button>
            <button class="btn btn-success" (click)="submitOffer()" [disabled]="isSubmitting">
              {{ isSubmitting ? 'Gönderiliyor...' : 'Teklifi Gönder' }}
            </button>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .jobs-container { padding: 2rem; max-width: 900px; margin: 0 auto; color: var(--text-primary); }
    h2 { margin-bottom: 2rem; }
    .alert-box { padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center; }
    .alert-box.error { background: #fed7d7; color: #c53030; border: 1px solid #f5c6c6; }
    .jobs-list { display: flex; flex-direction: column; gap: 1.5rem; }
    .job-card { background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 8px; padding: 1.5rem; }
    .job-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; }
    .job-header h3 { margin: 0; font-size: 1.25rem; }
    .entity-name { color: var(--primary-color); font-weight: 600; }
    .job-desc { color: var(--text-secondary); margin-bottom: 1.5rem; }
    .job-meta { display: flex; flex-wrap: wrap; gap: 1.5rem; font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 1rem; }
    .job-detailed-info { background: var(--input-bg); padding: 1rem; border-radius: 4px; margin-bottom: 1.5rem; font-size: 0.9rem; }
    
    .btn { padding: 0.5rem 1.25rem; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; }
    .btn-primary { background: var(--primary-color); color: white; }
    .btn-success { background: #48bb78; color: white; }
    .btn-outline { background: transparent; border: 1px solid var(--border-color); color: var(--text-primary); }
    .btn:disabled { opacity: 0.7; cursor: not-allowed; }

    /* Modal Styles */
    .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; }
    .modal-content { background: var(--card-bg); padding: 2rem; border-radius: 8px; width: 100%; max-width: 500px; max-height: 90vh; overflow-y: auto; }
    .form-group { margin-bottom: 1.25rem; }
    .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
    .form-control { width: 100%; padding: 0.75rem; border: 1px solid var(--input-border); border-radius: 4px; box-sizing: border-box; background: var(--input-bg); color: var(--text-primary); }
    .checkbox-group { display: flex; flex-wrap: wrap; gap: 1rem; }
    .modal-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem; }
  `]
})
export class PlannerAvailableJobsComponent implements OnInit {
  jobs: Job[] = [];
  currentUser: User | null = null;
  isLoading = true;
  
  showModal = false;
  selectedJob: Job | null = null;
  isSubmitting = false;
  
  offerData = {
    title: '',
    description: '',
    proposedPrice: null as number | null,
    partnerKarnes: [] as string[]
  };

  constructor(
    private jobService: JobService,
    private offerService: OfferService,
    public authService: AuthService,
    public router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser || this.currentUser.role !== 'ROLE_PLANNER') {
      this.router.navigate(['/']);
      return;
    }
    
    if (this.currentUser.isPaid) {
      this.loadJobs();
    } else {
      this.isLoading = false;
    }
  }

  loadJobs() {
    this.isLoading = true;
    this.jobService.getAvailableJobs().subscribe({
      next: (data) => {
        this.jobs = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  openOfferModal(job: Job) {
    this.selectedJob = job;
    this.showModal = true;
    this.offerData = {
      title: 'Teklifim',
      description: '',
      proposedPrice: null,
      partnerKarnes: []
    };
  }

  closeOfferModal() {
    this.showModal = false;
    this.selectedJob = null;
  }

  toggleKarne(karne: string) {
    const idx = this.offerData.partnerKarnes.indexOf(karne);
    if (idx > -1) {
      this.offerData.partnerKarnes.splice(idx, 1);
    } else {
      this.offerData.partnerKarnes.push(karne);
    }
  }

  submitOffer() {
    if (!this.offerData.proposedPrice || !this.offerData.description) {
      alert('Lütfen Miktar/Plan ve açıklama alanlarını doldurun.');
      return;
    }
    
    this.isSubmitting = true;
    
    const payload = {
      title: this.offerData.title,
      description: this.offerData.description,
      proposedPrice: this.offerData.proposedPrice,
      senderId: this.currentUser?.id,
      partnerKarnes: this.offerData.partnerKarnes.join(',')
    };

    this.offerService.createOffer(this.selectedJob!.id, payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        alert('Teklifiniz başarıyla gönderildi.');
        this.closeOfferModal();
      },
      error: (err) => {
        this.isSubmitting = false;
        alert('Teklif gönderilirken hata oluştu.');
        console.error(err);
      }
    });
  }
}
