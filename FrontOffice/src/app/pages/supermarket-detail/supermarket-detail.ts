import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';

import { Category } from '../../models/category.models';
import { Product } from '../../models/product.models';
import {
  Supermarket,
  SupermarketReview,
  SupermarketReviewStats,
} from '../../models/supermarket.models';
import { CartService } from '../../services/cart.service';
import { CategoryRestServiceService } from '../../services/category-rest-service.service';
import { SupermarketRestServiceService } from '../../services/supermarket-rest-service.service';

@Component({
  selector: 'app-supermarket-detail',
  standalone: false,
  templateUrl: './supermarket-detail.html',
  styleUrl: './supermarket-detail.css',
})
export class SupermarketDetail implements OnInit {
  supermarket: Supermarket | null = null;
  products: Product[] = [];
  categories: Category[] = [];

  reviews: SupermarketReview[] = [];
  reviewsSheetOpen = false;
  reviewStats: SupermarketReviewStats = {
    averageRating: 0,
    reviewCount: 0,
  };

  search = '';
  selectedCategory = '';
  selectedSort = 'name_asc';

  loading = false;
  loadingCategories = false;
  errorMessage = '';
  successMessage = '';

  private supermarketId = '';

  constructor(
    private route: ActivatedRoute,
    private supermarketService: SupermarketRestServiceService,
    private categoryService: CategoryRestServiceService,
    private cartService: CartService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.errorMessage = 'Invalid supermarket.';
      return;
    }

    this.supermarketId = id;
    this.loadCategories();
    this.loadSupermarketProducts();
    this.loadReviews();
  }

  loadCategories(): void {
    this.loadingCategories = true;

    this.categoryService
      .listCategories()
      .pipe(
        finalize(() => {
          this.loadingCategories = false;
        }),
      )
      .subscribe({
        next: (response) => {
          this.categories = response.categories;
        },
        error: () => {
          this.categories = [];
        },
      });
  }

  loadSupermarketProducts(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.loading = true;

    this.supermarketService
      .listSupermarketProducts(this.supermarketId, {
        search: this.search.trim(),
        category: this.selectedCategory,
        sort: this.selectedSort,
      })
      .pipe(
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe({
        next: (response) => {
          this.supermarket = response.supermarket;
          this.products = response.products;
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Could not load supermarket.';
          this.products = [];
        },
      });
  }

  loadReviews(): void {
    this.supermarketService.getSupermarketReviews(this.supermarketId).subscribe({
      next: (response) => {
        this.reviewStats = response.stats;
        this.reviews = response.reviews;
      },
      error: () => {
        this.reviewStats = {
          averageRating: 0,
          reviewCount: 0,
        };
        this.reviews = [];
      },
    });
  }

  getReviewerName(review: SupermarketReview): string {
    if (typeof review.clientUserId === 'string') {
      return 'Client';
    }

    return review.clientUserId.name || 'Client';
  }

  getStarText(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }

  getLatestReviews(): SupermarketReview[] {
    return this.reviews.slice(0, 3);
  }

  openReviewsSheet(): void {
    this.reviewsSheetOpen = true;
  }

  closeReviewsSheet(): void {
    this.reviewsSheetOpen = false;
  }

  applyFilters(): void {
    this.loadSupermarketProducts();
  }

  clearFilters(): void {
    this.search = '';
    this.selectedCategory = '';
    this.selectedSort = 'name_asc';
    this.loadSupermarketProducts();
  }

  hasDeliveryMethod(method: string): boolean {
    return this.supermarket?.deliveryMethods?.includes(method) || false;
  }

  getDeliveryCost(method: 'pickup' | 'courier'): number {
    return this.supermarket?.deliveryCosts?.[method] || 0;
  }

  addToCart(product: Product): void {
    this.successMessage = '';
    this.errorMessage = '';

    const result = this.cartService.addProduct(product, this.supermarket || undefined);

    if (result.success) {
      this.successMessage = result.message;
    } else {
      this.errorMessage = result.message;
    }
  }

  getRatingSummaryText(): string {
    if (!this.reviewStats.reviewCount) {
      return 'No reviews yet';
    }

    return `${this.reviewStats.averageRating.toFixed(1)}/5 from ${this.reviewStats.reviewCount} review(s)`;
  }
}
