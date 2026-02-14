import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';

export type LoginRequest = { username: string; password: string };
export type TokenResponse = { accessToken: string; tokenType: string; expiresInSeconds: number };

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly KEY = 'access_token';

  constructor(private http: HttpClient) {}

  login(request: LoginRequest) {
    return this.http.post<TokenResponse>(`${environment.apiUrl}/auth/login`, request).pipe(
      tap(response => localStorage.setItem(this.KEY, response.accessToken))
    );
  }

  logout() {
    localStorage.removeItem(this.KEY);
  }

  setToken(token: string) {
    localStorage.setItem('access_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

}
