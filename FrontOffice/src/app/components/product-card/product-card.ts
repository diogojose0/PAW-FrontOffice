import { Component, EventEmitter, Input, Output } from '@angular/core';

import { environment } from '../../../environments/environment';
import { Product } from '../../models/product.models';

@Component({
  selector: 'app-product-card',
  standalone: false,
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Input() showSupermarketInfo = true;

  @Output() addProduct = new EventEmitter<Product>();

  private backendBaseUrl = environment.apiUrl.replace('/api', '');

  getProductImageUrl(): string {
    if (!this.product.imageUrl) {
      return '';
    }

    if (this.product.imageUrl.startsWith('http')) {
      return this.product.imageUrl;
    }

    return `${this.backendBaseUrl}${this.product.imageUrl}`;
  }

  getProductSupermarketName(): string {
    if (typeof this.product.supermarketId === 'string') {
      return 'Unknown supermarket';
    }

    return this.product.supermarketId?.name || 'Unknown supermarket';
  }

  getProductSupermarketLocation(): string {
    if (typeof this.product.supermarketId === 'string') {
      return 'No location available';
    }

    return this.product.supermarketId?.location || 'No location available';
  }

  onAddToCart(): void {
    this.addProduct.emit(this.product);
  }
}