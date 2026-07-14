import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './category-form.html',
  styleUrl: './category-form.scss'
})
export class CategoryForm implements OnInit {
  private fb = inject(FormBuilder);
  public router = inject(Router);
  private route = inject(ActivatedRoute);
  private categoryService = inject(CategoryService);
  private snackBar = inject(MatSnackBar);

  loading = signal(false);
  loadingData = signal(false);
  isEditMode = signal(false);
  categoryId = signal<number | null>(null);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(255)]],
    description: ['', [Validators.required, Validators.maxLength(1000)]],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.categoryId.set(+id);
      this.loadCategory(+id);
    }
  }

  loadCategory(id: number): void {
    this.loadingData.set(true);
    this.categoryService.getCategory(id).subscribe({
      next: category => {
        this.form.patchValue({
          name: category.name,
          description: category.description,
        });
        this.loadingData.set(false);
      },
      error: () => {
        this.snackBar.open('Catégorie introuvable', 'Fermer', { duration: 3000 });
        this.router.navigate(['/categories']);
      }
    });
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.loading()) return;

    this.loading.set(true);
    const raw = this.form.value;
    const data: Partial<Category> = {
      name: raw.name ?? undefined,
      description: raw.description ?? undefined,
    };

    const request$ = this.isEditMode()
      ? this.categoryService.updateCategory(this.categoryId()!, data)
      : this.categoryService.createCategory(data);

    request$.subscribe({
      next: () => {
        this.snackBar.open(
          this.isEditMode() ? 'Catégorie modifiée' : 'Catégorie créée',
          'Fermer',
          { duration: 3000 }
        );
        this.router.navigate(['/categories']);
      },
      error: err => {
        this.loading.set(false);
        const msg = err.error?.message || 'Une erreur est survenue';
        this.snackBar.open(msg, 'Fermer', { duration: 4000 });
      }
    });
  }

  getError(field: string): string {
    const control = this.form.get(field);
    if (!control?.touched || !control.errors) return '';
    if (control.errors['required']) return 'Ce champ est requis';
    if (control.errors['maxlength']) return 'Trop long';
    return '';
  }
}
