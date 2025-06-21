import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router'; // Добавляем NavigationEnd
import { WpService } from './services/wp.service';
import { IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonRouterOutlet, MenuController } from '@ionic/angular/standalone'; // Добавляем MenuController
import { NgFor } from '@angular/common';
import { filter } from 'rxjs/operators'; // Добавляем filter
import { WpCategory } from './types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  styleUrls: ['./app.component.scss'],
  imports: [
    IonMenu,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonRouterOutlet,
    // IonMenuToggle, // Убедимся, что IonMenuToggle здесь не импортируется, чтобы избежать предыдущей ошибки
    NgFor,
  ]
})
export class AppComponent implements OnInit {
  categories: WpCategory[] = [];
  selectedCategoryId: number = 0; // Инициализируем с 'Все' (ID 0)

  constructor(public api: WpService, private router: Router, private menuCtrl: MenuController) {} // Инжектируем MenuController

  ngOnInit() {
    this.api.loadCategories().subscribe(cats => {
      this.categories = cats;
      // Устанавливаем начальную выбранную категорию на основе текущего URL
      this.updateSelectedCategoryFromRoute();
    });

    // Слушаем события роутера, чтобы обновлять выбранную категорию при навигации
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateSelectedCategoryFromRoute();
    });
  }

  // Метод для обновления selectedCategoryId из параметров URL
  private updateSelectedCategoryFromRoute() {
    const currentRoute = this.router.routerState.snapshot.root;
    let catId = 0; // По умолчанию 'Все'
    if (currentRoute.queryParams['cat_id']) {
      catId = Number(currentRoute.queryParams['cat_id']);
    }
    this.selectedCategoryId = catId;
  }

  openCategory(cat_id: number) {
    this.router.navigate(['/home'], { queryParams: { cat_id } });
    // Программно закрываем меню после навигации
    this.menuCtrl.close();
  }
}