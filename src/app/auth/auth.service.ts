import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';
import { environment } from '@envs/environment';

export interface Credential {
  email: string;
  password: string;
}

export interface RegisterPayload extends Credential {
  username: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  mustChangePassword: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/auth`;
  private userSubject = new BehaviorSubject<User | null>(null);

  readonly authState$ = this.userSubject.asObservable();

  get UserData(): User | null {
    return this.userSubject.value;
  }

  loadCurrentUser(): Observable<User | null> {
    return this.http.get<User>(`${this.baseUrl}/me`).pipe(
      tap((user) => this.userSubject.next(user)),
      catchError(() => {
        this.userSubject.next(null);
        return of(null);
      })
    );
  }

  registerWithEmailAndPassword(payload: RegisterPayload): Observable<User> {
    return this.http
      .post<User>(`${this.baseUrl}/register`, payload)
      .pipe(tap((user) => this.userSubject.next(user)));
  }

  logInWithEmailAndPassword(credential: Credential): Observable<User> {
    return this.http
      .post<User>(`${this.baseUrl}/login`, credential)
      .pipe(tap((user) => this.userSubject.next(user)));
  }

  logOut(): Observable<void> {
    return this.http
      .post<void>(`${this.baseUrl}/logout`, {})
      .pipe(tap(() => this.userSubject.next(null)));
  }

  changePassword(currentPassword: string, newPassword: string): Observable<void> {
    return this.http
      .post<void>(`${this.baseUrl}/change-password`, { currentPassword, newPassword })
      .pipe(
        tap(() => {
          const current = this.userSubject.value;
          if (current) this.userSubject.next({ ...current, mustChangePassword: false });
        })
      );
  }
}
