import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';

import { AuthRestServiceService } from '../../services/auth-rest-service.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  password = '';
  loading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthRestServiceService,
  ) {}

  login(): void {
    this.errorMessage = '';

    if (!this.email || !this.password) {
      this.errorMessage = 'Email and password are required.';
      return;
    }

    this.loading = true;

    this.authService
      .login(this.email, this.password)
      .pipe(
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe({
        next: (response) => {
          this.authService.saveCurrentUser(response);

          const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
          this.router.navigateByUrl(returnUrl);
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Login failed.';
        },
      });
  }
}
