import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { WpCategory, WpComment, WpPost } from '../types';

@Injectable({ providedIn: 'root' })
export class WpService {
  public categories: WpCategory[] = [];
  private sites = [
    'https://defence-line.org/wp-json/wp/v2',
    'https://ponomaroleg.com/wp-json/wp/v2',
  ]; // Add multiple site URLs
  public activeSiteIndex = 0; // Default to the first site

  constructor(private http: HttpClient) {}

  // Method to get the current site URL
  private getApiUrl(): string {
    const url = this.sites[this.activeSiteIndex];
    console.log('Wp Current API URL:', url); // Log the current API URL
    return url;
  }

  // Method to switch the active site
  setActiveSite(index: number): void {
    if (index >= 0 && index < this.sites.length) {
      this.activeSiteIndex = index;
      this.categories = [];
      console.log('Wp Active site index updated to:', index); // Log the active site index
      console.log('Wp Active site URL updated to:', this.sites[index]); // Log the active site URL
      
    } else {
      console.error('Invalid site index:', index);
    }
  }

  // Method to list all available sites
  getAvailableSites(): string[] {
    return this.sites;
  }

  // Load categories from the active site
  loadCategories(): Observable<WpCategory[]> {
    console.log('Wp Loading categories from:', this.getApiUrl()); // Log the site URL used for loading categories
    const headers = new HttpHeaders().set('Cache-Control', 'no-cache').set('Pragma', 'no-cache'); // Disable caching
    if (this.categories.length) {
      return of(this.categories);
    }
    return this.http.get<WpCategory[]>(`${this.getApiUrl()}/categories`, { headers }).pipe(
      map((cats: WpCategory[]) => {
        if (Array.isArray(cats) && cats.length > 0) {
          this.categories = cats;
          console.log('Wp Categories', cats);
        } else {
          console.warn('Wp Categories not loaded or empty');
        }
        return cats;
      }),
      // Add error handling
      catchError((error) => {
        console.error('Wp Error loading categories:', error);
        return of([]); // Return an empty array on error
      })
    );
  }

  // Вернуть имя категории по id (или пустую строку)
  getCatName(id: number): string {
    if (!this.categories.length) return ''; // Нет категорий — возвращаем пусто
    const cat = this.categories.find((c) => c.id === id);
    console.log('WpService', cat?.id, '=>', cat?.name);
    return cat ? cat.name : '';
  }

  get(query: string = '') {
    return this.http.get(this.getApiUrl() + query);
  }

  // Получить список постов
  getPosts(
    page = 1,
    category?: number,
    search?: string,
    orderby?: string,
    order: string = 'desc'
  ): Observable<WpPost[]> {
    const headers = new HttpHeaders().set('Cache-Control', 'no-cache').set('Pragma', 'no-cache'); // Disable caching
    let params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', '10')
      .set('_embed', true)
      .set('fields', 'id,title,content,date,categories,_embedded'); // Limit fields to necessary data

    if (category && category > 0) {
      params = params.set('categories', category.toString()); // Ensure category filtering is applied
    }
    if (search) {
      params = params.set('search', search.replace(/[<>]/g, '')); // Sanitize search input
    }
    if (orderby) {
      params = params.set('orderby', orderby);
    }
    if (order) {
      params = params.set('order', order);
    }

    return this.http.get<WpPost[]>(`${this.getApiUrl()}/posts?_embed`, { params, headers });
  }

  // Получить один пост по id
  getPost(id: number): Observable<WpPost> {
    const headers = new HttpHeaders().set('Cache-Control', 'no-cache').set('Pragma', 'no-cache'); // Disable caching
    return this.http.get<WpPost>(`${this.getApiUrl()}/posts/${id}?_embed`, { headers });
  }

  getComments(postId: number, page: number = 1): Observable<WpComment[]> {
    const headers = new HttpHeaders().set('Cache-Control', 'no-cache').set('Pragma', 'no-cache'); // Disable caching
    const params = new HttpParams()
      .set('_embed', '')
      .set('page', page.toString())
      .set('post', postId.toString())
      .set('fields', 'id,author_name,date,content,author_avatar_urls'); // Limit fields to necessary data
    return this.http.get<WpComment[]>(`${this.getApiUrl()}/comments`, { params, headers });
  }
}
