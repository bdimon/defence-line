import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { WpService } from '../services/wp.service';
// import { IonicModule } from '@ionic/angular';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonIcon, IonContent, IonItem, IonLabel, IonSelect, IonSelectOption, IonRefresher, IonRefresherContent, IonCard, IonCardContent, IonCardTitle, IonRow, IonBadge, IonSpinner, IonInfiniteScroll, IonInfiniteScrollContent, IonSearchbar } from '@ionic/angular/standalone';
import { HighlightPipe } from '../pipes/highlight.pipe'; // Импортируем наш новый пайп



@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonIcon,
    IonContent, IonItem, IonLabel, IonSelect, IonSelectOption, IonRefresher, IonRefresherContent,
    IonCard, IonCardContent, IonCardTitle, IonRow, IonBadge, IonSpinner,
    IonInfiniteScroll, IonInfiniteScrollContent,
    NgFor, NgIf,
    IonSelect,
    IonSelectOption,
    IonSearchbar,
    FormsModule,
    DatePipe,
    HighlightPipe // Добавляем HighlightPipe в массив imports
    
  ],
})
export class HomeComponent implements OnInit {
  items: any[] = [];
  page = 1;
  isLoading = false;
  category_id = 0;
  sort = '0';
  hasMore = true;
  searchTerm: string = '';


  constructor(
    private wp: WpService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Загрузка категорий при инициализации
    this.wp.loadCategories().subscribe();
    // Чтение параметра категории из URL, если нужно
    this.route.queryParams.subscribe(params => {
      this.category_id = params['cat_id'] ? +params['cat_id'] : 0;
      this.resetAndLoad();
    });
  }

  resetAndLoad(event?: any) {
    this.items = [];
    this.page = 1;
    this.hasMore = true;
    this.getPosts(event);
  }

  getPosts(event?: any) {
    //  console.log('getPosts called, page:', this.page, 'hasMore:', this.hasMore, 'isLoading:', this.isLoading);
    if (this.isLoading || !this.hasMore) {
      if (event) event.target.complete();
      return;
    }
    this.isLoading = true;
    let orderby = '';
    let order = 'desc';
    if(this.sort === '1') order = 'asc';
    if(this.sort === '2') { orderby = 'title'; order = 'asc'; }
    if(this.sort === '3') { orderby = 'title'; order = 'desc'; }
    
    this.wp.getPosts(this.page, this.category_id, this.searchTerm, orderby, order)
      .subscribe(
        (data: any[]) => {
          this.isLoading = false;
          if (this.page === 1) this.items = data;
          else this.items = [...this.items, ...data];
          if (data.length === 0 || data.length < 10) this.hasMore = false;
          else {this.page++;}
          if (event) event.target.complete();
        },
        () => {
          this.isLoading = false;
          if (event) event.target.complete();
          if (event) event.target.disabled = true;
        }
      );
  }

  changeSort() {
    this.resetAndLoad();
  }

  openDetail(item: any) {
    this.router.navigate(['/detail', item.id]);
  }

 handleSearch(event: any) {
  this.searchTerm = event.target.value.toLowerCase();
  // Сбрасываем список постов и пагинацию для нового поиска
  this.items = [];
  this.page = 1;
  this.hasMore = true;
  this.getPosts(); // Загружаем посты с учетом поискового запроса
}


  getCatName(catId: number): string {
    // console.log('Home', catId)
    return this.wp.getCatName(catId);
  }
}