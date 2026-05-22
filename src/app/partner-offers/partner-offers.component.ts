import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../services/auth.service';
import { PartnerOfferService, PartnerOffer } from '../services/partner-offer.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-partner-offers',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="offers-container">
      <div class="header">
        <h2>Partner Teklifleri</h2>
        <p>Gelen ve giden ortaklık tekliflerinizi buradan yönetebilirsiniz.</p>
      </div>

      <div class="tabs">
        <button class="tab-btn" [class.active]="activeTab === 'received'" (click)="activeTab = 'received'">Gelen Teklifler</button>
        <button class="tab-btn" [class.active]="activeTab === 'sent'" (click)="activeTab = 'sent'">Gönderdiğim Teklifler</button>
      </div>

      <div *ngIf="isLoading" class="loading">Yükleniyor...</div>
      
      <div *ngIf="!isLoading && error" class="error-msg">{{error}}</div>

      <!-- Received Offers -->
      <div class="offers-list" *ngIf="!isLoading && !error && activeTab === 'received'">
        <div class="offer-card" *ngFor="let offer of receivedOffers">
          <div class="offer-header">
            <h3>{{ offer.sender.fullName }} ({{ offer.sender.karne }} Grubu)</h3>
            <span class="status-badge" [ngClass]="offer.status">{{ getStatusText(offer.status) }}</span>
          </div>
          <div class="offer-body">
            <p><strong>İlgili İş:</strong> {{ offer.job.title }}</p>
            <p><strong>Teklif Edilen Ücret:</strong> {{ offer.proposedFee | currency:'TRY':'symbol':'1.0-0' }}</p>
            <p><strong>Mesaj:</strong> {{ offer.message }}</p>
            <p class="date">{{ offer.createdAt | date:'short' }}</p>
          </div>
          <div class="offer-footer" *ngIf="offer.status === 'PENDING'">
            <button class="btn btn-success" (click)="updateStatus(offer, 'ACCEPTED')">Kabul Et</button>
            <button class="btn btn-danger" (click)="updateStatus(offer, 'REJECTED')">Reddet</button>
          </div>
        </div>
        <div *ngIf="receivedOffers.length === 0" class="no-data">Bekleyen gelen teklifiniz bulunmuyor.</div>
      </div>

      <!-- Sent Offers -->
      <div class="offers-list" *ngIf="!isLoading && !error && activeTab === 'sent'">
        <div class="offer-card" *ngFor="let offer of sentOffers">
          <div class="offer-header">
            <h3>Alıcı: {{ offer.receiver.fullName }}</h3>
            <span class="status-badge" [ngClass]="offer.status">{{ getStatusText(offer.status) }}</span>
          </div>
          <div class="offer-body">
            <p><strong>İlgili İş:</strong> {{ offer.job.title }}</p>
            <p><strong>Teklif Edilen Ücret:</strong> {{ offer.proposedFee | currency:'TRY':'symbol':'1.0-0' }}</p>
            <p><strong>Mesaj:</strong> {{ offer.message }}</p>
            <p class="date">{{ offer.createdAt | date:'short' }}</p>
          </div>
        </div>
        <div *ngIf="sentOffers.length === 0" class="no-data">Henüz kimseye partnerlik teklifi göndermediniz.</div>
      </div>
    </div>
  `,
  styles: [`
    .offers-container { padding: 2rem; max-width: 1000px; margin: 0 auto; color: var(--text-primary); }
    .header { margin-bottom: 2rem; text-align: center; }
    .header h2 { font-size: 2rem; margin-bottom: 0.5rem; color: var(--primary-color); }
    .header p { color: var(--text-secondary); }
    
    .tabs { display: flex; gap: 1rem; margin-bottom: 2rem; border-bottom: 1px solid var(--border-color); }
    .tab-btn { padding: 1rem 2rem; border: none; background: none; font-weight: 600; color: var(--text-muted); cursor: pointer; border-bottom: 3px solid transparent; }
    .tab-btn.active { color: var(--primary-color); border-bottom-color: var(--primary-color); }
    .tab-btn:hover:not(.active) { color: var(--text-primary); }

    .offers-list { display: flex; flex-direction: column; gap: 1rem; }
    .offer-card { background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 8px; padding: 1.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
    
    .offer-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-light); padding-bottom: 1rem; margin-bottom: 1rem; }
    .offer-header h3 { margin: 0; font-size: 1.2rem; }
    
    .status-badge { padding: 0.3rem 0.6rem; border-radius: 4px; font-size: 0.8rem; font-weight: bold; }
    .status-badge.PENDING { background: #f6e05e; color: #744210; }
    .status-badge.ACCEPTED { background: #48bb78; color: white; }
    .status-badge.REJECTED { background: #f56565; color: white; }
    
    .offer-body p { margin-bottom: 0.5rem; color: var(--text-secondary); line-height: 1.5; }
    .date { font-size: 0.8rem; color: var(--text-muted) !important; margin-top: 1rem; }
    
    .offer-footer { display: flex; gap: 1rem; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--border-light); }
    .btn { padding: 0.5rem 1rem; border: none; border-radius: 4px; font-weight: 600; cursor: pointer; color: white; }
    .btn-success { background: #48bb78; }
    .btn-success:hover { background: #38a169; }
    .btn-danger { background: #f56565; }
    .btn-danger:hover { background: #e53e3e; }
    
    .no-data { text-align: center; padding: 3rem; color: var(--text-muted); font-size: 1.1rem; }
    .error-msg { color: #e53e3e; text-align: center; padding: 1rem; }

    @media (max-width: 768px) {
      .offers-container { padding: 1rem; }
      .tabs { flex-wrap: wrap; }
      .tab-btn { width: 100%; padding: 0.75rem 1rem; text-align: center; }
      .offer-header { flex-direction: column; align-items: flex-start; gap: 0.5rem; }
      .offer-footer { flex-direction: column; }
      .offer-footer .btn { width: 100%; }
    }
  `]
})
export class PartnerOffersComponent implements OnInit {
  currentUser: User | null = null;
  receivedOffers: PartnerOffer[] = [];
  sentOffers: PartnerOffer[] = [];
  isLoading = true;
  error = '';
  activeTab: 'received' | 'sent' = 'received';

  constructor(
    private authService: AuthService,
    private partnerOfferService: PartnerOfferService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser || this.currentUser.role !== 'ROLE_PLANNER' || this.currentUser.subscriptionType !== 'PREMIUM_PLANNER') {
      this.router.navigate(['/']);
      return;
    }
    this.fetchData();
  }

  fetchData() {
    this.isLoading = true;
    if (!this.currentUser) return;
    
    this.partnerOfferService.getReceivedOffers(this.currentUser.id).subscribe({
      next: (data) => {
        this.receivedOffers = data;
        this.partnerOfferService.getSentOffers(this.currentUser!.id).subscribe({
          next: (sentData) => {
            this.sentOffers = sentData;
            this.isLoading = false;
          },
          error: () => this.handleError()
        });
      },
      error: () => this.handleError()
    });
  }

  handleError() {
    this.error = 'Teklifler yüklenirken bir hata oluştu.';
    this.isLoading = false;
  }

  updateStatus(offer: PartnerOffer, status: string) {
    if (!offer.id) return;
    this.partnerOfferService.updateStatus(offer.id, status).subscribe({
      next: () => {
        offer.status = status;
        alert('Teklif durumu güncellendi.');
      },
      error: (err) => {
        alert('Durum güncellenirken bir hata oluştu.');
      }
    });
  }

  getStatusText(status: string): string {
    switch(status) {
      case 'PENDING': return 'Bekliyor';
      case 'ACCEPTED': return 'Kabul Edildi';
      case 'REJECTED': return 'Reddedildi';
      default: return status;
    }
  }
}
