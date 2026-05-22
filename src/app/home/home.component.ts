import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ThemeService } from '../services/theme.service';
import { AiTooltipComponent } from '../components/ai-tooltip/ai-tooltip.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, AiTooltipComponent],
  template: `
    <div class="home-container">
      

      <header class="hero">
        <div class="hero-content">
          <h1>Şehrin Geleceğini Birlikte İnşa Edin</h1>
          <p>Şehir plancıları ile kurumları bir araya getiren yenilikçi teklif ve müzakere platformu. Sürdürülebilir ve modern projeler için doğru uzmanları bulun.</p>
          <div class="hero-buttons">
            <button class="btn btn-primary btn-large" routerLink="/register">Hemen Üye Ol</button>
            <button class="btn btn-secondary btn-large" routerLink="/login">Sisteme Giriş</button>
          </div>
        </div>
        <div class="hero-image">
          <img src="assets/images/hero.png" alt="City Planning Team">
        </div>
      </header>

      <section id="about" class="about">
        <h2>Hakkımızda</h2>
        <div class="about-grid">
          <div class="about-card">
            <div class="icon">🏢</div>
            <h3>Kurumlar İçin</h3>
            <p>Projeleriniz için en iyi şehir plancılarını bulun, portfolyolarını inceleyin ogün ve onlara hızlıca teklif gönderin.</p>
          </div>
          <div class="about-card">
            <div class="icon">📐</div>
            <h3>Şehir Plancıları İçin</h3>
            <p>Kurumlardan gelen iş tekliflerini değerlendirin, fiyat müzakereleri yapın ve profesyonel profilinizi oluşturun.</p>
          </div>
          <div class="about-card">
            <div class="icon">🤝</div>
            <h3>Kolay İletişim</h3>
            <p>Teklifler üzerinden anlık mesajlaşarak detayları konuşun, anlaşmaları hızla sonlandırın.</p>
          </div>
        </div>
      </section>

      <section id="pricing" class="pricing">
        <h2>Üyelik Planları</h2>
        <p class="pricing-subtitle">İhtiyacınıza en uygun planı seçin ve hemen teklifleşmeye başlayın.</p>
        
        <div class="role-toggle-container">
          <div class="role-toggle">
            <button class="toggle-btn" [class.active]="selectedRole === 'PLANNER'" (click)="setRole('PLANNER')">Şehir Plancıları İçin</button>
            <button class="toggle-btn" [class.active]="selectedRole === 'ENTITY'" (click)="setRole('ENTITY')">Kurum / Tüzel Kişiler İçin</button>
          </div>
        </div>
        
        <div class="billing-toggle-container">
          <span [class.active]="billingCycle === 'MONTHLY'">Aylık</span>
          <label class="switch">
            <input type="checkbox" [checked]="billingCycle === 'YEARLY'" (change)="toggleBilling()">
            <span class="slider round"></span>
          </label>
          <span [class.active]="billingCycle === 'YEARLY'">Yıllık <span class="discount-badge">%20 İndirim</span></span>
        </div>

        <!-- Plancı Planları -->
        <div class="pricing-cards" *ngIf="selectedRole === 'PLANNER'">
          <div class="pricing-card">
            <h3>Pro Plancı</h3>
            <div class="price">
              {{ billingCycle === 'MONTHLY' ? '₺499' : '₺5.000' }}
              <span>{{ billingCycle === 'MONTHLY' ? '/ay' : '/yıl' }}</span>
            </div>
            <ul class="features">
              <li><i>✓</i> Sınırsız Teklif Verme</li>
              <li><i>✓</i> Kurum/Tüzel İsimlerini Görme</li>
              <li><i>✓</i> <app-ai-tooltip></app-ai-tooltip></li>
              <li><i>✓</i> Standart Destek</li>
            </ul>
            <button class="btn btn-primary" style="width: 100%" routerLink="/register">Hemen Abone Ol</button>
          </div>

          <div class="pricing-card popular">
            <div class="popular-badge">EN ÇOK TERCİH EDİLEN</div>
            <h3>Premium Plancı</h3>
            <div class="price">
              {{ billingCycle === 'MONTHLY' ? '₺999' : '₺12.000' }}
              <span>{{ billingCycle === 'MONTHLY' ? '/ay' : '/yıl' }}</span>
            </div>
            <ul class="features">
              <li><i>✓</i> Sınırsız Teklif Verme</li>
              <li><i>✓</i> Kurum İsimlerini Görme</li>
              <li><i>✓</i> <strong>Partner Bulma Özelliği (Üst Karne)</strong></li>
              <li><i>✓</i> <app-ai-tooltip></app-ai-tooltip></li>
              <li><i>✓</i> Premium Profil Rozeti</li>
            </ul>
            <button class="btn btn-primary" style="width: 100%" routerLink="/register">Premium Abone Ol</button>
          </div>
        </div>

        <!-- Kurum Planları -->
        <div class="pricing-cards" *ngIf="selectedRole === 'ENTITY'">
          <div class="pricing-card">
            <h3>Ücretsiz Kurum</h3>
            <div class="price">₺0<span>{{ billingCycle === 'MONTHLY' ? '/ay' : '/yıl' }}</span></div>
            <ul class="features">
              <li><i>✓</i> En fazla 2 İş / İlan Oluşturma</li>
              <li><i>✓</i> Plancı Tekliflerini İnceleme</li>
              <li><i>✓</i> Temel Profil Görünümü</li>
            </ul>
            <button class="btn btn-outline" style="width: 100%" routerLink="/register">Ücretsiz Başla</button>
          </div>

          <div class="pricing-card popular">
            <div class="popular-badge">KURUMSALLAR İÇİN</div>
            <h3>Pro Kurum / Tüzel</h3>
            <div class="price">
              {{ billingCycle === 'MONTHLY' ? '₺1.499' : '₺10.000' }}
              <span>{{ billingCycle === 'MONTHLY' ? '/ay' : '/yıl' }}</span>
            </div>
            <ul class="features">
              <li><i>✓</i> <strong>Sınırsız İlan (İş) Oluşturma</strong></li>
              <li><i>✓</i> Sınırsız Teklif Alma</li>
              <li><i>✓</i> Öncelikli İlan Gösterimi</li>
              <li><i>✓</i> <app-ai-tooltip></app-ai-tooltip></li>
              <li><i>✓</i> Gelişmiş Kurum Profili</li>
            </ul>
            <button class="btn btn-primary" style="width: 100%" routerLink="/register">Pro Abone Ol</button>
          </div>
        </div>
      </section>
      
      <footer>
        <img src="assets/images/cityplanner_logo.png" alt="Şehir Plancı Platformu Logo" style="height: 40px; margin-bottom: 10px; display: block; margin: 0 auto 10px auto;">
        <p>&copy; 2026 Şehir Plancı Platformu. Tüm hakları saklıdır.</p>
      </footer>
    </div>
  `,
  styles: [`
    .home-container { font-family: 'Inter', sans-serif; color: var(--text-primary); background: var(--bg-primary); min-height: 100vh; }
    .navbar { display: flex; justify-content: space-between; align-items: center; padding: 1rem 4rem; background: var(--card-bg); box-shadow: 0 2px 10px rgba(0,0,0,0.05); position: sticky; top: 0; z-index: 100; border-bottom: 1px solid var(--border-color); }
    .logo img { height: 75px; transition: filter 0.3s ease; }
    :host-context(.dark) .logo img { filter: brightness(0) invert(1); }
    .nav-links { display: flex; gap: 2rem; align-items: center; }
    .nav-links a { text-decoration: none; color: var(--text-secondary); font-weight: 500; transition: color 0.2s; }
    .nav-links a:hover { color: var(--primary-color); }
    
    .btn { padding: 0.6rem 1.2rem; border-radius: 6px; font-weight: 600; cursor: pointer; transition: all 0.2s; border: none; font-size: 0.95rem; }
    .btn-outline { background: transparent; border: 2px solid var(--primary-color); color: var(--primary-color); }
    .btn-outline:hover { background: var(--bg-info-light); }
    .btn-primary { background: var(--primary-color); color: white; }
    .btn-primary:hover { background: var(--primary-hover); }
    .btn-secondary { background: var(--border-color); color: var(--text-secondary); }
    .btn-secondary:hover { background: var(--input-border); }
    .btn-large { padding: 0.8rem 2rem; font-size: 1.1rem; }
    
    .hero { display: flex; align-items: center; justify-content: space-between; padding: 4rem; background: var(--bg-secondary); min-height: 70vh; }
    .hero-content { flex: 1; padding-right: 4rem; }
    .hero h1 { font-size: 3.5rem; line-height: 1.2; margin-bottom: 1.5rem; color: var(--text-primary); letter-spacing: -1px; }
    .hero p { font-size: 1.25rem; color: var(--text-secondary); margin-bottom: 2.5rem; line-height: 1.6; }
    .hero-buttons { display: flex; gap: 1rem; }
    
    .hero-image { flex: 1; text-align: right; }
    .hero-image img { max-width: 100%; border-radius: 20px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04); }
    
    .about { padding: 6rem 4rem; background: var(--bg-primary); text-align: center; }
    .about h2 { font-size: 2.5rem; margin-bottom: 3rem; color: var(--text-primary); }
    .about-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 3rem; }
    .about-card { padding: 2.5rem; background: var(--card-bg); border-radius: 16px; transition: transform 0.3s; border: 1px solid var(--border-color); }
    .about-card:hover { transform: translateY(-10px); box-shadow: 0 10px 15px rgba(0,0,0,0.05); }
    .icon { font-size: 3rem; margin-bottom: 1.5rem; }
    .about-card h3 { font-size: 1.5rem; margin-bottom: 1rem; color: var(--text-primary); }
    .about-card p { color: var(--text-secondary); line-height: 1.6; }

    .pricing { padding: 6rem 4rem; background: var(--bg-secondary); text-align: center; }
    .pricing h2 { font-size: 2.5rem; margin-bottom: 1rem; color: var(--text-primary); }
    .pricing-subtitle { color: var(--text-secondary); font-size: 1.1rem; margin-bottom: 3rem; }
    .pricing-cards { display: flex; justify-content: center; gap: 2rem; max-width: 900px; margin: 0 auto; }
    .pricing-card { background: var(--card-bg); border-radius: 16px; padding: 2.5rem; width: 100%; max-width: 380px; border: 1px solid var(--border-color); text-align: left; box-shadow: 0 4px 6px rgba(0,0,0,0.05); transition: transform 0.3s; position: relative; }
    .pricing-card:hover { transform: translateY(-5px); box-shadow: 0 10px 15px rgba(0,0,0,0.1); }
    .pricing-card h3 { font-size: 1.5rem; color: var(--text-primary); margin-bottom: 1rem; }
    .pricing-card .price { font-size: 2.5rem; font-weight: 700; color: var(--primary-color); margin-bottom: 2rem; }
    .pricing-card .price span { font-size: 1rem; color: var(--text-secondary); font-weight: 400; }
    .pricing-card .features { list-style: none; padding: 0; margin-bottom: 2rem; }
    .pricing-card .features li { margin-bottom: 1rem; color: var(--text-secondary); display: flex; align-items: center; gap: 0.5rem; }
    .pricing-card .features li i { color: #10b981; font-style: normal; }
    .pricing-card.popular { border-color: var(--primary-color); border-width: 2px; transform: scale(1.05); box-shadow: 0 10px 20px rgba(0,0,0,0.08); }
    .pricing-card.popular:hover { transform: scale(1.05) translateY(-5px); }
    .popular-badge { position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: var(--primary-color); color: white; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 700; }
    
    footer { text-align: center; padding: 2rem; background: var(--bg-navbar); color: #a0aec0; }

    .role-toggle-container { display: flex; justify-content: center; margin-bottom: 3rem; }
    .role-toggle { display: inline-flex; background: var(--card-bg); border-radius: 30px; padding: 4px; border: 1px solid var(--border-color); box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
    .toggle-btn { background: transparent; border: none; padding: 0.8rem 2rem; border-radius: 26px; font-weight: 600; cursor: pointer; color: var(--text-secondary); transition: all 0.3s; font-size: 1rem; }
    .toggle-btn.active { background: var(--primary-color); color: white; box-shadow: 0 4px 6px rgba(107, 70, 193, 0.2); }
    
    .billing-toggle-container { display: flex; align-items: center; justify-content: center; gap: 1rem; margin-bottom: 3rem; font-weight: 600; color: var(--text-secondary); }
    .billing-toggle-container span.active { color: var(--text-primary); }
    .switch { position: relative; display: inline-block; width: 60px; height: 34px; }
    .switch input { opacity: 0; width: 0; height: 0; }
    .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: var(--border-color); transition: .4s; border-radius: 34px; }
    .slider:before { position: absolute; content: ""; height: 26px; width: 26px; left: 4px; bottom: 4px; background-color: white; transition: .4s; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
    input:checked + .slider { background-color: var(--primary-color); }
    input:checked + .slider:before { transform: translateX(26px); }
    .discount-badge { background: #10b981; color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; margin-left: 0.5rem; vertical-align: middle; }

    /* Mobile Responsiveness */
    @media (max-width: 768px) {
      .navbar { flex-direction: column; padding: 1rem; gap: 1rem; }
      .nav-links { flex-wrap: wrap; justify-content: center; gap: 1rem; }
      .hero { flex-direction: column; padding: 2rem 1rem; text-align: center; }
      .hero-content { padding-right: 0; margin-bottom: 2rem; }
      .hero h1 { font-size: 2.2rem; }
      .hero p { font-size: 1rem; }
      .hero-buttons { justify-content: center; flex-direction: column; width: 100%; }
      .hero-buttons .btn { width: 100%; }
      .about { padding: 3rem 1rem; }
      .about-grid { grid-template-columns: 1fr; gap: 1.5rem; }
    }
  `]
})
export class HomeComponent {
  selectedRole: 'PLANNER' | 'ENTITY' = 'PLANNER';
  billingCycle: 'MONTHLY' | 'YEARLY' = 'MONTHLY';

  constructor(public themeService: ThemeService) {}

  setRole(role: 'PLANNER' | 'ENTITY') {
    this.selectedRole = role;
  }

  toggleBilling() {
    this.billingCycle = this.billingCycle === 'MONTHLY' ? 'YEARLY' : 'MONTHLY';
  }
}
