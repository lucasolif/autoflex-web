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

  login(req: LoginRequest) {
    return this.http.post<TokenResponse>(`${environment.apiUrl}/api/auth/login`, req).pipe(
      tap(res => localStorage.setItem(this.KEY, res.accessToken))
    );
  }

  logout() {
    localStorage.removeItem(this.KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(this.KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
