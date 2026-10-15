import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonicElementsModule } from '../modules/ionic-elements.module'; // Import the consolidated module
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { WpService } from '../services/wp.service';
import { HighlightPipe } from '../pipes/highlight.pipe'; // Импортируем наш новый пайп
import { SafeHtmlPipe } from '../pipes/safe-html.pipe'; // Импортируем новый пайп
import { WpPost, WpComment } from '../types';
import { CategoryColorPipe } from '../pipes/category-color.pipe';



@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
  standalone: true,
  imports: [
    IonicElementsModule,
    NgFor,
    NgIf,
    DatePipe,
    HighlightPipe,
    SafeHtmlPipe, // Добавляем в imports
    CategoryColorPipe
  ],

  providers: [DatePipe]
})
export class DetailPage implements OnInit {
  post: WpPost | null = null;
  mainImageUrl: string | null = null;
  contentHtml = '';
  comments: WpComment[] = [];
  isLoading = false;
  page = 1;
  id: number | null = null;
  public showMore: boolean = true; // При первой загрузке true
  searchTerm: string = '';


  constructor(private route: ActivatedRoute, public api: WpService) {

  }

  ngOnInit() {
    const param = this.route.snapshot.paramMap.get('id');
    const id = param !== null ? Number(param) : null;

    if (id !== null && !isNaN(id)) {
      this.id = id;
      this.api.getPost(id).subscribe(post => {
        this.post = post;
        this.preparePostImages(post);
        // После загрузки поста — сбросить комментарии и загрузить первую страницу
        this.page = 1;
        this.comments = [];
        this.showMore = true;
        this.getComments();
      });
      this.searchTerm = this.route.snapshot.queryParams['searchTerm'] || '';
    } else {
      // id некорректный
      console.error('Некорректный id:', id);
    }
  }

  private preparePostImages(post: WpPost | null): void {
    const rendered = post?.content?.rendered || '';
    const firstImage = rendered.match(
      /<figure\b[^>]*>\s*<img\b[^>]*src=["']([^"']+)["'][^>]*>\s*<\/figure>/i
    ) || rendered.match(/<img\b[^>]*src=["']([^"']+)["'][^>]*>/i);
    const featuredMedia = post?._embedded?.['wp:featuredmedia']?.[0];
    const featuredUrl = featuredMedia?.source_url ||
      featuredMedia?.media_details?.sizes?.full?.source_url ||
      featuredMedia?.media_details?.sizes?.large?.source_url ||
      null;

    this.mainImageUrl = firstImage?.[1] || featuredUrl;
    this.contentHtml = firstImage ? rendered.replace(firstImage[0], '') : rendered;
  }

  getComments(event?: any) {
    if (this.isLoading || !this.showMore || !this.post) {
      if (event) event.target.complete();
      return;
    }
    this.isLoading = true;
    this.api.getComments(this.post.id, this.page).subscribe({
      next: (resp: WpComment[]) => {
        this.isLoading = false;

        if (this.page === 1) {
          this.comments = resp;
        } else {
          this.comments = [...this.comments, ...resp];
        }

        // Проверяем — есть ли еще комментарии
        if (!resp.length || resp.length < 10) {
          this.showMore = false;
        } else {
          this.page++;
        }

        if (event) event.target.complete();
      },
      error: () => {
        this.isLoading = false;
        if (event) event.target.complete();
        // Можно обработать ошибку (например, показать уведомление)
      }
    });
  }
}
