import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { WpCategory, WpComment, WpPost } from '../types';

export interface SiteInfo {
  name: string;
  url: string;
}

@Injectable({ providedIn: 'root' })

export class WpService {
  public categories: WpCategory[] = [];

  public sites: SiteInfo[] = [
    { name: 'Defense Line', url: 'https://defence-line.org/wp-json/wp/v2' },
    { name: 'Олег Пономарь', url: 'https://ponomaroleg.com/wp-json/wp/v2' },
    { name: 'Тверезо', url: 'https://tverezo.info/wp-json/wp/v2' },
    { name: 'Факты', url: 'https://fakty.com.ua/wp-json/wp/v2' },
    { name: 'Український Тиждень', url: 'https://tyzhden.ua/wp-json/wp/v2' },
    { name: 'НБН', url: 'https://nbnews.com.ua/wp-json/wp/v2' },
    { name: 'МИГ', url: 'https://mig.com.ua/wp-json/wp/v2' },
    { name: 'АрміяInform', url: 'https://armyinform.com.ua/wp-json/wp/v2' },
    { name: 'Днепр Час', url: 'https://dpchas.com.ua/wp-json/wp/v2' },
    { name: 'MediaPort', url: 'https://mediaport.ua/wp-json/wp/v2' },
    { name: 'Главное', url: 'https://glavnoe.in.ua/wp-json/wp/v2' },
  ];
  public activeSiteIndex = 0;

  constructor(private http: HttpClient) {}

  // Получить URL текущего сайта
  private getApiUrl(): string {
    const raw = this.sites[this.activeSiteIndex]?.url || this.sites[0].url;
    return raw.replace(/\/+$/, '');
  }

  // Получить ИМЯ текущего сайта
  getActiveSiteName(): string {
    return this.sites[this.activeSiteIndex]?.name || 'Новости';
  }

  // Получить весь список сайтов
  getAvailableSites(): SiteInfo[] {
    return [...this.sites];
  }

  setActiveSite(index: number): void {
    if (index >= 0 && index < this.sites.length) {
      this.activeSiteIndex = index;
      this.categories = [];
    }
  }


  loadCategories(): Observable<WpCategory[]> {
    if (this.categories.length) {
      return of(this.categories);
    }
    return this.http.get<WpCategory[]>(`${this.getApiUrl()}/categories`).pipe(
      map((cats) => {
        if (Array.isArray(cats) && cats.length > 0) {
          this.categories = cats;
        }
        return cats;
      }),
      catchError((error) => {
        console.error('Wp Error loading categories:', error);
        return of([] as WpCategory[]);
      })
    );
  }

  getCatName(id: number): string {
    if (!this.categories.length) return '';
    const cat = this.categories.find((c) => c.id === id);
    return cat ? cat.name : '';
  }

  getPosts(
    page = 1,
    category?: number,
    search?: string,
    orderby?: string,
    order: string = 'desc',
    perPage = 10
  ): Observable<WpPost[]> {
    let params = new HttpParams()
      .set('page', String(page))
      .set('per_page', String(perPage))
      .set('_embed', '1');

    if (category && category > 0) params = params.set('categories', String(category));
    if (search) params = params.set('search', search.replace(/[<>]/g, ''));
    if (orderby) params = params.set('orderby', orderby || '');
    if (order) params = params.set('order', order);

    return this.http.get<WpPost[]>(`${this.getApiUrl()}/posts`, { params }).pipe(
      catchError((err) => {
        console.error('Wp Error getPosts:', err);
        return of([] as WpPost[]);
      })
    );
  }

  getPostsWithMeta(
    page = 1,
    perPage = 10,
    category?: number,
    search?: string
  ): Observable<{ posts: WpPost[]; total?: number; totalPages?: number }> {
    let params = new HttpParams()
      .set('page', String(page))
      .set('per_page', String(perPage))
      .set('_embed', '1');

    if (category && category > 0) params = params.set('categories', String(category));
    if (search) params = params.set('search', search.replace(/[<>]/g, ''));

    return this.http
      .get<WpPost[]>(`${this.getApiUrl()}/posts`, { params, observe: 'response' })
      .pipe(
        map((resp: HttpResponse<WpPost[]>) => {
          const total = resp.headers.get('X-WP-Total');
          const totalPages = resp.headers.get('X-WP-TotalPages');
          return {
            posts: resp.body || [],
            total: total ? Number(total) : undefined,
            totalPages: totalPages ? Number(totalPages) : undefined,
          };
        }),
        catchError((err) => {
          console.error('Wp Error getPostsWithMeta:', err);
          return of({ posts: [], total: 0, totalPages: 0 });
        })
      );
  }

  getPost(id: number): Observable<WpPost | null> {
    return this.http
      .get<WpPost>(`${this.getApiUrl()}/posts/${id}`, {
        params: new HttpParams().set('_embed', '1'),
      })
      .pipe(
        catchError((err) => {
          console.error('Wp Error getPost:', err);
          return of(null);
        })
      );
  }

  getComments(postId: number, page: number = 1): Observable<WpComment[]> {
    const params = new HttpParams()
      .set('_embed', '1')
      .set('page', page.toString())
      .set('post', postId.toString());
    return this.http.get<WpComment[]>(`${this.getApiUrl()}/comments`, { params }).pipe(
      catchError((err) => {
        console.error('Wp Error getComments:', err);
        return of([] as WpComment[]);
      })
    );
  }

  static getThumbnailUrl(post: WpPost): string | null {
    try {
      const media = post._embedded?.['wp:featuredmedia']?.[0];
      if (!media) return null;

      const preferred = ['content-list', 'thumbnail', 'medium', 'medium_large', 'large', 'full'];
      const sizes = media.media_details?.sizes;
      if (sizes && typeof sizes === 'object') {
        for (const key of preferred) {
          if (sizes[key]?.source_url) return sizes[key].source_url;
        }
        const firstSizeKey = Object.keys(sizes).find((k) => sizes[k]?.source_url);
        if (firstSizeKey) return sizes[firstSizeKey].source_url;
      }
      if (media.source_url) return media.source_url;
      return null;
    } catch {
      return null;
    }
  }
}