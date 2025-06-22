import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { WpService } from '../services/wp.service';
// import { IonicModule } from '@ionic/angular';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicElementsModule } from '../modules/ionic-elements.module'; // Import the consolidated module
import { HighlightPipe } from '../pipes/highlight.pipe'; // Импортируем наш новый пайп
import { WpPost } from '../types';
import { CategoryColorPipe } from '../pipes/category-color.pipe';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonicElementsModule,
    NgFor,
    NgIf,
    FormsModule,
    DatePipe,
    HighlightPipe, // Добавляем HighlightPipe в массив imports
    RouterLink,
    CategoryColorPipe,
  ],
})
export class HomeComponent implements OnInit {
  items: WpPost[] = [];
  page = 1;
  isLoading = false;
  category_id = 0;
  sort = '0';
  hasMore = true;
  searchTerm: string = '';

  constructor(private wp: WpService, private route: ActivatedRoute) {}

  ngOnInit() {
    // Remove redundant category loading
    this.route.queryParams.subscribe((params) => {
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

    this.wp.getPosts(this.page, this.category_id, this.searchTerm, orderby, order).subscribe(
      (data: WpPost[]) => {
        // Handle "All" category (category_id === 0)
        const filteredData =
          this.category_id === 0
            ? data // Include all posts for "All" category
            : data.filter((post) => post.categories && post.categories.includes(this.category_id));

        // Process filtered posts
        const processedData = filteredData.map((post) => {
          const primaryCategoryId =
            post.categories && post.categories.length > 0
              ? post.categories[0] // Use the first category as primary
              : 0;
          return { ...post, categoryName: this.wp.getCatName(primaryCategoryId) };
        });

        this.isLoading = false;
        if (this.page === 1) this.items = processedData;
        else this.items = [...this.items, ...processedData];
        if (processedData.length === 0 || processedData.length < 10) this.hasMore = false;
        else {
          this.page++;
        }
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

  // openDetail(item: WpPost) {
  //   this.router.navigate(['/detail', item.id], { queryParams: { searchTerm: this.searchTerm } });
  // }

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
