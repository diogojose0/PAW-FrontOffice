import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';

import { Category } from '../../models/category.models';
import { Product } from '../../models/product.models';
import { CategoryRestServiceService } from '../../services/category-rest-service.service';
import { ProductRestServiceService } from '../../services/product-rest-service.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-products',
  standalone: false,
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];

  search = '';
  selectedCategory = '';
  selectedSort = 'name_asc';

  loadingProducts = false;
  loadingCategories = false;
  errorMessage = '';

  successMessage = '';

  constructor(
    private productService: ProductRestServiceService,
    private categoryService: CategoryRestServiceService,
    private cartService: CartService,
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
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

  loadProducts(): void {
    this.errorMessage = '';
    this.loadingProducts = true;

    this.productService
      .listProducts({
        search: this.search.trim(),
        category: this.selectedCategory,
        sort: this.selectedSort,
      })
      .pipe(
        finalize(() => {
          this.loadingProducts = false;
        }),
      )
      .subscribe({
        next: (response) => {
          this.products = response.products;
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Could not load products.';
          this.products = [];
        },
      });
  }

  applyFilters(): void {
    this.loadProducts();
  }

  clearFilters(): void {
    this.search = '';
    this.selectedCategory = '';
    this.selectedSort = 'name_asc';

    this.loadProducts();
  }

  addToCart(product: Product): void {
    this.successMessage = '';
    this.errorMessage = '';

    const result = this.cartService.addProduct(product);

    if (result.success) {
      this.successMessage = result.message;
    } else {
      this.errorMessage = result.message;
    }
  }
}
