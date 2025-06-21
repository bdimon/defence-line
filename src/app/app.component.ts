import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WpService } from './services/wp.service';
import { IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonRouterOutlet } from '@ionic/angular/standalone';
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
    NgFor,
  ]
})
export class AppComponent implements OnInit {
  categories: any[] = [];

  constructor(public api: WpService, private router: Router) {}

  ngOnInit() {
    this.api.loadCategories().subscribe(cats => {
      this.categories = cats;
    });
  }

  openCategory(cat_id: number) {
    // Закрываем меню и переходим на страницу home с параметром cat_id
    this.router.navigate(['/home'], { queryParams: { cat_id } });
  }
}