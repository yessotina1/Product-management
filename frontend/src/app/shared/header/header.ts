import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule, RouterModule,
    MatToolbarModule, MatButtonModule,
    MatIconModule, MatMenuModule, MatDividerModule
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  auth   = inject(AuthService);
  router = inject(Router);

  menuToggle = output<void>();

  onMenuToggle(): void {
    this.menuToggle.emit();
  }

  logout(): void {
    this.auth.logout();
  }
}
