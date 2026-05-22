import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { JobService, Job } from '../services/job.service';
import { AuthService, User } from '../services/auth.service';

@Component({
  selector: 'app-entity-jobs',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="jobs-container">
      <div class="header-section">
        <h2>Oluşturduğum Plan İşleri</h2>
        <button class="btn btn-primary" routerLink="/job-create">+ Yeni İş Oluştur</button>
      </div>

      <div *ngIf="isLoading" class="loading">Yükleniyor...</div>
      
      <div *ngIf="!isLoading && jobs.length === 0" class="no-data">
        Henüz hiç iş oluşturmadınız.
      </div>

      <div class="jobs-list" *ngIf="!isLoading && jobs.length > 0">
        <div class="job-card" *ngFor="let job of jobs">
          <div class="job-header">
            <h3>{{ job.title }}</h3>
            <span class="status-badge" [ngClass]="job.status.toLowerCase()">{{ translateStatus(job.status) }}</span>
          </div>
          
          <p class="job-desc">{{ job.description }}</p>
          
          <div class="job-meta">
            <span><strong>Tip:</strong> {{ job.jobType }}</span>
            <span><strong>Min Karne:</strong> {{ job.minKarne }}</span>
            <span *ngIf="job.priceRangeMin"><strong>Fiyat Aralığı:</strong> {{ job.priceRangeMin }}₺ - {{ job.priceRangeMax }}₺</span>
          </div>
          
          <div class="job-actions">
            <button class="btn btn-secondary" (click)="viewOffers(job.id)">Gelen Teklifleri Gör</button>
            <button class="btn btn-outline" (click)="viewDetails(job.id)">Detayları Gör</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .jobs-container { padding: 2rem; max-width: 900px; margin: 0 auto; color: var(--text-primary); }
    .header-section { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .jobs-list { display: flex; flex-direction: column; gap: 1rem; }
    .job-card { background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 8px; padding: 1.5rem; }
    .job-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; }
    .job-header h3 { margin: 0; font-size: 1.25rem; }
    .status-badge { padding: 0.25rem 0.75rem; border-radius: 999px; font-size: 0.85rem; font-weight: 600; }
    .status-badge.open { background: #eebf3d; color: #fff; }
    .status-badge.in_progress { background: #4299e1; color: #fff; }
    .status-badge.completed { background: #48bb78; color: #fff; }
    .job-desc { color: var(--text-secondary); margin-bottom: 1.5rem; }
    .job-meta { display: flex; gap: 1.5rem; font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 1.5rem; }
    .job-actions { display: flex; gap: 1rem; }
    .btn { padding: 0.5rem 1rem; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; }
    .btn-primary { background: var(--primary-color); color: white; }
    .btn-secondary { background: #4a5568; color: white; }
    .btn-outline { background: transparent; border: 1px solid var(--border-color); color: var(--text-primary); }
  `]
})
export class EntityJobsComponent implements OnInit {
  jobs: Job[] = [];
  currentUser: User | null = null;
  isLoading = true;

  constructor(
    private jobService: JobService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser || this.currentUser.role !== 'ROLE_ENTITY') {
      this.router.navigate(['/']);
      return;
    }
    
    this.loadJobs();
  }

  loadJobs() {
    this.isLoading = true;
    this.jobService.getMyJobs(this.currentUser!.id).subscribe({
      next: (data) => {
        this.jobs = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  viewOffers(jobId: number) {
    this.router.navigate(['/job-offers', jobId]);
  }

  viewDetails(jobId: number) {
    this.router.navigate(['/job-detail', jobId]);
  }

  translateStatus(status: string): string {
    switch (status) {
      case 'OPEN': return 'AÇIK';
      case 'IN_PROGRESS': return 'DEVAM EDİYOR';
      case 'COMPLETED': return 'TAMAMLANDI';
      case 'CANCELLED': return 'İPTAL EDİLDİ';
      default: return status;
    }
  }
}
