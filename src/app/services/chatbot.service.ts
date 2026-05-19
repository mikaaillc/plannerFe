import { API_URL } from '../config';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private apiUrl = API_URL + '/chat';

  constructor(private http: HttpClient) {}

  sendMessage(message: string, userId?: number): Observable<{response: string}> {
    return this.http.post<{response: string}>(this.apiUrl, { message, userId });
  }

  reportError(message: string, userId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/report-error`, { message, userId });
  }
}
