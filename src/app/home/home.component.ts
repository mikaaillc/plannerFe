import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="home-container">
      <nav class="navbar">
        <div class="logo">
          <img src="assets/images/logo.png" alt="CityPlanner Logo">
        </div>
        <div class="nav-links">
          <a href="#about">Hakkımızda</a>
          <a href="#features">Özellikler</a>
          <label class="theme-switch">
  <input type="checkbox" [checked]="themeService.isDark()" (change)="themeService.toggleTheme()">
  <span class="slider round">
    <span class="icon sun">☀️</span>
    <span class="icon moon">🌙</span>
  </span>
</label>
          <button class="btn btn-outline" routerLink="/login">Giriş Yap</button>
          <button class="btn btn-primary" routerLink="/register">Kayıt Ol</button>
        </div>
      </nav>

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
        <div class="pricing-cards">
          <div class="pricing-card">
            <h3>Aylık Plan</h3>
            <div class="price">₺499<span>/ay</span></div>
            <ul class="features">
              <li><i>✓</i> Sınırsız Teklif Verme</li>
              <li><i>✓</i> Tüzel Kişilerden Teklif Alma</li>
              <li><i>✓</i> Öncelikli Destek</li>
              <li><i>✓</i> Gemini AI Asistanı</li>
            </ul>
            <button class="btn btn-primary" style="width: 100%" routerLink="/register">Hemen Abone Ol</button>
          </div>

          <div class="pricing-card popular">
            <div class="popular-badge">EN ÇOK TERCİH EDİLEN</div>
            <h3>Yıllık Plan</h3>
            <div class="price">₺4,990<span>/yıl</span></div>
            <ul class="features">
              <li><i>✓</i> Aylık plana göre 2 ay bedava</li>
              <li><i>✓</i> Sınırsız Teklif Verme</li>
              <li><i>✓</i> Tüzel Kişilerden Teklif Alma</li>
              <li><i>✓</i> Premium Profil Rozeti</li>
              <li><i>✓</i> Gemini AI Asistanı</li>
            </ul>
            <button class="btn btn-primary" style="width: 100%" routerLink="/register">Yıllık Abone Ol</button>
          </div>
        </div>
      </section>
      
      <footer>
        <p>&copy; 2026 CityPlanner. Tüm hakları saklıdır.</p>
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
  constructor(public themeService: ThemeService) {}
}
