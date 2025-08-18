import { Injectable } from '@angular/core';
import { CommonService } from '../../../common.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient, private common: CommonService) {}

  getEmbyItemTotalCount(): Observable<any> {
    const url = `${this.common.apiUrl}/emby/get_item_counts`;
    return this.http.get(url, { headers: this.headers });
  }

  getEmbyLatestItems(): Observable<any> {
    const url = `${this.common.apiUrl}/emby/get_latest`;
    return this.http.get(url, { headers: this.headers });
  }

  getEmbyResumeItems(): Observable<any> {
    const url = `${this.common.apiUrl}/emby/get_resume`;
    return this.http.get(url, { headers: this.headers });
  }

  getEmbyViews(): Observable<any> {
    const url = `${this.common.apiUrl}/emby/get_views`;
    return this.http.get(url, { headers: this.headers });
  }
}