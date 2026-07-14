import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  private fb      = inject(FormBuilder);
  private auth    = inject(AuthService);
  private router  = inject(Router);
  private snackBar = inject(MatSnackBar);

  loading = false;
  hidePassword = true;
  isRegisterMode = false;

  form = this.fb.group({
    name:                 [''],
    email:                ['', [Validators.required, Validators.email]],
    password:             ['', [Validators.required, Validators.minLength(8)]],
    password_confirmation:[''],
  });

  toggleMode(): void {
    this.isRegisterMode = !this.isRegisterMode;
    this.form.reset();
  }

  onSubmit(): void {
    if (this.form.invalid || this.loading) return;
    this.loading = true;
    const { email, password, name, password_confirmation } = this.form.value;

    const request$ = this.isRegisterMode
      ? this.auth.register(name!, email!, password!, password_confirmation!)
      : this.auth.login(email!, password!);

    request$.subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        this.loading = false;
        const msg = err.error?.message || 'Une erreur est survenue';
        this.snackBar.open(msg, 'Fermer', { duration: 4000 });
      }
    });
  }
}
