import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../config';
import { User } from './auth.service';

export interface LimitResponse {
  usedJobs: number;
  remainingJobs: number;
}

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private apiUrl = API_URL + '/subscriptions';

  constructor(private http: HttpClient) {}

  getLimits(userId: number): Observable<LimitResponse> {
    return this.http.get<LimitResponse>(`${this.apiUrl}/limits/${userId}`);
  }

  upgradeSubscription(userId: number, newPlan: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/upgrade`, { userId, newPlan });
  }

  cancelSubscription(userId: number): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/cancel/${userId}`, {});
  }
}
