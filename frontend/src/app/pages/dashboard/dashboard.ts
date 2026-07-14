import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { AuthService } from '../../services/auth.service';

interface StatCard {
  label: string;
  value: string | number;
  icon: string;
  color: string;
  bg: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, RouterModule,
    MatIconModule, MatButtonModule, MatProgressSpinnerModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  private productService  = inject(ProductService);
  private categoryService = inject(CategoryService);
  auth = inject(AuthService);

  loading = signal(true);
  stats = signal<StatCard[]>([]);
  recentProducts = signal<any[]>([]);

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.productService.getProducts({ per_page: 5, sort_by: 'created_at', sort_order: 'desc' })
      .subscribe({
        next: (res) => {
          const products = res.data;
          const totalStock = products.reduce((sum, p) => sum + p.stock_quantity, 0);
          const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock_quantity), 0);

          this.stats.set([
            { label: 'Total Produits',   value: res.total,                           icon: 'inventory_2', color: '#047857', bg: '#d1fae5' },
            { label: 'Stock Total',      value: totalStock,                          icon: 'warehouse',   color: '#059669', bg: '#ecfdf5' },
            { label: 'Valeur du Stock',  value: totalValue.toFixed(2) + ' FCFA',     icon: 'euro',        color: '#d97706', bg: '#fffbeb' },
            { label: 'Dernière Activité',value: new Date().toLocaleDateString('fr'), icon: 'schedule',    color: '#7c3aed', bg: '#f5f3ff' },
          ]);

          this.recentProducts.set(products);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
  }
}
