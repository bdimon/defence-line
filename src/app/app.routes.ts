import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then(m => m.HomeComponent)
  },
  {
    path: 'detail/:id',
    loadComponent: () => import('./detail/detail.page').then( m => m.DetailPage)
  },
  /*{
    path: 'detail/:id',
    loadComponent: () => import('./detail/detail.page').then(m => m.DetailComponent)
  },
  {
    path: 'search',
    loadComponent: () => import('./search/search.page').then(m => m.SearchComponent)
  },*/
];