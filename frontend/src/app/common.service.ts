import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class CommonService {
  private isDev = !environment.production;
  apiUrl = this.isDev ? 'http://localhost:8964/api/v1' : '/api/v1';

  vauleOfPerformerSearch: string = '';
  valueOfKeywordsSearch: string = '';
  // valueofTorrentsSearch: string = '';

  discoverType: number = 0;
  productionLink: string = ';';

  searchResultsSubject = new BehaviorSubject<any[]>([]);
  searchResults$ = this.searchResultsSubject.asObservable();

  searchKeywordsSubject = new BehaviorSubject<any[]>([]);
  searchKeywords$ = this.searchKeywordsSubject.asObservable();

  torrentSearchResultsSubject = new BehaviorSubject<any[]>([]);
  torrentSearchResults$ = this.torrentSearchResultsSubject.asObservable();

  constructor(private router: Router) {}

  async login(username: string, password: string): Promise<boolean> {
    const loginData = new URLSearchParams();
    loginData.append('username', username);
    loginData.append('password', password);

    const url = `${this.apiUrl}/auth/login`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: loginData,
      });

      if (!response.ok) {
        throw new Error('登录请求失败');
      }

      const data = await response.json();

      if (data.access_token) {
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('loggedIn', 'true');
        return true;
      }

      // 如果没有 access_token，登录失败
      return false;
    } catch (error) {
      console.error('登录失败:', error);
      throw new Error('登录失败，请稍后再试');
    }
  }

  logout(): void {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('access_token');
    this.router.navigate(['/login']);
  }

}
