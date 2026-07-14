import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { Product, Category } from '../../../models';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule, RouterModule, FormsModule,
    MatIconModule, MatButtonModule, MatInputModule,
    MatSelectModule, MatProgressSpinnerModule,
    MatSnackBarModule, MatDialogModule, MatTooltipModule
  ],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss'
})
export class ProductList implements OnInit {
  private productService  = inject(ProductService);
  private categoryService = inject(CategoryService);
  private snackBar        = inject(MatSnackBar);

  products   = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  loading    = signal(true);
  deleting   = signal<number | null>(null);

  // Pagination
  currentPage = signal(1);
  lastPage    = signal(1);
  total       = signal(0);
  perPage     = 10;

  // Filtres
  searchTerm   = '';
  categoryId   = '';
  sortBy       = 'created_at';
  sortOrder: 'asc' | 'desc' = 'desc';

  private searchSubject = new Subject<string>();

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();

    // Debounce sur la recherche
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(() => {
      this.currentPage.set(1);
      this.loadProducts();
    });
  }

  loadCategories(): void {
    this.categoryService.getCategoryOptions().subscribe({
      next: response => this.categories.set(response.data),
      error: () => this.categories.set([])
    });
  }

  loadProducts(): void {
    this.loading.set(true);
    this.productService.getProducts({
      search:      this.searchTerm || undefined,
      category_id: this.categoryId ? +this.categoryId : undefined,
      sort_by:     this.sortBy,
      sort_order:  this.sortOrder,
      page:        this.currentPage(),
      per_page:    this.perPage,
    }).subscribe({
      next: (res) => {
        this.products.set(res.data);
        this.lastPage.set(res.last_page);
        this.total.set(res.total);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  onSearchChange(): void {
    this.searchSubject.next(this.searchTerm);
  }

  onFilterChange(): void {
    this.currentPage.set(1);
    this.loadProducts();
  }

  toggleSort(column: string): void {
    if (this.sortBy === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = column;
      this.sortOrder = 'desc';
    }
    this.loadProducts();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.lastPage()) return;
    this.currentPage.set(page);
    this.loadProducts();
  }

  get pages(): number[] {
    return Array.from({ length: this.lastPage() }, (_, i) => i + 1);
  }

  confirmDelete(product: Product): void {
    if (!confirm(`Supprimer "${product.name}" ? Cette action est irréversible.`)) return;
    this.deleting.set(product.id!);
    this.productService.deleteProduct(product.id!).subscribe({
      next: () => {
        this.snackBar.open('Produit supprimé', 'Fermer', { duration: 3000 });
        this.loadProducts();
        this.deleting.set(null);
      },
      error: () => {
        this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 3000 });
        this.deleting.set(null);
      }
    });
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.categoryId = '';
    this.sortBy     = 'created_at';
    this.sortOrder  = 'desc';
    this.currentPage.set(1);
    this.loadProducts();
  }
}
