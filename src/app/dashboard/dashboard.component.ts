import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, User } from '../services/auth.service';
import { OfferService, Offer } from '../services/offer.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dashboard">
      <nav class="navbar">
        <div class="nav-content">
          <h1>Şehir Plancıları Platformu</h1>
          <div class="user-info" *ngIf="user">
            <span class="user-badge">{{user.fullName}} <small>({{user.role === 'ROLE_PLANNER' ? 'Şehir Plancısı' : 'Kurum'}})</small></span>
            <button class="btn btn-logout" (click)="logout()">Çıkış</button>
          </div>
        </div>
      </nav>

      <div class="content" *ngIf="user">
        <div class="actions" *ngIf="user.role === 'ROLE_ENTITY'">
          <button class="btn btn-secondary" style="margin-right: 1rem;" (click)="router.navigate(['/planners'])">Şehir Plancılarını Keşfet</button>
          <button class="btn btn-primary" (click)="showCreateOffer = true">+ Yeni Teklif Oluştur</button>
        </div>

        <div class="modal" *ngIf="showCreateOffer">
          <div class="modal-content">
            <h3>Yeni Teklif Gönder</h3>
            <div class="form-group">
              <label>Kime (Şehir Plancısı)</label>
              <select [(ngModel)]="newOffer.receiverId" class="form-control">
                <option [ngValue]="null">Seçiniz...</option>
                <option *ngFor="let planner of planners" [value]="planner.id">{{planner.fullName}}</option>
              </select>
            </div>
            <div class="form-group">
              <label>Başlık</label>
              <input type="text" [(ngModel)]="newOffer.title" class="form-control" placeholder="Örn: X Bölgesi İmar Planı Çalışması" />
            </div>
            <div class="form-group">
              <label>İş Detayı / Açıklama</label>
              <textarea [(ngModel)]="newOffer.description" class="form-control" rows="4" placeholder="İşin detaylarını buraya giriniz..."></textarea>
            </div>
            <div class="form-group">
              <label>Önerilen Ücret (TL)</label>
              <input type="number" [(ngModel)]="newOffer.proposedPrice" class="form-control" />
            </div>
            <div class="modal-actions">
              <button class="btn btn-secondary" (click)="showCreateOffer = false">İptal</button>
              <button class="btn btn-primary" (click)="createOffer()">Teklifi Gönder</button>
            </div>
          </div>
        </div>

        <div class="offers-list">
          <h2>{{user.role === 'ROLE_PLANNER' ? 'Size Gelen Teklifler' : 'Gönderdiğiniz Teklifler'}}</h2>
          <div *ngIf="offers.length === 0" class="no-data">
            <p>Henüz teklif bulunmamaktadır.</p>
          </div>
          <div class="grid">
            <div class="offer-card" *ngFor="let offer of offers" (click)="viewOffer(offer.id)">
              <div class="offer-header">
                <h3>{{offer.title}}</h3>
                <span class="status" [ngClass]="offer.status.toLowerCase()">{{offer.status}}</span>
              </div>
              <div class="offer-body">
                <p><strong>{{user.role === 'ROLE_PLANNER' ? 'Gönderen:' : 'Alıcı:'}}</strong> {{user.role === 'ROLE_PLANNER' ? offer.sender.fullName : offer.receiver.fullName}}</p>
                <p><strong>Önerilen Ücret:</strong> <span class="price">{{offer.proposedPrice}} ₺</span></p>
              </div>
              <div class="offer-footer">
                <span class="date">{{offer.createdAt | date:'dd.MM.yyyy HH:mm'}}</span>
                <span class="view-details">Detayları Gör &rarr;</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard { min-height: 100vh; background: #f8fafc; font-family: 'Inter', sans-serif; }
    .navbar { background: #1a202c; color: white; padding: 1rem 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .nav-content { max-width: 1200px; margin: 0 auto; padding: 0 2rem; display: flex; justify-content: space-between; align-items: center; }
    .navbar h1 { margin: 0; font-size: 1.5rem; font-weight: 600; letter-spacing: -0.5px; }
    .user-info { display: flex; align-items: center; gap: 1rem; }
    .user-badge { background: #2d3748; padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.875rem; }
    .user-badge small { color: #a0aec0; }
    .btn { padding: 0.5rem 1rem; border: none; border-radius: 6px; cursor: pointer; color: white; font-weight: 500; transition: all 0.2s; }
    .btn-logout { background: transparent; border: 1px solid #4a5568; color: #e2e8f0; }
    .btn-logout:hover { background: #e53e3e; border-color: #e53e3e; }
    .btn-primary { background: #4299e1; }
    .btn-primary:hover { background: #3182ce; }
    .btn-secondary { background: #cbd5e0; color: #4a5568; }
    .btn-secondary:hover { background: #a0aec0; }
    .content { padding: 2rem; max-width: 1200px; margin: 0 auto; }
    .actions { margin-bottom: 2rem; display: flex; justify-content: flex-end; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 1.5rem; }
    .offer-card { background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; display: flex; flex-direction: column; gap: 1rem; border: 1px solid #e2e8f0; }
    .offer-card:hover { transform: translateY(-4px); box-shadow: 0 10px 15px rgba(0,0,0,0.1); border-color: #cbd5e0; }
    .offer-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; }
    .offer-header h3 { margin: 0; font-size: 1.125rem; color: #2d3748; line-height: 1.4; }
    .offer-body p { margin: 0.25rem 0; color: #4a5568; font-size: 0.95rem; }
    .price { font-weight: 600; color: #38a169; }
    .offer-footer { display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: 1rem; border-top: 1px solid #edf2f7; }
    .date { color: #a0aec0; font-size: 0.85rem; }
    .view-details { color: #4299e1; font-size: 0.875rem; font-weight: 500; }
    .status { padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
    .status.pending { background: #fefcbf; color: #b7791f; }
    .status.accepted { background: #c6f6d5; color: #22543d; }
    .status.rejected { background: #fed7d7; color: #822727; }
    .status.negotiating { background: #bee3f8; color: #2a4365; }
    .modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); display: flex; justify-content: center; align-items: center; z-index: 1000; backdrop-filter: blur(4px); }
    .modal-content { background: white; padding: 2.5rem; border-radius: 12px; width: 100%; max-width: 500px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); }
    .modal-content h3 { margin-top: 0; margin-bottom: 1.5rem; color: #2d3748; }
    .form-group { margin-bottom: 1.25rem; }
    .form-group label { display: block; margin-bottom: 0.5rem; color: #4a5568; font-weight: 500; font-size: 0.9rem; }
    .form-control { width: 100%; padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 6px; box-sizing: border-box; font-family: inherit; font-size: 0.95rem; }
    .form-control:focus { outline: none; border-color: #4299e1; box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2); }
    .modal-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem; }
    .no-data { text-align: center; padding: 4rem 2rem; background: white; border-radius: 12px; border: 1px dashed #cbd5e0; color: #718096; }
  `]
})
export class DashboardComponent implements OnInit {
  user: User | null = null;
  offers: Offer[] = [];
  planners: User[] = [];
  showCreateOffer = false;
  
  newOffer = {
    title: '',
    description: '',
    proposedPrice: 0,
    receiverId: null
  };

  constructor(
    private authService: AuthService,
    private offerService: OfferService,
    private router: Router
  ) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    if (!this.user) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadOffers();
    
    if (this.user.role === 'ROLE_ENTITY') {
      this.authService.getAllUsers().subscribe(users => {
        this.planners = users.filter(u => u.role === 'ROLE_PLANNER');
      });
    }
  }

  loadOffers() {
    if (this.user) {
      this.offerService.getUserOffers(this.user.id).subscribe(offers => {
        this.offers = offers;
      });
    }
  }

  createOffer() {
    if (this.user && this.newOffer.receiverId) {
      const data = {
        ...this.newOffer,
        senderId: this.user.id
      };
      this.offerService.createOffer(data).subscribe(() => {
        this.showCreateOffer = false;
        this.loadOffers();
        this.newOffer = { title: '', description: '', proposedPrice: 0, receiverId: null };
      });
    }
  }

  viewOffer(id: number) {
    this.router.navigate(['/offer', id]);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
