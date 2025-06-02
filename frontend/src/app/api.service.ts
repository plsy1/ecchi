import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Router } from '@angular/router';

import { environment } from '../environments/environment';

interface ActressList {
  title: string;
  created_at: string;
  url: string;
  id: number;
  description: string;
}

interface KeywordFeed {
  id: number;
  keyword: string;
  img: string;
}


@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private isDev = !environment.production;
  private apiUrl = this.isDev ? 'http://localhost:8964/api/v1' : '/api/v1';

  private _currentPage: number = 1;
  private _discoverType: number = 1;

  private searchResultsSubject = new BehaviorSubject<any[]>([]);
  searchResults$ = this.searchResultsSubject.asObservable();

  private discoverResultsSubject = new BehaviorSubject<any[]>([]);
  discoverResults$ = this.discoverResultsSubject.asObservable();

  private discoverKeywordsSubject = new BehaviorSubject<string>('');
  discoverByKeywordsResults$ = this.discoverKeywordsSubject.asObservable();

  public queryKeywords: string = '';
  public movieLink: string = '';

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

  // 用户登出
  logout(): void {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('access_token');
    this.router.navigate(['/login']);
  }

  get currentPage(): number {
    return this._currentPage;
  }

  set currentPage(page: number) {
    this._currentPage = page;
  }

  get discoverType(): number {
    return this._discoverType;
  }

  set discoverType(page: number) {
    this._discoverType = page;
  }

  async search(
    query: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<any> {
    const url = `${this.apiUrl}/prowlarr/search?query=${query}&page=${page}&page_size=${pageSize}`;

    const accessToken = localStorage.getItem('access_token');

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          this.logout();
        }
        throw new Error('请求失败');
      }

      const data = await response.json();
      this.searchResultsSubject.next(data);
      return data;
    } catch (error) {
      console.error('请求失败:', error);
      throw new Error('请求失败，请稍后再试');
    }
  }

  async discoverByActress(filter_value: string, page: number): Promise<any> {
    this.discoverType = 2;
    const url = `${this.apiUrl}/avbase/actress/movies?name=${filter_value}&page=${page}`;

    const accessToken = localStorage.getItem('access_token');

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          this.logout();
        }
        throw new Error('请求失败');
      }

      const data = await response.json();
      this.discoverResultsSubject.next(data.movies);
      this.discoverKeywordsSubject.next(filter_value);
      return data;
    } catch (error) {
      console.error('请求失败:', error);
      throw new Error('请求失败，请稍后再试');
    }
  }

  async getActressInformation(name: string): Promise<any> {
    const url = `${this.apiUrl}/avbase/actress/information?name=${name}`;

    const accessToken = localStorage.getItem('access_token');

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          this.logout();
        }
        throw new Error('请求失败');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('请求失败:', error);
      throw new Error('请求失败，请稍后再试');
    }
  }

  async discoverByKeywords(filter_value: string, page: number): Promise<any> {
    this.discoverType = 1;
    const url = `${this.apiUrl}/avbase/keywords?keywords=${filter_value}&page=${page}`;

    const accessToken = localStorage.getItem('access_token');

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          this.logout();
        }
        throw new Error('请求失败');
      }

      const data = await response.json();
      this.discoverResultsSubject.next(data.movies);
      this.discoverKeywordsSubject.next(filter_value);
      return data;
    } catch (error) {
      console.error('请求失败:', error);
      throw new Error('请求失败，请稍后再试');
    }
  }

  async singleMovieInformation(movie_url: string): Promise<any> {
    this.discoverType = 1;
    const url = `${this.apiUrl}/avbase/movie/Information?url=${movie_url}`;

    const accessToken = localStorage.getItem('access_token');

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          this.logout();
        }
        throw new Error('请求失败');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('请求失败:', error);
      throw new Error('请求失败，请稍后再试');
    }
  }

  async pushTorrent(
    keywords: string,
    movieLink: string,
    downloadLink: string,
    savePath: string,
    tags: string = ''
  ): Promise<any> {
    const url = `${this.apiUrl}/downloader/add_torrent_url`;

    const params = new URLSearchParams();
    params.set('keywords', keywords);
    params.set('movie_link', movieLink);
    params.set('download_link', downloadLink);
    params.set('save_path', savePath);
    if (tags) {
      params.set('tags', tags);
    }

    const fullUrl = `${url}?${params.toString()}`;

    const accessToken = localStorage.getItem('access_token');

    try {
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          this.logout();
        }
        throw new Error('添加种子失败');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('请求失败:', error);
      throw new Error('请求失败，请稍后再试');
    }
  }

  async addKeywordsRSS(
    keyword: string,
    img: string,
    link: string
  ): Promise<any> {
    const url = `${this.apiUrl}/feed/addKeywords`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          keyword: keyword,
          img: img,
          link: link,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error adding RSS feed');
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error('Error occurred while adding RSS feed:', error);
      throw error;
    }
  }

  async removeKeywordsRSS(keyword: string): Promise<any> {
    const url = `${this.apiUrl}/feed/delKeywords`;

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          keyword: keyword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error removing RSS feed');
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error('Error occurred while removing RSS feed:', error);
      throw error;
    }
  }

  async getKeywordsRSS(): Promise<any> {
    const url = `${this.apiUrl}/feed/getKeywordsFeedList`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching keywords:', error);
      throw error;
    }
  }

  async getActressFeed(): Promise<any> {
    const url = `${this.apiUrl}/feed/getFeedsList`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching keywords:', error);
      throw error;
    }
  }

    async getActressCollect(): Promise<any> {
    const url = `${this.apiUrl}/feed/getCollectList`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching keywords:', error);
      throw error;
    }
  }

  async addFeedsRSS(
    url: string,
    title: string,
    description: string = ''
  ): Promise<any> {
    const addFeedsUrl = `${this.apiUrl}/feed/addFeeds`;

    try {
      const response = await fetch(addFeedsUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          url: url,
          title: title,
          description: description,
        }),
      });

      return response;
    } catch (error) {
      console.error('Error occurred while adding RSS feed:', error);
      throw error;
    }
  }

    async addActressCollect(
    url: string,
    title: string,
  ): Promise<any> {
    const addFeedsUrl = `${this.apiUrl}/feed/addActressCollect`;

    try {
      const response = await fetch(addFeedsUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          avatar_url: url,
          name: title
        }),
      });

      return response;
    } catch (error) {
      console.error('Error occurred while adding RSS feed:', error);
      throw error;
    }
  }

  async removeFeedsRSS(url: string): Promise<any> {
    const urlToDelete = `${this.apiUrl}/feed/delFeeds`;

    try {
      const response = await fetch(urlToDelete, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          url: url,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error removing RSS feed');
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error('Error occurred while removing RSS feed:', error);
      throw error;
    }
  }

    async removeActressCollect(url: string): Promise<any> {
    const urlToDelete = `${this.apiUrl}/feed/delActressCollect`;

    try {
      const response = await fetch(urlToDelete, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          url: url,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error removing RSS feed');
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error('Error occurred while removing RSS feed:', error);
      throw error;
    }
  }

  async getKeywordFeeds() {
    const url = `${this.apiUrl}/feed/getKeywordsFeedList`;
    try {
      const response = await fetch(url, {
        method: 'GET', 
        headers: {
          'Content-Type': 'application/json', 
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }

      const data: KeywordFeed[] = await response.json(); 
      return data
    } catch (error) {
      console.error('Error fetching keyword feeds:', error);
      throw error;
    }
  }
  
}
