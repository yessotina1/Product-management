import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule, MatFormFieldModule, MatInputModule,
    MatIconModule, MatButtonModule, MatProgressSpinnerModule, MatSnackBarModule, MatTooltipModule,
  ],
  templateUrl: './category-list.html',
  styleUrl: './category-list.scss'
})
export class CategoryList implements OnInit {
  private categoryService = inject(CategoryService);
  private snackBar = inject(MatSnackBar);
  private searchSubject = new Subject<string>();

  categories = signal<Category[]>([]);
  loading = signal(true);
  deleting = signal<number | null>(null);
  currentPage = signal(1);
  lastPage = signal(1);
  total = signal(0);
  perPage = 10;
  searchTerm = '';
  sortBy: 'name' | 'created_at' = 'created_at';
  sortOrder: 'asc' | 'desc' = 'desc';

  ngOnInit(): void {
    this.loadCategories();
    this.searchSubject.pipe(debounceTime(400), distinctUntilChanged()).subscribe(() => {
      this.currentPage.set(1);
      this.loadCategories();
    });
  }

  loadCategories(): void {
    this.loading.set(true);
    this.categoryService.getCategories({
      search: this.searchTerm || undefined,
      sort_by: this.sortBy,
      sort_order: this.sortOrder,
      page: this.currentPage(),
      per_page: this.perPage,
    }).subscribe({
      next: response => {
        this.categories.set(response.data);
        this.lastPage.set(response.last_page);
        this.total.set(response.total);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.snackBar.open('Impossible de charger les catégories', 'Fermer', { duration: 3000 });
      }
    });
  }

  onSearchChange(): void { this.searchSubject.next(this.searchTerm); }

  toggleSort(column: 'name' | 'created_at'): void {
    if (this.sortBy === column) this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    else {
      this.sortBy = column;
      this.sortOrder = 'desc';
    }
    this.loadCategories();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.lastPage()) return;
    this.currentPage.set(page);
    this.loadCategories();
  }

  get pages(): number[] { return Array.from({ length: this.lastPage() }, (_, index) => index + 1); }

  resetFilters(): void {
    this.searchTerm = '';
    this.sortBy = 'created_at';
    this.sortOrder = 'desc';
    this.currentPage.set(1);
    this.loadCategories();
  }

  confirmDelete(category: Category): void {
    if (!confirm(`Supprimer "${category.name}" ? Cette action est irréversible.`)) return;
    this.deleting.set(category.id);
    this.categoryService.deleteCategory(category.id).subscribe({
      next: () => {
        this.snackBar.open('Catégorie supprimée', 'Fermer', { duration: 3000 });
        this.deleting.set(null);
        this.loadCategories();
      },
      error: err => {
        this.deleting.set(null);
        this.snackBar.open(err.error?.message || 'Impossible de supprimer la catégorie', 'Fermer', { duration: 4000 });
      }
    });
  }
}
