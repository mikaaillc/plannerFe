import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, User } from '../services/auth.service';
import { SubscriptionService } from '../services/subscription.service';
import { AiTooltipComponent } from '../components/ai-tooltip/ai-tooltip.component';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule, AiTooltipComponent],
  template: `
    <div class="pricing-container">
      <div class="header">
        <h2>Üyelik Paketleri</h2>
        <p>İhtiyacınıza en uygun planı seçin ve hemen kullanmaya başlayın.</p>
      </div>

      <div class="plans-grid" *ngIf="isEntity()">
        <!-- Entity Plans -->
        <div class="plan-card" [class.active]="currentUser?.subscriptionType === 'FREE_ENTITY'">
          <h3>Temel Kurum / Tüzel</h3>
          <div class="price">Ücretsiz</div>
          <ul class="features">
            <li>Yılda 2 iş oluşturma limiti</li>
            <li>Standart teklif inceleme</li>
          </ul>
          <button class="btn" [disabled]="currentUser?.subscriptionType === 'FREE_ENTITY'" (click)="upgrade('FREE_ENTITY')">
            {{ currentUser?.subscriptionType === 'FREE_ENTITY' ? 'Mevcut Paketiniz' : 'Bu Pakete Geç' }}
          </button>
        </div>

        <div class="plan-card premium" [class.active]="currentUser?.subscriptionType === 'PRO_ENTITY'">
          <h3>Pro Kurum / Tüzel</h3>
          <div class="price">10.000 ₺ <small>/ yıl</small></div>
          <ul class="features">
            <li><strong>Sınırsız</strong> iş oluşturma</li>
            <li>Gelişmiş teklif filtreleme</li>
            <li><app-ai-tooltip></app-ai-tooltip></li>
            <li>Öncelikli destek</li>
          </ul>
          <button class="btn btn-primary" [disabled]="currentUser?.subscriptionType === 'PRO_ENTITY'" (click)="upgrade('PRO_ENTITY')">
            {{ currentUser?.subscriptionType === 'PRO_ENTITY' ? 'Mevcut Paketiniz' : 'Pro Pakete Yükselt' }}
          </button>
        </div>
      </div>

      <div class="plans-grid" *ngIf="isPlanner()">
        <!-- Planner Plans -->
        <div class="plan-card" [class.active]="currentUser?.subscriptionType === 'FREE_PLANNER'">
          <h3>Ücretsiz Plancı</h3>
          <div class="price">Ücretsiz</div>
          <ul class="features">
            <li>İşleri görüntüleme (Kurum Adı Gizli)</li>
            <li class="disabled">İşlere teklif verme (Yok)</li>
            <li class="disabled">Partner bulma (Yok)</li>
          </ul>
          <button class="btn" [disabled]="currentUser?.subscriptionType === 'FREE_PLANNER'" (click)="upgrade('FREE_PLANNER')">
            {{ currentUser?.subscriptionType === 'FREE_PLANNER' ? 'Mevcut Paketiniz' : 'Bu Pakete Geç' }}
          </button>
        </div>

        <div class="plan-card" [class.active]="currentUser?.subscriptionType === 'PRO_PLANNER'">
          <h3>Pro Plancı</h3>
          <div class="price">5.000 ₺ <small>/ yıl</small></div>
          <ul class="features">
            <li>Kurum adlarını açıkça görme</li>
            <li><strong>Sınırsız</strong> teklif verme</li>
            <li><app-ai-tooltip></app-ai-tooltip></li>
            <li class="disabled">Partner bulma (Yok)</li>
          </ul>
          <button class="btn btn-primary" [disabled]="currentUser?.subscriptionType === 'PRO_PLANNER'" (click)="upgrade('PRO_PLANNER')">
            {{ currentUser?.subscriptionType === 'PRO_PLANNER' ? 'Mevcut Paketiniz' : 'Pro Pakete Yükselt' }}
          </button>
        </div>

        <div class="plan-card premium" [class.active]="currentUser?.subscriptionType === 'PREMIUM_PLANNER'">
          <h3>Premium Plancı</h3>
          <div class="price">12.000 ₺ <small>/ yıl</small></div>
          <ul class="features">
            <li>Kurum adlarını açıkça görme</li>
            <li><strong>Sınırsız</strong> teklif verme</li>
            <li><strong>Partner Bulma Sistemi</strong></li>
            <li><app-ai-tooltip></app-ai-tooltip></li>
            <li>Üst karneli plancılara mesaj atma</li>
          </ul>
          <button class="btn btn-primary" [disabled]="currentUser?.subscriptionType === 'PREMIUM_PLANNER'" (click)="upgrade('PREMIUM_PLANNER')">
            {{ currentUser?.subscriptionType === 'PREMIUM_PLANNER' ? 'Mevcut Paketiniz' : 'Premium Pakete Yükselt' }}
          </button>
        </div>
      </div>
      
      <div *ngIf="!currentUser" class="login-prompt">
        Lütfen paketleri görebilmek için giriş yapın.
      </div>
    </div>
  `,
  styles: [`
    .pricing-container { padding: 4rem 2rem; max-width: 1000px; margin: 0 auto; text-align: center; color: var(--text-primary); }
    .header h2 { font-size: 2.5rem; margin-bottom: 0.5rem; }
    .header p { color: var(--text-secondary); margin-bottom: 3rem; }
    
    .plans-grid { display: flex; justify-content: center; gap: 2rem; flex-wrap: wrap; }
    
    .plan-card { background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; padding: 2rem; width: 300px; text-align: left; display: flex; flex-direction: column; transition: transform 0.3s, box-shadow 0.3s; }
    .plan-card:hover { transform: translateY(-5px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
    .plan-card.active { border: 2px solid var(--primary-color); position: relative; }
    .plan-card.active::before { content: 'Mevcut Paket'; position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: var(--primary-color); color: white; padding: 0.2rem 0.8rem; border-radius: 12px; font-size: 0.8rem; font-weight: bold; }
    .plan-card.premium { border: 1px solid var(--purple-primary); }
    
    .plan-card h3 { margin-top: 0; font-size: 1.25rem; }
    .price { font-size: 2rem; font-weight: bold; margin: 1.5rem 0; color: var(--text-primary); }
    .price small { font-size: 1rem; color: var(--text-muted); font-weight: normal; }
    
    .features { list-style: none; padding: 0; margin-bottom: 2rem; flex-grow: 1; }
    .features li { padding: 0.5rem 0; border-bottom: 1px solid var(--border-light); font-size: 0.95rem; }
    .features li::before { content: '✓ '; color: #48bb78; font-weight: bold; }
    .features li.disabled { color: var(--text-muted); text-decoration: line-through; }
    .features li.disabled::before { content: '✗ '; color: #f56565; }
    
    .btn { padding: 0.8rem; border: 1px solid var(--border-color); border-radius: 6px; cursor: pointer; font-weight: 600; width: 100%; transition: all 0.2s; background: var(--bg-secondary); color: var(--text-primary); }
    .btn:hover:not(:disabled) { background: var(--border-light); }
    .btn-primary { background: var(--primary-color); color: white; border: none; }
    .btn-primary:hover:not(:disabled) { background: var(--primary-hover); }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; }
    
    .login-prompt { margin-top: 2rem; font-size: 1.2rem; color: var(--text-secondary); }
  `]
})
export class PricingComponent implements OnInit {
  currentUser: User | null = null;

  constructor(
    private authService: AuthService,
    private subscriptionService: SubscriptionService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
  }

  isEntity(): boolean {
    return this.currentUser?.role === 'ROLE_ENTITY';
  }

  isPlanner(): boolean {
    return this.currentUser?.role === 'ROLE_PLANNER';
  }

  upgrade(newPlan: string) {
    if (!this.currentUser) return;
    
    if (confirm('Bu pakete geçmek/satın almak istediğinize emin misiniz? (Ödeme simüle edilecektir)')) {
      this.subscriptionService.upgradeSubscription(this.currentUser.id, newPlan).subscribe({
        next: (updatedUser) => {
          this.authService.setCurrentUser(updatedUser);
          this.currentUser = updatedUser;
          alert('Paketiniz başarıyla güncellendi!');
          this.router.navigate(['/profile']);
        },
        error: (err) => {
          console.error(err);
          alert('Bir hata oluştu.');
        }
      });
    }
  }
}
