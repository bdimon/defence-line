import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { WpCategory, WpComment, WpPost } from '../types';

export interface SiteInfo {
  name: string;
  url: string;
  /**
   * true — для сайтов, у которых отключены "красивые" постоянные ссылки
   * и wp-json недоступен по обычному пути /wp-json/wp/v2/....
   * В этом случае API доступен только через:
   *   {origin}/index.php?rest_route=/wp/v2/{endpoint}
   * (пример: defence-line.info). url при этом всё равно указывается
   * в привычном виде 'https://origin/wp-json/wp/v2' — реальный запрос
   * строится автоматически в buildEndpoint().
   */
  useRestRoute?: boolean;
}

@Injectable({ providedIn: 'root' })

export class WpService {
  private categories: WpCategory[] = [];

  private readonly sites: SiteInfo[] = [
    { name: 'Лінія Оборони', url: 'https://defence-line.info/wp-json/wp/v2', useRestRoute: true },
    { name: 'Defence News', url: 'https://dl-news.defence-line.org/wp-json/wp/v2', useRestRoute: true },
    { name: 'Олег Пономарь', url: 'https://ponomaroleg.com/wp-json/wp/v2' },
    { name: 'Тверезо', url: 'https://tverezo.info/wp-json/wp/v2' },
    { name: 'Факты', url: 'https://fakty.com.ua/wp-json/wp/v2' },
    { name: 'Український Тиждень', url: 'https://tyzhden.ua/wp-json/wp/v2' },
    { name: 'НБН', url: 'https://nbnews.com.ua/wp-json/wp/v2' },
    { name: 'МИГ', url: 'https://mig.com.ua/wp-json/wp/v2' },
    { name: 'Днепр Час', url: 'https://dpchas.com.ua/wp-json/wp/v2' },
    { name: 'MediaPort', url: 'https://mediaport.ua/wp-json/wp/v2' },
    { name: 'Главное', url: 'https://glavnoe.in.ua/wp-json/wp/v2' },
  ];
  public activeSiteIndex = 0;

  constructor(private http: HttpClient) {}

  // Получить текущий сайт
  private getActiveSite(): SiteInfo {
    return this.sites[this.activeSiteIndex] || this.sites[0];
  }

  /**
   * Строит URL и (при необходимости) дополнительные query-параметры
   * для конкретного эндпоинта ('/posts', '/posts/123', '/categories', ...),
   * учитывая, нужен ли сайту режим rest_route.
   */
  private buildEndpoint(endpoint: string): { url: string; extraParams?: HttpParams } {
    const site = this.getActiveSite();
    const raw = site.url.replace(/\/+$/, '');

    if (site.useRestRoute) {
      // raw имеет вид 'https://defence-line.info/wp-json/wp/v2'
      // нужно получить origin отдельно и "логический" путь без /wp-json
      const originMatch = raw.match(/^(https?:\/\/[^/]+)/);
      const origin = originMatch ? originMatch[1] : raw;
      const restPath = raw.replace(origin, '').replace(/^\/wp-json/, '') || '/wp/v2';

      return {
        url: `${origin}/index.php`,
        extraParams: new HttpParams().set('rest_route', `${restPath}${endpoint}`),
      };
    }

    return { url: `${raw}${endpoint}` };
  }

  /** Объединяет обычные HttpParams с extraParams из buildEndpoint(). */
  private mergeParams(params: HttpParams, extra?: HttpParams): HttpParams {
    if (!extra) return params;
    let merged = params;
    extra.keys().forEach((key) => {
      merged = merged.set(key, extra.get(key) as string);
    });
    return merged;
  }

  private static sanitizeSearchQuery(search?: string): string | undefined {
    const cleaned = search?.trim().replace(/[<>]/g, '');
    return cleaned ? cleaned : undefined;
  }

  private createBaseParams(page: number, perPage: number): HttpParams {
    return new HttpParams()
      .set('page', String(page))
      .set('per_page', String(perPage))
      .set('_embed', '1');
  }

  private createPostsParams(
    page: number,
    perPage: number,
    category?: number,
    search?: string,
    orderby?: string,
    order: string = 'desc'
  ): HttpParams {
    let params = this.createBaseParams(page, perPage);

    if (category && category > 0) params = params.set('categories', String(category));

    const sanitizedSearch = WpService.sanitizeSearchQuery(search);
    if (sanitizedSearch) params = params.set('search', sanitizedSearch);
    if (orderby) params = params.set('orderby', orderby || '');
    if (order) params = params.set('order', order);

    return params;
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
    const { url, extraParams } = this.buildEndpoint('/categories');
    const params = this.mergeParams(new HttpParams(), extraParams);

    return this.http.get<WpCategory[]>(url, { params }).pipe(
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
    const { url, extraParams } = this.buildEndpoint('/posts');
    const params = this.mergeParams(
      this.createPostsParams(page, perPage, category, search, orderby, order),
      extraParams
    );

    return this.http.get<WpPost[]>(url, { params }).pipe(
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
    const paramSet = this.createPostsParams(page, perPage, category, search);
    const { url, extraParams } = this.buildEndpoint('/posts');
    const params = this.mergeParams(paramSet, extraParams);

    return this.http
      .get<WpPost[]>(url, { params, observe: 'response' })
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
    const { url, extraParams } = this.buildEndpoint(`/posts/${id}`);
    const params = this.mergeParams(new HttpParams().set('_embed', '1'), extraParams);

    return this.http
      .get<WpPost>(url, { params })
      .pipe(
        catchError((err) => {
          console.error('Wp Error getPost:', err);
          return of(null);
        })
      );
  }

  getComments(postId: number, page: number = 1): Observable<WpComment[]> {
    let params = new HttpParams()
      .set('_embed', '1')
      .set('page', page.toString())
      .set('post', postId.toString());

    const { url, extraParams } = this.buildEndpoint('/comments');
    params = this.mergeParams(params, extraParams);

    return this.http.get<WpComment[]>(url, { params }).pipe(
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