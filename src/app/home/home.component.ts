import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

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
            <p>Projeleriniz için en iyi şehir plancılarını bulun, portfolyolarını inceleyin ve onlara hızlıca teklif gönderin.</p>
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
      
      <footer>
        <p>&copy; 2026 CityPlanner. Tüm hakları saklıdır.</p>
      </footer>
    </div>
  `,
  styles: [`
    .home-container { font-family: 'Inter', sans-serif; color: #2d3748; }
    .navbar { display: flex; justify-content: space-between; align-items: center; padding: 1rem 4rem; background: white; box-shadow: 0 2px 10px rgba(0,0,0,0.05); position: sticky; top: 0; z-index: 100; }
    .logo img { height: 50px; }
    .nav-links { display: flex; gap: 2rem; align-items: center; }
    .nav-links a { text-decoration: none; color: #4a5568; font-weight: 500; transition: color 0.2s; }
    .nav-links a:hover { color: #4299e1; }
    
    .btn { padding: 0.6rem 1.2rem; border-radius: 6px; font-weight: 600; cursor: pointer; transition: all 0.2s; border: none; font-size: 0.95rem; }
    .btn-outline { background: transparent; border: 2px solid #4299e1; color: #4299e1; }
    .btn-outline:hover { background: #ebf8ff; }
    .btn-primary { background: #4299e1; color: white; }
    .btn-primary:hover { background: #3182ce; }
    .btn-secondary { background: #edf2f7; color: #4a5568; }
    .btn-secondary:hover { background: #e2e8f0; }
    .btn-large { padding: 0.8rem 2rem; font-size: 1.1rem; }
    
    .hero { display: flex; align-items: center; justify-content: space-between; padding: 4rem; background: linear-gradient(135deg, #f5f7fa 0%, #e2e8f0 100%); min-height: 70vh; }
    .hero-content { flex: 1; padding-right: 4rem; }
    .hero h1 { font-size: 3.5rem; line-height: 1.2; margin-bottom: 1.5rem; color: #1a202c; letter-spacing: -1px; }
    .hero p { font-size: 1.25rem; color: #4a5568; margin-bottom: 2.5rem; line-height: 1.6; }
    .hero-buttons { display: flex; gap: 1rem; }
    
    .hero-image { flex: 1; text-align: right; }
    .hero-image img { max-width: 100%; border-radius: 20px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04); }
    
    .about { padding: 6rem 4rem; background: white; text-align: center; }
    .about h2 { font-size: 2.5rem; margin-bottom: 3rem; color: #2d3748; }
    .about-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 3rem; }
    .about-card { padding: 2.5rem; background: #f8fafc; border-radius: 16px; transition: transform 0.3s; border: 1px solid #edf2f7; }
    .about-card:hover { transform: translateY(-10px); box-shadow: 0 10px 15px rgba(0,0,0,0.05); }
    .icon { font-size: 3rem; margin-bottom: 1.5rem; }
    .about-card h3 { font-size: 1.5rem; margin-bottom: 1rem; color: #2d3748; }
    .about-card p { color: #718096; line-height: 1.6; }
    
    footer { text-align: center; padding: 2rem; background: #1a202c; color: #a0aec0; }
  `]
})
export class HomeComponent {}
