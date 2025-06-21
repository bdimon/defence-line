import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WpService } from './services/wp.service';
import { IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonRouterOutlet, MenuController } from '@ionic/angular/standalone'; // Добавляем MenuController
import { NgFor } from '@angular/common';

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
  categories: any[] = [];

  constructor(public api: WpService, private router: Router, private menuCtrl: MenuController) {} // Инжектируем MenuController

  ngOnInit() {
    this.api.loadCategories().subscribe(cats => {
      this.categories = cats;
    });
  }

  openCategory(cat_id: number) {
    this.router.navigate(['/home'], { queryParams: { cat_id } });
    // Программно закрываем меню после навигации
    this.menuCtrl.close();
  }
}