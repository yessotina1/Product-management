import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLinkActive, MatIconModule, MatRippleModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar {
  isOpen = input<boolean>(true);

  navItems: NavItem[] = [
    { label: 'Dashboard',  icon: 'dashboard',   route: '/dashboard' },
    { label: 'Produits',   icon: 'inventory_2', route: '/products'  },
    { label: 'Catégories', icon: 'category',    route: '/categories' },
  ];
}
