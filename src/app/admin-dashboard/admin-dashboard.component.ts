import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, ErrorReport } from '../services/admin.service';
import { User } from '../services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styles: [`
    .admin-container { padding: 20px; font-family: 'Inter', sans-serif; }
    h1 { color: #1f2937; margin-bottom: 20px; }
    h2 { color: #4b5563; margin-top: 30px; margin-bottom: 10px; }
    .data-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    .data-table th, .data-table td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
    .data-table th { background-color: #f9fafb; color: #374151; }
    .badge { padding: 4px 8px; border-radius: 12px; font-size: 0.8rem; font-weight: 500; }
    .badge-paid { background-color: #d1fae5; color: #065f46; }
    .badge-unpaid { background-color: #fee2e2; color: #991b1b; }
  `]
})
export class AdminDashboardComponent implements OnInit {
  users: User[] = [];
  errorReports: ErrorReport[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.adminService.getUsers().subscribe(users => this.users = users);
    this.adminService.getErrorReports().subscribe(reports => this.errorReports = reports);
  }
}
