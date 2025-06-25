import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router'; // Добавляем NavigationEnd
import { WpService } from './services/wp.service';
import { IonicElementsModule } from '../app/modules/ionic-elements.module'; // Import the consolidated module
import {IonRouterOutlet, 
  MenuController } from '@ionic/angular/standalone'
import { NgFor } from '@angular/common';
import { filter } from 'rxjs/operators'; // Добавляем filter
import { WpCategory } from './types';
import { CategoryColorPipe } from './pipes/category-color.pipe'; // Import the pipe

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  styleUrls: ['./app.component.scss'],
  imports: [
    IonicElementsModule, // Use the consolidated module
    NgFor,
    IonRouterOutlet,
    CategoryColorPipe
  ],
})
export class AppComponent implements OnInit {
  categories: WpCategory[] = [];
  selectedCategoryId: number = 0; // Инициализируем с 'Все' (ID 0)

  constructor(public api: WpService, private router: Router, private menuCtrl: MenuController) {} // Инжектируем MenuController

  ngOnInit() {
    this.api.loadCategories().subscribe((cats) => {
      this.categories = cats;
      this.updateSelectedCategoryFromRoute();
    });

    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
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

  switchSite() {
    const availableSites = this.api.getAvailableSites();
    const currentIndex = this.api['activeSiteIndex']; // Get the current active site index
    const nextIndex = (currentIndex + 1) % availableSites.length;
    this.api.setActiveSite(nextIndex); // Update the active site in WpService
    this.router.navigate(['/'], { queryParams: { cat_id: 0 }, replaceUrl: true });

    console.log(`App Switched to site: ${availableSites[nextIndex]}`);

    // Reload categories explicitly
    this.api.loadCategories().subscribe({
      next: (cats) => {
        this.categories = cats;
        console.log('App Categories reloaded from:', availableSites[nextIndex]);
        this.router.navigate(['/home'], { queryParams: { cat_id: 0 }, replaceUrl: true });

      },
      error: (error) => {
        console.error('App Error reloading categories:', error);
        // this.router.navigate(['/home'], { queryParams: { cat_id: 0 }, replaceUrl: true });

      }
    });

    // Reload the current route to reflect the change
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([this.router.url]);
    });
    this.menuCtrl.close();
  }
}
