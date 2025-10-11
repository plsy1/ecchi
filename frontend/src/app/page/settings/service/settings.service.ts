import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { EnvironmentConfig } from '../models/settings.interface';
import { CommonService } from '../../../common.service';
import { throwError } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  constructor(private common: CommonService, private http: HttpClient) {}

  updateEnvironment(env: EnvironmentConfig): Observable<boolean> {
    const url = `${this.common.apiUrl}/system/updateEnvironment`;
    const accessToken = localStorage.getItem('access_token') ?? '';

    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });
    return this.http.post<{ success?: boolean }>(url, env, { headers }).pipe(
      map((data) => data.success ?? true),
      catchError((error) => {
        console.error('Error updating environment:', error);
        if (error.status === 401) {
          this.common.logout();
        }
        return of(false);
      })
    );
  }

  getEnvironment(): Observable<EnvironmentConfig> {
    const url = `${this.common.apiUrl}/system/getEnvironment`;

    const accessToken = localStorage.getItem('access_token') ?? '';

    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });
    return this.http.get<EnvironmentConfig>(url, { headers }).pipe(
      catchError((error) => {
        console.error('Error fetching environment:', error);
        if (error.status === 401) {
          this.common.logout();
        }
        throw error;
      })
    );
  }

  changePassword(
    username: string,
    old_password: string,
    new_password: string
  ): Observable<boolean> {
    const url = `${this.common.apiUrl}/auth/changepassword`;
    const formData = new FormData();
    formData.append('username', username);
    formData.append('old_password', old_password);
    formData.append('new_password', new_password);

    return this.http.post<{ message: string }>(url, formData).pipe(
      map((data) => data.message === 'Password updated successfully'),
      catchError((error) => {
        console.error('Failed to change password:', error);
        return of(false);
      })
    );
  }

  refreshKeywordsFeeds(): Observable<{ message: string }> {
    const accessToken = localStorage.getItem('access_token') ?? '';

    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });
    const url = `${this.common.apiUrl}/feed/refreshKeywordsFeeds`;
    return this.http.post<{ message: string }>(url, {}, { headers }).pipe(
      catchError((error) => {
        if (error.status === 401) {
          this.common.logout();
        }
        console.error('Error refreshing keyword feeds:', error);
        return throwError(() => error);
      })
    );
  }
}
