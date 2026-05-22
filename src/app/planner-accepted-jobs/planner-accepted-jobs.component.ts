import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { OfferService, Offer } from '../services/offer.service';
import { AuthService, User } from '../services/auth.service';

@Component({
  selector: 'app-planner-accepted-jobs',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="accepted-container">
      <h2>Kabul Edilen Planlarım</h2>

      <div *ngIf="isLoading" class="loading">Yükleniyor...</div>
      
      <div *ngIf="!isLoading && acceptedOffers.length === 0" class="no-data">
        Henüz kabul edilmiş bir işiniz bulunmuyor.
      </div>

      <div class="offers-list" *ngIf="!isLoading && acceptedOffers.length > 0">
        <div class="offer-card" *ngFor="let offer of acceptedOffers">
          <div class="offer-header">
            <div>
              <h3>{{ offer.job.title }}</h3>
              <span class="entity-name">{{ offer.job.creator.fullName }} ({{ offer.job.creator.entityType }})</span>
            </div>
            <span class="status-badge accepted">KABUL EDİLDİ</span>
          </div>
          
          <div class="offer-details">
            <p><strong>Kurumun İşi:</strong> {{ offer.job.description }}</p>
            <p><strong>Sizin Teklifiniz:</strong> {{ offer.description }}</p>
            <p class="price"><strong>Anlaşılan Fiyat:</strong> {{ offer.proposedPrice }}₺</p>
          </div>
          
          <div class="offer-actions">
            <button class="btn btn-outline" (click)="viewComments(offer.id)">Yorumlar / Mesajlaşma</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .accepted-container { padding: 2rem; max-width: 900px; margin: 0 auto; color: var(--text-primary); }
    h2 { margin-bottom: 2rem; }
    .offers-list { display: flex; flex-direction: column; gap: 1.5rem; }
    .offer-card { background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 8px; padding: 1.5rem; border-left: 4px solid #48bb78; }
    .offer-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; }
    .offer-header h3 { margin: 0; font-size: 1.25rem; color: var(--text-primary); }
    .entity-name { color: var(--primary-color); font-size: 0.9rem; font-weight: 500; }
    .status-badge { padding: 0.25rem 0.75rem; border-radius: 999px; font-size: 0.85rem; font-weight: 600; height: fit-content; }
    .status-badge.accepted { background: #48bb78; color: #fff; }
    .offer-details { margin-bottom: 1.5rem; color: var(--text-secondary); }
    .price { font-size: 1.1rem; color: #48bb78; font-weight: bold; margin-top: 0.5rem; }
    .offer-actions { display: flex; gap: 1rem; }
    .btn { padding: 0.5rem 1rem; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; }
    .btn-outline { background: transparent; border: 1px solid var(--border-color); color: var(--text-primary); }
  `]
})
export class PlannerAcceptedJobsComponent implements OnInit {
  acceptedOffers: Offer[] = [];
  currentUser: User | null = null;
  isLoading = true;

  constructor(
    private offerService: OfferService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser || this.currentUser.role !== 'ROLE_PLANNER') {
      this.router.navigate(['/']);
      return;
    }
    
    this.loadAcceptedOffers();
  }

  loadAcceptedOffers() {
    this.isLoading = true;
    this.offerService.getAcceptedOffers(this.currentUser!.id).subscribe({
      next: (data) => {
        this.acceptedOffers = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  viewComments(offerId: number) {
    this.router.navigate(['/offer-detail', offerId]);
  }
}
