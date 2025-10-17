import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { WpCategory, WpComment, WpPost } from '../types';

@Injectable({ providedIn: 'root' })
export class WpService {
  public categories: WpCategory[] = [];
  private sites = [
    'https://defence-line.org/wp-json/wp/v2',
    'https://ponomaroleg.com/wp-json/wp/v2',
    'https://tverezo.info/wp-json/wp/v2'
  ];
  public activeSiteIndex = 0; // default to first site

  constructor(private http: HttpClient) {}

  // Normalize API base URL (remove trailing slash if present)
  private getApiUrl(): string {
    const raw = this.sites[this.activeSiteIndex] || this.sites[0];
    return raw.replace(/\/+$/, '');
  }

  setActiveSite(index: number): void {
    if (index >= 0 && index < this.sites.length) {
      this.activeSiteIndex = index;
      this.categories = [];
      console.log('Wp Active site index updated to:', index);
      console.log('Wp Active site URL updated to:', this.sites[index]);
    } else {
      console.error('Invalid site index:', index);
    }
  }

  getAvailableSites(): string[] {
    return [...this.sites];
  }

  loadCategories(): Observable<WpCategory[]> {
    const headers = new HttpHeaders().set('Cache-Control', 'no-cache').set('Pragma', 'no-cache');
    if (this.categories.length) {
      return of(this.categories);
    }
    return this.http.get<WpCategory[]>(`${this.getApiUrl()}/categories`, { headers }).pipe(
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

  // Generic get helper
  get(query: string = '') {
    const base = this.getApiUrl();
    const path = query.startsWith('/') ? query : `/${query}`;
    return this.http.get(base + path);
  }

  // Simple posts request (only "posts" resource)
  getPosts(
    page = 1,
    category?: number,
    search?: string,
    orderby?: string,
    order: string = 'desc',
    perPage = 10
  ): Observable<WpPost[]> {
    const headers = new HttpHeaders().set('Cache-Control', 'no-cache').set('Pragma', 'no-cache');
    let params = new HttpParams()
      .set('page', String(page))
      .set('per_page', String(perPage))
      .set('_embed', '1');

    if (category && category > 0) params = params.set('categories', String(category));
    if (search) params = params.set('search', search.replace(/[<>]/g, ''));
    if (orderby) params = params.set('orderby', orderby || '');
    if (order) params = params.set('order', order);

    return this.http.get<WpPost[]>(`${this.getApiUrl()}/posts`, { params, headers }).pipe(
      catchError((err) => {
        console.error('Wp Error getPosts:', err);
        return of([] as WpPost[]);
      })
    );
  }

  // getPosts with meta (pagination headers)
  getPostsWithMeta(
    page = 1,
    perPage = 10,
    category?: number,
    search?: string
  ): Observable<{ posts: WpPost[]; total?: number; totalPages?: number }> {
    const headers = new HttpHeaders().set('Cache-Control', 'no-cache').set('Pragma', 'no-cache');
    let params = new HttpParams()
      .set('page', String(page))
      .set('per_page', String(perPage))
      .set('_embed', '1');

    if (category && category > 0) params = params.set('categories', String(category));
    if (search) params = params.set('search', search.replace(/[<>]/g, ''));

    return this.http.get<WpPost[]>(`${this.getApiUrl()}/posts`, { params, headers, observe: 'response' }).pipe(
      map((resp: HttpResponse<WpPost[]>) => {
        const total = resp.headers.get('X-WP-Total');
        const totalPages = resp.headers.get('X-WP-TotalPages');
        return {
          posts: resp.body || [],
          total: total ? Number(total) : undefined,
          totalPages: totalPages ? Number(totalPages) : undefined
        };
      }),
      catchError((err) => {
        console.error('Wp Error getPostsWithMeta:', err);
        return of({ posts: [], total: 0, totalPages: 0 });
      })
    );
  }

  getPost(id: number): Observable<WpPost | null> {
    const headers = new HttpHeaders().set('Cache-Control', 'no-cache').set('Pragma', 'no-cache');
    return this.http.get<WpPost>(`${this.getApiUrl()}/posts/${id}`, { params: new HttpParams().set('_embed','1'), headers }).pipe(
      catchError((err) => {
        console.error('Wp Error getPost:', err);
        return of(null);
      })
    );
  }

  getComments(postId: number, page: number = 1): Observable<WpComment[]> {
    const headers = new HttpHeaders().set('Cache-Control', 'no-cache').set('Pragma', 'no-cache');
    const params = new HttpParams()
      .set('_embed', '1')
      .set('page', page.toString())
      .set('post', postId.toString());
    return this.http.get<WpComment[]>(`${this.getApiUrl()}/comments`, { params, headers }).pipe(
      catchError((err) => {
        console.error('Wp Error getComments:', err);
        return of([] as WpComment[]);
      })
    );
  }

  // Thumbnail helper
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
