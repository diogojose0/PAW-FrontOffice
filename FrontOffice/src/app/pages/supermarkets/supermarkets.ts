import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';

import { Supermarket } from '../../models/supermarket.models';
import { SupermarketRestServiceService } from '../../services/supermarket-rest-service.service';

@Component({
  selector: 'app-supermarkets',
  standalone: false,
  templateUrl: './supermarkets.html',
  styleUrl: './supermarkets.css',
})
export class Supermarkets implements OnInit {
  supermarkets: Supermarket[] = [];

  search = '';
  loading = false;
  errorMessage = '';

  constructor(private supermarketService: SupermarketRestServiceService) {}

  ngOnInit(): void {
    this.loadSupermarkets();
  }

  loadSupermarkets(): void {
    this.errorMessage = '';
    this.loading = true;

    this.supermarketService
      .listSupermarkets(this.search.trim())
      .pipe(
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe({
        next: (response) => {
          this.supermarkets = response.supermarkets;
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Could not load supermarkets.';
          this.supermarkets = [];
        },
      });
  }

  applySearch(): void {
    this.loadSupermarkets();
  }

  clearSearch(): void {
    this.search = '';
    this.loadSupermarkets();
  }

  hasDeliveryMethod(supermarket: Supermarket, method: string): boolean {
    return supermarket.deliveryMethods?.includes(method) || false;
  }

  getDeliveryCost(supermarket: Supermarket, method: 'pickup' | 'courier'): number {
    return supermarket.deliveryCosts?.[method] || 0;
  }
}
