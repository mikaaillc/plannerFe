import { API_URL } from '../config';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './auth.service';

export interface Job {
  id: number;
  title: string;
  description: string;
  jobType: string;
  minKarne: string;
  priceRangeMin?: number;
  priceRangeMax?: number;
  detailedInfo?: string;
  status: string;
  creator: User;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private apiUrl = API_URL + '/jobs';

  constructor(private http: HttpClient) {}

  createJob(data: any): Observable<Job> {
    return this.http.post<Job>(this.apiUrl, data);
  }

  getAvailableJobs(userId?: number): Observable<Job[]> {
    if (userId) {
      return this.http.get<Job[]>(`${this.apiUrl}?userId=${userId}`);
    }
    return this.http.get<Job[]>(this.apiUrl);
  }

  getMyJobs(creatorId: number): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.apiUrl}/my-jobs/${creatorId}`);
  }

  getJob(id: number, userId?: number): Observable<Job> {
    if (userId) {
      return this.http.get<Job>(`${this.apiUrl}/${id}?userId=${userId}`);
    }
    return this.http.get<Job>(`${this.apiUrl}/${id}`);
  }
}
