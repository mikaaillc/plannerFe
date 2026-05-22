import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../config';

export interface PartnerOffer {
  id?: number;
  sender: any;
  receiver: any;
  job: any;
  message: string;
  proposedFee: number;
  status: string;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PartnerOfferService {
  private apiUrl = API_URL + '/partner-offers';

  constructor(private http: HttpClient) {}

  createOffer(payload: any): Observable<PartnerOffer> {
    return this.http.post<PartnerOffer>(this.apiUrl, payload);
  }

  getReceivedOffers(userId: number): Observable<PartnerOffer[]> {
    return this.http.get<PartnerOffer[]>(`${this.apiUrl}/received?userId=${userId}`);
  }

  getSentOffers(userId: number): Observable<PartnerOffer[]> {
    return this.http.get<PartnerOffer[]>(`${this.apiUrl}/sent?userId=${userId}`);
  }

  updateStatus(id: number, status: string): Observable<PartnerOffer> {
    return this.http.put<PartnerOffer>(`${this.apiUrl}/${id}/status`, { status });
  }
}
