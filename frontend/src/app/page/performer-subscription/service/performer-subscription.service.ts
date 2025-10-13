import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from '../../../common.service';

@Injectable({
  providedIn: 'root',
})
export class PerformerSubscriptionService {
  constructor(private common: CommonService) {}

  getActressCollect(): Observable<any> {
    return this.common.request<any>('GET', 'feed/getCollectList');
  }

  removeActressCollect(urlParam: string): Observable<any> {
    return this.common.request<any>('DELETE', 'feed/delActressCollect', {
      body: new URLSearchParams({ url: urlParam }).toString(),
      acceptJson: true,
    });
  }

  getActressFeed(): Observable<any> {
    return this.common.request<any>('GET', 'feed/getFeedsList');
  }

  removeFeedsRSS(urlParam: string): Observable<any> {
    return this.common.request<any>('DELETE', 'feed/delFeeds', {
      body: new URLSearchParams({ title: urlParam }).toString(),
      acceptJson: true,
    });
  }
}
