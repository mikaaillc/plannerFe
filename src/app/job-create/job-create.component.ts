import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { JobService } from '../services/job.service';
import { AuthService, User } from '../services/auth.service';

@Component({
  selector: 'app-job-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="job-create-container">
      <div class="card">
        <h2>Yeni İş Oluştur</h2>
        
        <div class="form-group">
          <label>İş Tipi</label>
          <select [(ngModel)]="jobData.jobType" class="form-control">
            <option value="PLANLAMA">Planlama İşi</option>
            <option value="DANISMANLIK">Danışmanlık İşi</option>
          </select>
        </div>

        <div class="form-group">
          <label>İş Başlığı</label>
          <input type="text" [(ngModel)]="jobData.title" class="form-control" placeholder="Örn: X İlçesi İmar Planı" />
        </div>

        <div class="form-group">
          <label>İş Açıklaması</label>
          <textarea [(ngModel)]="jobData.description" class="form-control" rows="4" placeholder="İşin detayları..."></textarea>
        </div>

        <div class="form-group">
          <label>Minimum İstek (Karne)</label>
          <select [(ngModel)]="jobData.minKarne" class="form-control">
            <option value="A">A Grubu</option>
            <option value="B">B Grubu</option>
            <option value="C">C Grubu</option>
            <option value="D">D Grubu</option>
            <option value="E">E Grubu</option>
            <option value="F">F Grubu</option>
          </select>
        </div>

        <ng-container *ngIf="isKamu()">
          <div class="form-group">
            <label>Fiyat Aralığı (Min - Max)</label>
            <div style="display: flex; gap: 1rem;">
              <input type="number" [(ngModel)]="jobData.priceRangeMin" class="form-control" placeholder="Min" />
              <input type="number" [(ngModel)]="jobData.priceRangeMax" class="form-control" placeholder="Max" />
            </div>
          </div>

          <div class="form-group">
            <label>Detaylı Bilgiler (Ada, Parsel vb.)</label>
            <textarea [(ngModel)]="jobData.detailedInfo" class="form-control" rows="3"></textarea>
          </div>
        </ng-container>

        <button class="btn btn-primary" (click)="createJob()" [disabled]="isLoading">
          {{isLoading ? 'Oluşturuluyor...' : 'Oluştur'}}
        </button>
        <div *ngIf="error" class="error-msg">{{error}}</div>
      </div>
    </div>
  `,
  styles: [`
    .job-create-container { padding: 2rem; display: flex; justify-content: center; }
    .card { background: var(--card-bg); padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); width: 100%; max-width: 600px; border: 1px solid var(--border-color); color: var(--text-primary); }
    h2 { margin-top: 0; margin-bottom: 1.5rem; }
    .form-group { margin-bottom: 1.25rem; }
    .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
    .form-control { width: 100%; padding: 0.75rem; border: 1px solid var(--input-border); border-radius: 4px; box-sizing: border-box; background: var(--input-bg); color: var(--text-primary); }
    .btn { padding: 0.75rem 1.5rem; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; width: 100%; }
    .btn-primary { background: var(--primary-color); color: white; }
    .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
    .error-msg { color: #e53e3e; margin-top: 1rem; }
  `]
})
export class JobCreateComponent implements OnInit {
  currentUser: User | null = null;
  isLoading = false;
  error = '';
  
  jobData = {
    title: '',
    description: '',
    jobType: 'PLANLAMA',
    minKarne: 'F',
    priceRangeMin: null,
    priceRangeMax: null,
    detailedInfo: ''
  };

  constructor(
    private authService: AuthService,
    private jobService: JobService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser || this.currentUser.role !== 'ROLE_ENTITY') {
      this.router.navigate(['/']);
    }
  }

  isKamu(): boolean {
    return this.currentUser?.entityType === 'KAMU';
  }

  createJob() {
    if (!this.jobData.title || !this.jobData.description) {
      this.error = 'Lütfen başlık ve açıklama giriniz.';
      return;
    }

    if (this.isKamu()) {
      if (!this.jobData.priceRangeMin || !this.jobData.priceRangeMax) {
        this.error = 'Kamu kurumları için fiyat aralığı girmek zorunludur.';
        return;
      }
    }

    this.isLoading = true;
    this.error = '';

    const payload = {
      ...this.jobData,
      creatorId: this.currentUser?.id
    };

    this.jobService.createJob(payload).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/entity-jobs']);
      },
      error: (err) => {
        this.isLoading = false;
        this.error = 'İş oluşturulurken bir hata oluştu.';
        console.error(err);
      }
    });
  }
}
