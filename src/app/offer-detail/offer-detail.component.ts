import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, User } from '../services/auth.service';
import { OfferService, Offer, Comment } from '../services/offer.service';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-offer-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dashboard">
      <div class="content" *ngIf="offer">
        <div class="main-card">
          <div class="header-section">
            <div>
              <h2>Teklif: {{offer.title}}</h2>
              <div class="meta">
                <span class="status" [ngClass]="offer.status.toLowerCase()">{{offer.status}}</span>
                <span class="date">{{offer.createdAt | date:'dd.MM.yyyy HH:mm'}}</span>
              </div>
            </div>
            <div class="price-box">
              <div class="label">Teklif Edilen Ücret</div>
              <div class="amount">{{offer.proposedPrice}} ₺</div>
            </div>
          </div>
          
          <div class="participants">
            <div class="participant">
              <strong>İşi Veren (Kurum):</strong>
              <span class="entity-link" (click)="router.navigate(['/entity', offer.job.creator.id])">
                🏢 {{offer.job.creator.fullName}} <small>→ Profili Gör</small>
              </span>
            </div>
            <div class="participant">
              <strong>İşe Talip (Plancı):</strong> 
              <span class="entity-link" (click)="router.navigate(['/planners', offer.sender.id])">
                ✏️ {{offer.sender.fullName}} <small>→ Profili Gör</small>
              </span>
            </div>
          </div>

          <div class="description-box">
            <h3>İş Bilgisi</h3>
            <p><strong>{{offer.job.title}}</strong></p>
            <p>{{offer.job.description}}</p>
          </div>

          <div class="description-box" style="margin-top: 1rem;">
            <h3>Teklif Açıklaması</h3>
            <p>{{offer.description}}</p>
            <p *ngIf="offer.partnerKarnes"><strong>Partner Karneleri:</strong> {{offer.partnerKarnes}}</p>
          </div>

          <div class="actions" *ngIf="offer.status === 'PENDING' && user?.role === 'ROLE_ENTITY' && offer.job.status === 'OPEN'">
              <button class="btn btn-success" (click)="acceptOffer()">Kabul Et</button>
          </div>
        </div>

        <div class="comments-section">
          <h3>Yorumlar ve Mesajlar</h3>
          
          <div class="comments-list">
            <div class="comment" *ngFor="let comment of comments" [ngClass]="{'own-comment': comment.user.id === user?.id}">
              <div class="comment-header">
                <strong>{{comment.user.fullName}}</strong>
                <span class="date">{{comment.createdAt | date:'short'}}</span>
              </div>
              <div class="comment-body">{{comment.text}}</div>
            </div>
            <div *ngIf="comments.length === 0" class="no-comments">
              Henüz mesaj bulunmuyor.
            </div>
          </div>

          <div class="new-comment">
            <textarea [(ngModel)]="newCommentText" class="form-control" rows="3" placeholder="Mesajınızı yazın..."></textarea>
            <button class="btn btn-primary" (click)="addComment()">Gönder</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard { min-height: 100vh; background: var(--bg-primary); color: var(--text-primary); font-family: 'Inter', sans-serif; padding-bottom: 2rem; }
    .content { max-width: 1000px; margin: 2rem auto; padding: 0 2rem; display: flex; flex-direction: column; gap: 2rem; }
    
    .main-card, .comments-section { background: var(--card-bg); padding: 2rem; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid var(--border-color); }
    
    .header-section { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--border-light); }
    .header-section h2 { margin: 0 0 0.5rem 0; color: var(--text-primary); font-size: 1.5rem; }
    .meta { display: flex; align-items: center; gap: 1rem; }
    .date { color: var(--text-muted); font-size: 0.875rem; }
    
    .price-box { background: var(--bg-success-light); padding: 1rem 1.5rem; border-radius: 8px; text-align: center; border: 1px solid var(--border-success); }
    .price-box .label { font-size: 0.875rem; color: var(--text-success); margin-bottom: 0.25rem; }
    .price-box .amount { font-size: 1.5rem; font-weight: 700; color: var(--text-success); }
    
    .participants { display: flex; gap: 2rem; margin-bottom: 1.5rem; background: var(--bg-secondary); padding: 1rem; border-radius: 8px; flex-wrap: wrap; }
    .participant { font-size: 0.95rem; color: var(--text-secondary); display: flex; flex-direction: column; gap: 0.5rem; }
    .entity-link { color: var(--primary-color); cursor: pointer; font-weight: 500; display: inline-flex; align-items: center; gap: 0.25rem; transition: color 0.2s; }
    .entity-link:hover { color: var(--primary-hover); text-decoration: underline; }
    .entity-link small { font-size: 0.78rem; color: var(--text-muted); }
    
    .description-box h3 { margin-top: 0; font-size: 1.125rem; color: var(--text-primary); }
    .description-box p { color: var(--text-secondary); line-height: 1.6; white-space: pre-wrap; }
    
    .actions { display: flex; gap: 1rem; margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--border-light); }
    .btn { padding: 0.5rem 1rem; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; transition: all 0.2s; }
    .btn-primary { background: var(--primary-color); color: white; }
    .btn-primary:hover { background: var(--primary-hover); }
    .btn-success { background: #48bb78; color: white; }
    .btn-success:hover { background: #38a169; }
    
    .form-control { background: var(--input-bg); color: var(--text-primary); padding: 0.75rem; border: 1px solid var(--input-border); border-radius: 6px; font-family: inherit; font-size: 0.95rem; }
    .form-control:focus { outline: none; border-color: var(--primary-color); box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2); }
    
    .status { padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
    .status.pending { background: #fefcbf; color: #b7791f; }
    .status.accepted { background: #c6f6d5; color: #22543d; }
    .status.rejected { background: #fed7d7; color: #822727; }
    
    .comments-section h3 { margin-top: 0; color: var(--text-primary); margin-bottom: 1.5rem; }
    .comments-list { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem; max-height: 400px; overflow-y: auto; padding-right: 0.5rem; }
    .comment { background: var(--bg-secondary); padding: 1rem; border-radius: 8px; border: 1px solid var(--border-color); width: 80%; align-self: flex-start; }
    .comment.own-comment { background: var(--bg-info-light); border-color: var(--border-info); align-self: flex-end; }
    .comment-header { display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.875rem; color: var(--text-secondary); }
    .comment-body { color: var(--text-primary); line-height: 1.5; white-space: pre-wrap; }
    .no-comments { text-align: center; color: var(--text-muted); padding: 2rem 0; }
    
    .new-comment { display: flex; flex-direction: column; gap: 1rem; }
  `]
})
export class OfferDetailComponent implements OnInit {
  user: User | null = null;
  offer: Offer | null = null;
  comments: Comment[] = [];
  
  newCommentText = '';

  constructor(
    private authService: AuthService,
    private offerService: OfferService,
    private route: ActivatedRoute,
    public router: Router,
    public themeService: ThemeService
  ) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    if (!this.user) {
      this.router.navigate(['/login']);
      return;
    }

    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.loadOffer(id);
      }
    });
  }

  loadOffer(id: number) {
    this.offerService.getOffer(id).subscribe(offer => {
      this.offer = offer;
      this.loadComments(offer.id);
    });
  }

  loadComments(offerId: number) {
    this.offerService.getComments(offerId).subscribe(comments => {
      this.comments = comments;
    });
  }

  acceptOffer() {
    if (this.offer) {
      this.offerService.acceptOffer(this.offer.id).subscribe(() => {
        alert('Teklif başarıyla kabul edildi!');
        this.loadOffer(this.offer!.id);
      });
    }
  }

  addComment() {
    if (this.offer && this.user && this.newCommentText.trim()) {
      this.offerService.addComment(this.offer.id, this.user.id, this.newCommentText).subscribe(() => {
        this.newCommentText = '';
        this.loadComments(this.offer!.id);
      });
    }
  }
}
