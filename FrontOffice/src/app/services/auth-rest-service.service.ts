import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import {
  AuthResponse,
  LoginRequest,
  PublicUser,
  RegisterRequest,
  UpdatePasswordRequest,
  UpdateProfileRequest,
} from '../models/auth.models';

const CURRENT_USER_KEY = 'currentUser';

@Injectable({
  providedIn: 'root',
})
export class AuthRestServiceService {
  private endpoint = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<AuthResponse> {
    const body: LoginRequest = {
      email,
      password,
    };

    return this.http.post<AuthResponse>(`${this.endpoint}/login`, body);
  }

  register(registerData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.endpoint}/register`, registerData);
  }

  saveCurrentUser(authResponse: AuthResponse): void {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(authResponse));
  }

  getCurrentUser(): AuthResponse | null {
    const storedUser = localStorage.getItem(CURRENT_USER_KEY);

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser) as AuthResponse;
    } catch (error) {
      localStorage.removeItem(CURRENT_USER_KEY);
      return null;
    }
  }

  getToken(): string | null {
    const currentUser = this.getCurrentUser();
    return currentUser?.token || null;
  }

  getUser(): PublicUser | null {
    const currentUser = this.getCurrentUser();
    return currentUser?.user || null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(CURRENT_USER_KEY);
  }

  getProfile(): Observable<{ user: PublicUser }> {
    return this.http.get<{ user: PublicUser }>(`${this.endpoint}/me`);
  }

  updateProfile(
    profileData: UpdateProfileRequest,
  ): Observable<{ message: string; user: PublicUser }> {
    return this.http.put<{ message: string; user: PublicUser }>(`${this.endpoint}/me`, profileData);
  }

  updatePassword(passwordData: UpdatePasswordRequest): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.endpoint}/password`, passwordData);
  }
}
