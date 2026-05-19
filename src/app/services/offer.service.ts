import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './auth.service';

export interface Offer {
  id: number;
  title: string;
  description: string;
  proposedPrice: number;
  status: string;
  sender: User;
  receiver: User;
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
  // LÜTFEN BURADAKİ LİNKİ KENDİ RENDER LİNKİNİZLE DEĞİŞTİRİN (Örn: https://planner-backend.onrender.com)
  private apiUrl = 'https://BURAYA-RENDER-LINKINIZ-GELECEK.onrender.com/api/offers';

  constructor(private http: HttpClient) {}

  getUserOffers(userId: number): Observable<Offer[]> {
    return this.http.get<Offer[]>(`${this.apiUrl}/user/${userId}`);
  }

  getOffer(id: number): Observable<Offer> {
    return this.http.get<Offer>(`${this.apiUrl}/${id}`);
  }

  createOffer(data: any): Observable<Offer> {
    return this.http.post<Offer>(this.apiUrl, data);
  }

  updateStatus(id: number, status: string, proposedPrice?: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/status`, { status, proposedPrice });
  }

  getComments(offerId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/${offerId}/comments`);
  }

  addComment(offerId: number, userId: number, text: string): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/${offerId}/comments`, { userId, text });
  }
}
