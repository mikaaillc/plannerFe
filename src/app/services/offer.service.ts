import { API_URL } from '../config';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './auth.service';
import { Job } from './job.service';

export interface Offer {
  id: number;
  title: string;
  description: string;
  proposedPrice: number;
  partnerKarnes?: string;
  status: string;
  sender: User;
  job: Job;
  createdAt: string;
}

export interface Comment {
  id: number;
  text: string;
  user: User;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class OfferService {
  private apiUrl = API_URL + '/offers';

  constructor(private http: HttpClient) {}

  getJobOffers(jobId: number): Observable<Offer[]> {
    return this.http.get<Offer[]>(`${this.apiUrl}/job/${jobId}`);
  }

  getAcceptedOffers(plannerId: number): Observable<Offer[]> {
    return this.http.get<Offer[]>(`${this.apiUrl}/my-accepted-offers/${plannerId}`);
  }

  getOffer(id: number): Observable<Offer> {
    return this.http.get<Offer>(`${this.apiUrl}/${id}`);
  }

  createOffer(jobId: number, data: any): Observable<Offer> {
    return this.http.post<Offer>(`${this.apiUrl}/job/${jobId}`, data);
  }

  acceptOffer(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/accept`, {});
  }

  getComments(offerId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/${offerId}/comments`);
  }

  addComment(offerId: number, userId: number, text: string): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/${offerId}/comments`, { userId, text });
  }
}
