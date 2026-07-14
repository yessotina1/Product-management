import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, PaginatedResponse } from '../models';

export interface ProductFilters {
  search?: string;
  category_id?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000/api/products';

  getProducts(filters: ProductFilters = {}): Observable<PaginatedResponse<Product>> {
    let params = new HttpParams();
    if (filters.search)      params = params.set('search', filters.search);
    if (filters.category_id) params = params.set('category_id', filters.category_id);
    if (filters.sort_by)     params = params.set('sort_by', filters.sort_by);
    if (filters.sort_order)  params = params.set('sort_order', filters.sort_order);
    if (filters.page)        params = params.set('page', filters.page);
    if (filters.per_page)    params = params.set('per_page', filters.per_page);
    return this.http.get<PaginatedResponse<Product>>(this.apiUrl, { params });
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  createProduct(product: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
