// auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

export interface User {
  username: string;
  email?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private router: Router) {}

  login(username: string, password: string): Observable<User> {
    const user: User = { username };
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', 'dummy-token'); // <-- This is crucial
    return of(user);
  }

  signup(userData: any): Observable<any> {
    const user: User = { username: userData.username, email: userData.email };
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', 'dummy-token'); // <-- This is crucial
    return of({ success: true });
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token'); // <-- This is crucial
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('token') !== null; // Guard depends on this
  }
}
