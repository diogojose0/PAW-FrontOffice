import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import { RegisterRequest } from '../../models/auth.models';
import { AuthRestServiceService } from '../../services/auth-rest-service.service';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  registerData: RegisterRequest = {
    name: '',
    email: '',
    password: '',
    address: '',
    phone: '',
  };

  loading = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private authService: AuthRestServiceService,
  ) {}

  register(): void {
    this.errorMessage = '';

    if (
      !this.registerData.name ||
      !this.registerData.email ||
      !this.registerData.password ||
      !this.registerData.address ||
      !this.registerData.phone
    ) {
      this.errorMessage = 'All fields are required.';
      return;
    }

    this.loading = true;

    this.authService
      .register(this.registerData)
      .pipe(
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe({
        next: (response) => {
          this.authService.saveCurrentUser(response);
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Registration failed.';
        },
      });
  }
}
