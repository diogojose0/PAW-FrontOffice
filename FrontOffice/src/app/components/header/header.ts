import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

import { PublicUser } from '../../models/auth.models';
import { CartItem } from '../../models/cart.models';
import { AuthRestServiceService } from '../../services/auth-rest-service.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class HeaderComponent implements OnInit {
  currentUser: PublicUser | null = null;
  isLoggedIn = false;

  constructor(
    private router: Router,
    private authService: AuthRestServiceService,
    private cartService: CartService,
  ) {}

  ngOnInit(): void {
    this.refreshSessionFromStorage();

    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.refreshSessionFromStorage();
    });
  }

  logout(): void {
    this.authService.logout();
    this.refreshSessionFromStorage();
    this.router.navigate(['/login']);
  }

  getCartTotalItems(): number {
    return this.cartService.getTotalItems();
  }

  getCartSubtotal(): number {
    return this.cartService.getSubtotal();
  }

  getCartPreviewItems(): CartItem[] {
    return this.cartService.getCart().items.slice(0, 3);
  }

  hasMoreCartItems(): boolean {
    return this.cartService.getCart().items.length > 3;
  }

  private refreshSessionFromStorage(): void {
    this.currentUser = this.authService.getUser();
    this.isLoggedIn = this.authService.isLoggedIn();
  }
}