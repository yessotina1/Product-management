import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category, PaginatedResponse } from '../models';

export interface CategoryFilters {
  search?: string;
  sort_by?: 'name' | 'created_at';
  sort_order?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
}

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000/api/categories';

  getCategories(filters: CategoryFilters = {}): Observable<PaginatedResponse<Category>> {
    let params = new HttpParams();
    if (filters.search) params = params.set('search', filters.search);
    if (filters.sort_by) params = params.set('sort_by', filters.sort_by);
    if (filters.sort_order) params = params.set('sort_order', filters.sort_order);
    if (filters.page) params = params.set('page', filters.page);
    if (filters.per_page) params = params.set('per_page', filters.per_page);
    return this.http.get<PaginatedResponse<Category>>(this.apiUrl, { params });
  }

  getCategoryOptions(): Observable<PaginatedResponse<Category>> {
    return this.getCategories({ sort_by: 'name', sort_order: 'asc', per_page: 1000 });
  }

  getCategory(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`);
  }

  createCategory(category: Partial<Category>): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category);
  }

  updateCategory(id: number, category: Partial<Category>): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${id}`, category);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
