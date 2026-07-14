import { Routes } from '@angular/router';
import {authGuard} from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.Login)
  },
  {
    path: '',
    loadComponent: () => import('./layout/layout').then(m => m.Layout),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard)
      },
      {
        path: 'products',
        loadComponent: () => import('./pages/products/product-list/product-list').then(m => m.ProductList)
      },
      {
        path: 'products/new',
        loadComponent: () => import('./pages/products/product-form/product-form').then(m => m.ProductForm)
      },
      {
        path: 'products/:id/edit',
        loadComponent: () => import('./pages/products/product-form/product-form').then(m => m.ProductForm)
      },
      {
        path: 'categories',
        loadComponent: () => import('./pages/categories/category-list/category-list').then(m => m.CategoryList)
      },
      {
        path: 'categories/new',
        loadComponent: () => import('./pages/categories/category-form/category-form').then(m => m.CategoryForm)
      },
      {
        path: 'categories/:id/edit',
        loadComponent: () => import('./pages/categories/category-form/category-form').then(m => m.CategoryForm)
      },
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
