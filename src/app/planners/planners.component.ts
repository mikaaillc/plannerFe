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
      <nav class="navbar">
        <div class="nav-content">
          <h1 (click)="router.navigate(['/dashboard'])" style="cursor: pointer;">&larr; Şehir Plancıları</h1>
          <div class="user-info" *ngIf="user">
            <span class="user-badge">{{user.fullName}} <small>(Kurum)</small></span>
          </div>
        </div>
      </nav>

      <div class="content">
        <h2>Plancıları Keşfedin</h2>
        <p class="subtitle">Projeleriniz için en uygun şehir plancısını bulun ve hemen teklif gönderin.</p>
        
        <div class="grid">
          <div class="planner-card" *ngFor="let planner of planners">
            <div class="card-header">
              <div class="avatar">{{planner.fullName.charAt(0)}}</div>
              <div>
                <h3>{{planner.fullName}}</h3>
                <span class="role">Şehir Plancısı</span>
              </div>
            </div>
            <div class="card-body">
              <h4>Tamamlanan İşler / Portfolyo</h4>
              <p>{{planner.completedWorks || 'Henüz bir portfolyo bilgisi girilmemiş.'}}</p>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary" (click)="openOfferModal(planner)">Teklif Gönder</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Teklif Gönderme Modalı -->
      <div class="modal" *ngIf="showModal">
        <div class="modal-content">
          <h3>Teklif Gönder: {{selectedPlanner?.fullName}}</h3>
          <div class="form-group">
            <label>Başlık</label>
            <input type="text" [(ngModel)]="newOffer.title" class="form-control" placeholder="Örn: X Bölgesi İmar Planı" />
          </div>
          <div class="form-group">
            <label>İş Detayı / Açıklama</label>
            <textarea [(ngModel)]="newOffer.description" class="form-control" rows="4"></textarea>
          </div>
          <div class="form-group">
            <label>Önerilen Ücret (TL)</label>
            <input type="number" [(ngModel)]="newOffer.proposedPrice" class="form-control" />
          </div>
          <div class="modal-actions">
            <button class="btn btn-secondary" (click)="showModal = false">İptal</button>
            <button class="btn btn-primary" (click)="sendOffer()">Gönder</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .planners-container { min-height: 100vh; background: #f8fafc; font-family: 'Inter', sans-serif; }
    .navbar { background: #1a202c; color: white; padding: 1rem 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .nav-content { max-width: 1200px; margin: 0 auto; padding: 0 2rem; display: flex; justify-content: space-between; align-items: center; }
    .navbar h1 { margin: 0; font-size: 1.25rem; font-weight: 600; display: inline-block; }
    .user-badge { background: #2d3748; padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.875rem; }
    
    .content { padding: 3rem 2rem; max-width: 1200px; margin: 0 auto; }
    .content h2 { margin-top: 0; font-size: 2rem; color: #2d3748; }
    .subtitle { color: #718096; font-size: 1.1rem; margin-bottom: 3rem; }
    
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 2rem; }
    .planner-card { background: white; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px rgba(0,0,0,0.05); display: flex; flex-direction: column; overflow: hidden; transition: transform 0.2s, box-shadow 0.2s; }
    .planner-card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
    
    .card-header { padding: 1.5rem; display: flex; align-items: center; gap: 1rem; border-bottom: 1px solid #edf2f7; background: #f8fafc; }
    .avatar { width: 50px; height: 50px; border-radius: 50%; background: #4299e1; color: white; display: flex; justify-content: center; align-items: center; font-size: 1.5rem; font-weight: bold; }
    .card-header h3 { margin: 0; font-size: 1.25rem; color: #2d3748; }
    .role { font-size: 0.85rem; color: #718096; }
    
    .card-body { padding: 1.5rem; flex: 1; }
    .card-body h4 { margin-top: 0; font-size: 0.95rem; color: #4a5568; margin-bottom: 0.5rem; }
    .card-body p { color: #718096; font-size: 0.9rem; line-height: 1.6; white-space: pre-wrap; }
    
    .card-footer { padding: 1.5rem; border-top: 1px solid #edf2f7; }
    .btn { width: 100%; padding: 0.75rem; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
    .btn-primary { background: #4299e1; color: white; }
    .btn-primary:hover { background: #3182ce; }
    .btn-secondary { background: #e2e8f0; color: #4a5568; }
    .btn-secondary:hover { background: #cbd5e0; }
    
    .modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; backdrop-filter: blur(4px); }
    .modal-content { background: white; padding: 2.5rem; border-radius: 12px; width: 100%; max-width: 500px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); }
    .modal-content h3 { margin-top: 0; margin-bottom: 1.5rem; color: #2d3748; }
    .form-group { margin-bottom: 1.25rem; }
    .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 500; font-size: 0.9rem; color: #4a5568; }
    .form-control { width: 100%; padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 6px; box-sizing: border-box; font-family: inherit; }
    .modal-actions { display: flex; gap: 1rem; margin-top: 2rem; }
    
    @media (max-width: 768px) {
      .nav-content { flex-direction: column; gap: 1rem; text-align: center; }
      .grid { grid-template-columns: 1fr; }
      .modal-content { padding: 1.5rem; margin: 1rem; }
      .modal-actions { flex-direction: column; }
      .modal-actions .btn { width: 100%; }
    }
  `]
})
export class PlannersComponent implements OnInit {
  user: User | null = null;
  planners: any[] = [];
  
  showModal = false;
  selectedPlanner: any = null;
  
  newOffer = {
    title: '',
    description: '',
    proposedPrice: 0,
    receiverId: null
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
      this.planners = users.filter((u: any) => u.role === 'ROLE_PLANNER');
    });
  }

  openOfferModal(planner: any) {
    this.selectedPlanner = planner;
    this.newOffer.receiverId = planner.id;
    this.showModal = true;
  }

  sendOffer() {
    if (this.user && this.selectedPlanner) {
      const data = {
        ...this.newOffer,
        senderId: this.user.id
      };
      this.offerService.createOffer(data).subscribe(() => {
        this.showModal = false;
        this.newOffer = { title: '', description: '', proposedPrice: 0, receiverId: null };
        alert('Teklif başarıyla gönderildi!');
      });
    }
  }
}
