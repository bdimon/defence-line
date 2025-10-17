import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { WpService } from '../services/wp.service';
import { HighlightPipe } from '../pipes/highlight.pipe';
import { CategoryColorPipe } from '../pipes/category-color.pipe';
import { IonicElementsModule } from '../modules/ionic-elements.module';
import { WpPost } from '../types';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonicElementsModule,
    CommonModule,
    FormsModule,
    RouterModule,
    HighlightPipe,
    CategoryColorPipe,
  ],
})
export class HomeComponent implements OnInit {
  items: WpPost[] = [];
  page = 1;
  perPage = 10;
  isLoading = false;
  category_id = 0;
  sort = '0';
  hasMore = true;
  searchTerm = '';
  pageTitle = 'Останні повідомлення';

  constructor(public wp: WpService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.category_id = params['cat_id'] ? +params['cat_id'] : 0;
      this.updateTitle();
      this.resetAndLoad();
    });
  }

  updateTitle() {
    const siteNames = ['Defence Line', 'Ponomar Oleg', 'Tverezo Info'];
    this.pageTitle = siteNames[this.wp.activeSiteIndex] || 'Останні повідомлення';
  }

  resetAndLoad(event?: any) {
    this.items = [];
    this.page = 1;
    this.hasMore = true;
    this.getPosts(event);
  }

  getPosts(event?: any) {
    if (this.isLoading || !this.hasMore) {
      if (event) event.target.complete();
      return;
    }

    this.isLoading = true;

    let orderby = '';
    let order = 'desc';
    if (this.sort === '1') order = 'asc';
    if (this.sort === '2') {
      orderby = 'title';
      order = 'asc';
    }
    if (this.sort === '3') {
      orderby = 'title';
      order = 'desc';
    }

    this.wp.getPosts(this.page, this.category_id, this.searchTerm, orderby, order, this.perPage).subscribe(
      (data: WpPost[]) => {
        const filteredData =
          this.category_id === 0
            ? data
            : data.filter((post) => post.categories && post.categories.includes(this.category_id));

        const processedData = filteredData.map((post) => {
          const primaryCategoryId = post.categories && post.categories.length > 0 ? post.categories[0] : 0;
          return { ...post, categoryName: this.wp.getCatName(primaryCategoryId) } as WpPost & { categoryName?: string; _thumb?: string };
        });

        // assign thumbnail once (prevents template timing issues)
        processedData.forEach(p => {
          (p as any)._thumb = (WpService.getThumbnailUrl as any)(p) || 'assets/placeholder.png';
        });

        console.log('post._thumb values:', processedData.map(p => (p as any)._thumb));

        if (this.page === 1) this.items = processedData;
        else this.items = [...this.items, ...processedData];

        if (processedData.length === 0 || processedData.length < this.perPage) {
          this.hasMore = false;
        } else {
          this.page++;
        }

        this.isLoading = false;
        if (event) event.target.complete();
      },
      (err) => {
        console.error('Error loading posts', err);
        this.isLoading = false;
        if (event) {
          event.target.complete();
          event.target.disabled = true;
        }
      }
    );
  }

  changeSort() {
    this.resetAndLoad();
  }

  handleSearch(event: any) {
    this.searchTerm = (event?.detail?.value || '').toString().trim().toLowerCase();
    this.resetAndLoad();
  }

  getCatName(catId: number): string {
    return this.wp.getCatName(catId);
  }

  // Возвращаем числовой id основной категории — всегда number, никогда undefined
  getPrimaryCategoryId(post: WpPost): number {
    const id = post?.categories && post.categories.length > 0 ? post.categories[0] : 0;
    return Number(id || 0);
  }

  // wrapper to use the static helper from WpService safely in template
  getThumbnailUrl(post: WpPost): string | null {
    return (WpService.getThumbnailUrl as any)(post);
  }

  onImgError(event: Event) {
    const img = event.target as HTMLImageElement;
    if (!img) return;
    if (!img.src.includes('placeholder.png')) {
      img.src = 'assets/placeholder.png';
    }
  }

  trackById(index: number, item: WpPost) {
    return item.id;
  }
}
