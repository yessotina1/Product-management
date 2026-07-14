import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models';
import {CategoryNamePipe} from '../../../pipes/category-name.pipe';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule, RouterModule, ReactiveFormsModule,
    MatInputModule, MatButtonModule, MatIconModule,
    MatSelectModule, MatProgressSpinnerModule, MatSnackBarModule,CategoryNamePipe
  ],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss'
})
export class ProductForm implements OnInit {
  private fb              = inject(FormBuilder);
  private router          = inject(Router);
  private route           = inject(ActivatedRoute);
  private productService  = inject(ProductService);
  private categoryService = inject(CategoryService);
  private snackBar        = inject(MatSnackBar);

  categories  = signal<Category[]>([]);
  loading     = signal(false);
  loadingData = signal(false);
  isEditMode  = signal(false);
  productId   = signal<number | null>(null);

  form = this.fb.group({
    name:           ['', [Validators.required, Validators.maxLength(255)]],
    description:    ['', Validators.required],
    price:          [null as number | null, [Validators.required, Validators.min(0)]],
    stock_quantity: [null as number | null, [Validators.required, Validators.min(0)]],
    category_id:    [null as number | null, Validators.required],
  });

  ngOnInit(): void {
    this.categoryService.getCategoryOptions().subscribe({
      next: response => this.categories.set(response.data),
      error: () => {
        this.categories.set([]);
        this.snackBar.open('Impossible de charger les catégories', 'Fermer', { duration: 3000 });
      }
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.productId.set(+id);
      this.loadProduct(+id);
    }
  }

  loadProduct(id: number): void {
    this.loadingData.set(true);
    this.productService.getProduct(id).subscribe({
      next: (product) => {
        this.form.patchValue({
          name:           product.name,
          description:    product.description,
          price:          product.price,
          stock_quantity: product.stock_quantity,
          category_id:    product.category_id,
        });
        this.loadingData.set(false);
      },
      error: () => {
        this.snackBar.open('Produit introuvable', 'Fermer', { duration: 3000 });
        this.router.navigate(['/products']);
      }
    });
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.loading()) return;

    this.loading.set(true);

    const raw = this.form.value;
    const data = {
      name:           raw.name!,
      description:    raw.description!,
      price:          Number(raw.price),
      stock_quantity: Number(raw.stock_quantity),
      category_id:    Number(raw.category_id),
    };

    const request$ = this.isEditMode()
      ? this.productService.updateProduct(this.productId()!, data)
      : this.productService.createProduct(data);

    request$.subscribe({
      next: () => {
        this.snackBar.open(
          this.isEditMode() ? 'Produit modifié ' : 'Produit créé ',
          'Fermer',
          { duration: 3000 }
        );
        this.router.navigate(['/products']);
      },
      error: (err) => {
        this.loading.set(false);
        const msg = err.error?.message || 'Une erreur est survenue';
        this.snackBar.open(msg, 'Fermer', { duration: 4000 });
      }
    });
  }

  getError(field: string): string {
    const control = this.form.get(field);
    if (!control?.touched || !control.errors) return '';
    if (control.errors['required'])  return 'Ce champ est requis';
    if (control.errors['maxlength']) return 'Trop long (255 max)';
    if (control.errors['min'])       return 'La valeur doit être ≥ 0';
    return '';
  }
}
