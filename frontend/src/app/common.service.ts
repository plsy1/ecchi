import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, throwError, Observable } from 'rxjs';
import { of } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class CommonService {
  apiUrl = '/api/v1';
  public isJumpFromProductionPage: boolean = false;
  public currentPerformer: string = '';

  constructor(private router: Router, private http: HttpClient) {}

  login(username: string, password: string): Observable<boolean> {
    const url = `${this.apiUrl}/auth/login`;
    const body = new HttpParams()
      .set('username', username)
      .set('password', password);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    return this.http
      .post<{ access_token?: string }>(url, body.toString(), { headers })
      .pipe(
        map((data) => {
          if (data.access_token) {
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('loggedIn', 'true');
            return true;
          }
          return false;
        }),
        catchError((error) => {
          console.error('Login request failed', error);
          return throwError(() => new Error('Request Failed'));
        })
      );
  }

  logout(): void {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('access_token');
    this.router.navigate(['/login']);
  }

verifyTokenExpiration(): Observable<boolean> {
  const url = `${this.apiUrl}/auth/verify`;
  const accessToken = localStorage.getItem('access_token') ?? '';

  const formData = new FormData();
  formData.append('access_token', accessToken);

  return this.http.post<boolean>(url, formData).pipe(
    catchError(error => {
      console.error('Token verification failed', error);
      return of(false); // 出错时返回 false
    })
  );
}
}
