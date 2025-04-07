// auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

export interface User {
  username: string;
  email?: string;
  password?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private router: Router) {}

  login(username: string, password: string): Observable<User> {
    const user: User = { username };
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', 'mock-token');
    return of(user);
  }

  signup(userData: any): Observable<any> {
    const user: User = { username: userData.username, email: userData.email };
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', 'mock-token');
    return of({ success: true });
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('token') !== null;
  }
}
