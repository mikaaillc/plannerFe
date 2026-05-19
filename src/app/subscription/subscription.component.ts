import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../services/auth.service';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subscription.component.html',
  styles: [`
    .pricing-container {
      max-width: 1000px;
      margin: 40px auto;
      text-align: center;
      font-family: 'Inter', sans-serif;
    }
    .pricing-cards {
      display: flex;
      justify-content: center;
      gap: 30px;
      margin-top: 40px;
    }
    .card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 40px 30px;
      width: 300px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
      transition: transform 0.3s;
    }
    .card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 15px rgba(0,0,0,0.1);
    }
    .card h3 {
      font-size: 1.5rem;
      color: #1f2937;
      margin-bottom: 10px;
    }
    .price {
      font-size: 2.5rem;
      font-weight: 700;
      color: #6366f1;
      margin-bottom: 20px;
    }
    .features {
      list-style: none;
      padding: 0;
      margin-bottom: 30px;
      text-align: left;
    }
    .features li {
      margin-bottom: 10px;
      color: #4b5563;
    }
    .features li i {
      color: #10b981;
      margin-right: 8px;
    }
    .btn-subscribe {
      background: #6366f1;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 1rem;
      cursor: pointer;
      width: 100%;
      font-weight: 600;
    }
    .btn-subscribe:hover {
      background: #4f46e5;
    }
    .badge {
      display: inline-block;
      padding: 6px 12px;
      background: #d1fae5;
      color: #065f46;
      border-radius: 20px;
      font-weight: 600;
      margin-bottom: 20px;
    }
  `]
})
export class SubscriptionComponent implements OnInit {
  currentUser: User | null = null;
  isLoading = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => this.currentUser = user);
  }

  subscribe(type: string) {
    if (!this.currentUser) {
      alert('Lütfen önce giriş yapın.');
      return;
    }
    this.isLoading = true;
    this.authService.subscribe(this.currentUser.id, type).subscribe({
      next: (user) => {
        this.isLoading = false;
        alert(type + ' planına başarıyla abone oldunuz!');
      },
      error: () => {
        this.isLoading = false;
        alert('Abonelik işlemi sırasında bir hata oluştu.');
      }
    });
  }
}
