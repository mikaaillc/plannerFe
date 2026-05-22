import { API_URL } from '../config';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface User {
  id: number;
  username: string;
  fullName: string;
  role: string;
  entityType?: string;
  karne?: string;
  phone?: string;
  isPaid?: boolean;
  subscriptionType?: string;
  subscriptionExpiryDate?: string;
  bio?: string;
  location?: string;
  skills?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = API_URL + '/auth';
  private userUrl = API_URL + '/users';
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(username: string, password: string):Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, { username, password })
      .pipe(
        tap(user => {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        })
      );
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  setCurrentUser(user: User) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.userUrl);
  }

  subscribe(userId: number, type: string): Observable<User> {
    return this.http.post<User>(`${this.userUrl}/${userId}/subscribe`, { type }).pipe(
      tap(user => {
        if (this.currentUserSubject.value?.id === user.id) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }
      })
    );
  }
}
