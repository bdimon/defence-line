import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { WpCategory, WpComment, WpPost } from '../types';

@Injectable({ providedIn: 'root' })
export class WpService {
  public categories: WpCategory[] = [];
  private API_URL = 'https://defence-line.org/wp-json/wp/v2';

  constructor(private http: HttpClient) {}

  // Загрузка всех категорий (можно вызвать при инициализации)
  loadCategories(): Observable<WpCategory[]> {
    if (this.categories.length) {
      return of(this.categories);
    }
    return this.http.get<WpCategory[]>(`${this.API_URL}/categories`).pipe(
      map((cats: WpCategory[]) => {
        // Если с сервера пришёл не пустой массив — кэшируем
        if (Array.isArray(cats) && cats.length > 0) {
          this.categories = cats;
        } else {
          // Если массив пустой — НЕ кэшируем, чтобы не использовать его потом
          console.warn('Категории не загружены или пусты');
        }
        return cats;
      })
    );
  }

  // Вернуть имя категории по id (или пустую строку)
  getCatName(id: number): string {
    if (!this.categories.length) return ''; // Нет категорий — возвращаем пусто
    const cat = this.categories.find((c) => c.id === id);
    // console.log('WpService', cat?.id, '=>', cat?.name);
    return cat ? cat.name : '';
  }

  get(query: string = '') {
    return this.http.get(this.API_URL + query);
  }

  // Получить список постов
  getPosts(
    page = 1,
    category?: number,
    search?: string,
    orderby?: string,
    order: string = 'desc'
  ): Observable<WpPost[]> {
    let params = new HttpParams()
    .set('page', page.toString())
    .set('per_page', '10')
    .set('_embed', true)
    if (category) params = params.set('categories', category.toString());
    if (search) params = params.set('search', search);
    if (orderby) params = params.set('orderby', orderby);
    if (order) params = params.set('order', order);
    // params = params.set('_embed', '');
    return this.http.get<WpPost[]>(`${this.API_URL}/posts?_embed`, { params });
  }

  // Получить один пост по id
  getPost(id: number): Observable<WpPost> {
    return this.http.get<WpPost>(`${this.API_URL}/posts/${id}?_embed`);
  }

  getComments(postId: number, page: number = 1): Observable<WpComment[]> {
  const params = new HttpParams()
    .set('_embed', '')
    .set('page', page.toString())
    .set('post', postId.toString());
  return this.http.get<WpComment[]>(`${this.API_URL}/comments`, { params });
}
}
