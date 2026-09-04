import { Component } from '@angular/core';
import { finalize } from 'rxjs';

import { ProductComparisonResponse } from '../../models/product.models';
import { ProductRestServiceService } from '../../services/product-rest-service.service';

@Component({
  selector: 'app-price-comparison',
  standalone: false,
  templateUrl: './price-comparison.html',
  styleUrl: './price-comparison.css',
})
export class PriceComparison {
  productName = '';
  comparison: ProductComparisonResponse | null = null;

  loading = false;
  errorMessage = '';
  searched = false;

  constructor(private productService: ProductRestServiceService) {}

  comparePrices(): void {
    this.errorMessage = '';
    this.comparison = null;
    this.searched = true;

    const normalizedProductName = this.productName.trim();

    if (!normalizedProductName) {
      this.errorMessage = 'Product name is required.';
      return;
    }

    this.loading = true;

    this.productService
      .comparePrices(normalizedProductName)
      .pipe(
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe({
        next: (response) => {
          this.comparison = response;
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Could not compare product prices.';
        },
      });
  }

  clearSearch(): void {
    this.productName = '';
    this.comparison = null;
    this.errorMessage = '';
    this.searched = false;
  }

  isCheapestOffer(offer: ProductComparisonResponse['offers'][number]): boolean {
    if (!this.comparison?.cheapest) {
      return false;
    }

    return offer.productId === this.comparison.cheapest.productId;
  }
}
