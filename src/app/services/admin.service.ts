import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './auth.service';

export interface ErrorReport {
  id: number;
  message: string;
  reportedBy: User;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:8080/api/admin';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  getErrorReports(): Observable<ErrorReport[]> {
    return this.http.get<ErrorReport[]>(`${this.apiUrl}/error-reports`);
  }
}
