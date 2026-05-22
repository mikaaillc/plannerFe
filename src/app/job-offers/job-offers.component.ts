import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { OfferService, Offer } from '../services/offer.service';
import { JobService, Job } from '../services/job.service';
import { AuthService, User } from '../services/auth.service';

@Component({
  selector: 'app-job-offers',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="offers-container">
      <div class="header-section">
        <button class="btn btn-outline" routerLink="/entity-jobs">&larr; İşlerime Dön</button>
        <h2>Gelen Teklifler</h2>
      </div>

      <div *ngIf="isLoading" class="loading">Yükleniyor...</div>
      
      <div *ngIf="job" class="job-info-card">
        <h3>İş: {{ job.title }}</h3>
        <p><strong>Min. Karne İsteği:</strong> {{ job.minKarne }}</p>
        <p><strong>Durum:</strong> {{ translateStatus(job.status) }}</p>
      </div>

      <div *ngIf="!isLoading && offers.length === 0" class="no-data">
        Bu iş için henüz teklif gelmemiş.
      </div>

      <div class="offers-list" *ngIf="!isLoading && offers.length > 0">
        <div class="offer-card" *ngFor="let offer of offers">
          <div class="offer-header">
            <div>
              <h4>Teklif Veren: <a (click)="viewProfile(offer.sender.id)" class="profile-link">{{ offer.sender.fullName }}</a></h4>
              <span class="planner-karne">Kendi Karnesi: {{ offer.sender.karne || 'Belirtilmedi' }}</span>
              <span *ngIf="offer.partnerKarnes" class="partner-karne">| Partner Karneleri: {{ offer.partnerKarnes }}</span>
            </div>
            <span class="status-badge" [ngClass]="offer.status.toLowerCase()">{{ translateStatus(offer.status) }}</span>
          </div>
          
          <div class="offer-details">
            <p><strong>Teklif Başlığı:</strong> {{ offer.title }}</p>
            <p><strong>Açıklama:</strong> {{ offer.description }}</p>
            <p class="price"><strong>Miktar (Fiyat):</strong> {{ offer.proposedPrice }}₺</p>
          </div>
          
          <div class="offer-actions" *ngIf="offer.status === 'PENDING' && job?.status === 'OPEN'">
            <button class="btn btn-outline" (click)="viewOfferDetails(offer.id)">Detayları Gör / Mesajlaş</button>
          </div>
          <div class="offer-actions" *ngIf="offer.status !== 'PENDING'">
            <button class="btn btn-outline" (click)="viewOfferDetails(offer.id)">Teklif Detayları</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .offers-container { padding: 2rem; max-width: 900px; margin: 0 auto; color: var(--text-primary); }
    .header-section { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
    .job-info-card { background: var(--card-bg); border: 1px solid var(--border-color); padding: 1rem; border-radius: 8px; margin-bottom: 2rem; }
    .offers-list { display: flex; flex-direction: column; gap: 1.5rem; }
    .offer-card { background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 8px; padding: 1.5rem; }
    .offer-header { display: flex; justify-content: space-between; margin-bottom: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; }
    .profile-link { color: var(--primary-color); cursor: pointer; text-decoration: underline; }
    .planner-karne, .partner-karne { font-size: 0.85rem; color: var(--text-secondary); }
    .status-badge { padding: 0.25rem 0.75rem; border-radius: 999px; font-size: 0.85rem; font-weight: 600; height: fit-content; }
    .status-badge.pending { background: #eebf3d; color: #fff; }
    .status-badge.accepted { background: #48bb78; color: #fff; }
    .offer-details { margin-bottom: 1rem; }
    .price { font-size: 1.1rem; color: #48bb78; font-weight: bold; }
    .offer-actions { display: flex; gap: 1rem; }
    .btn { padding: 0.5rem 1rem; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; }
    .btn-success { background: #48bb78; color: white; }
    .btn-outline { background: transparent; border: 1px solid var(--border-color); color: var(--text-primary); }

    @media (max-width: 768px) {
      .offers-container { padding: 1rem; }
      .offer-header { flex-direction: column; gap: 0.5rem; align-items: flex-start; }
      .offer-actions { flex-direction: column; width: 100%; }
      .offer-actions .btn { width: 100%; }
    }
  `]
})
export class JobOffersComponent implements OnInit {
  jobId!: number;
  job: Job | null = null;
  offers: Offer[] = [];
  isLoading = true;
  currentUser: User | null = null;

  constructor(
    private route: ActivatedRoute,
    private offerService: OfferService,
    private jobService: JobService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser || this.currentUser.role !== 'ROLE_ENTITY') {
      this.router.navigate(['/']);
      return;
    }

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.jobId = +params['id'];
        this.loadJobAndOffers();
      }
    });
  }

  loadJobAndOffers() {
    this.isLoading = true;
    this.jobService.getJob(this.jobId).subscribe(job => {
      this.job = job;
      this.offerService.getJobOffers(this.jobId).subscribe(offers => {
        this.offers = offers;
        this.isLoading = false;
      });
    });
  }

  acceptOffer(offerId: number) {
    if (confirm('Bu teklifi kabul etmek istediğinize emin misiniz? (İş kapatılacak)')) {
      this.offerService.acceptOffer(offerId).subscribe(() => {
        alert('Teklif başarıyla kabul edildi!');
        this.loadJobAndOffers();
      });
    }
  }

  viewProfile(plannerId: number) {
    // Assuming we have a route for viewing planner profiles
    this.router.navigate(['/planners', plannerId]);
  }
  
  viewOfferDetails(offerId: number) {
    this.router.navigate(['/offer-detail', offerId]);
  }

  translateStatus(status: string): string {
    switch (status) {
      case 'OPEN': return 'AÇIK';
      case 'IN_PROGRESS': return 'DEVAM EDİYOR';
      case 'COMPLETED': return 'TAMAMLANDI';
      case 'CANCELLED': return 'İPTAL EDİLDİ';
      case 'PENDING': return 'BEKLİYOR';
      case 'ACCEPTED': return 'KABUL EDİLDİ';
      case 'REJECTED': return 'REDDEDİLDİ';
      case 'NEGOTIATING': return 'GÖRÜŞÜLÜYOR';
      default: return status;
    }
  }
}
