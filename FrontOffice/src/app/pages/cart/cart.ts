import { Component, OnInit } from '@angular/core';

import { environment } from '../../../environments/environment';
import { ShopCart, CartItem } from '../../models/cart.models';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart implements OnInit {
  cartData: ShopCart = {
    supermarketId: null,
    supermarketName: null,
    items: [],
  };

  errorMessage = '';
  successMessage = '';

  private backendBaseUrl = environment.apiUrl.replace('/api', '');

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartData = this.cartService.getCart();
  }

  increaseQuantity(item: CartItem): void {
    this.changeQuantity(item, item.quantity + 1);
  }

  decreaseQuantity(item: CartItem): void {
    this.changeQuantity(item, item.quantity - 1);
  }

  changeQuantity(item: CartItem, quantity: number): void {
    this.errorMessage = '';
    this.successMessage = '';

    const result = this.cartService.updateQuantity(item.productId, Number(quantity));

    if (result.success) {
      this.successMessage = result.message;
      this.loadCart();
    } else {
      this.errorMessage = result.message;
    }
  }

  removeItem(item: CartItem): void {
    this.cartService.removeItem(item.productId);
    this.successMessage = `${item.name} removed from cart.`;
    this.errorMessage = '';
    this.loadCart();
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.successMessage = 'Cart cleared.';
    this.errorMessage = '';
    this.loadCart();
  }

  getSubtotal(): number {
    return this.cartService.getSubtotal();
  }

  getTotalItems(): number {
    return this.cartService.getTotalItems();
  }

  getItemSubtotal(item: CartItem): number {
    return item.price * item.quantity;
  }

  getItemImageUrl(item: CartItem): string {
    if (!item.imageUrl) {
      return '';
    }

    if (item.imageUrl.startsWith('http')) {
      return item.imageUrl;
    }

    return `${this.backendBaseUrl}${item.imageUrl}`;
  }
}
