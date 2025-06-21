import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonRow,
  IonBadge,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonItemDivider,
  IonList,
  IonAvatar,
  IonButtons,
  IonMenuButton
} from '@ionic/angular/standalone';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { WpService } from '../services/wp.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonRow,
    IonBadge,
    IonIcon,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonItemDivider,
    IonList,
    IonAvatar,
    IonButtons,
    IonMenuButton,
    NgFor,
    NgIf,
    DatePipe,
    // JsonPipe
  ],
  providers: [DatePipe]
})
export class DetailPage implements OnInit {
  post: any = {};
  comments: any[] = [];
  isLoading = false;
  page = 1;
  id: number | null = null;
  public showMore: boolean = true; // При первой загрузке true

  constructor(private route: ActivatedRoute, public api: WpService) {}

  ngOnInit() {
    const param = this.route.snapshot.paramMap.get('id');
    const id = param !== null ? Number(param) : null;

    if (id !== null && !isNaN(id)) {
      this.id = id;
      this.api.getPost(id).subscribe(post => {
        this.post = post;
        // После загрузки поста — сбросить комментарии и загрузить первую страницу
        this.page = 1;
        this.comments = [];
        this.showMore = true;
        this.getComments();
      });
    } else {
      // id некорректный
      console.error('Некорректный id:', id);
    }
  }

  getComments(event?: any) {
    if (this.isLoading || !this.showMore) {
      if (event) event.target.complete();
      return;
    }
    this.isLoading = true;
    this.api.getComments(this.post.id, this.page).subscribe({
      next: (resp: any[]) => {
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