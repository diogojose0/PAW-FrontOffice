import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';

import { ClientDashboardResponse } from '../../models/dashboard.models';
import { Order, OrderSupermarket } from '../../models/order.models';
import { DashboardRestServiceService } from '../../services/dashboard-rest-service.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  dashboard: ClientDashboardResponse | null = null;

  loading = false;
  errorMessage = '';

  constructor(private dashboardService: DashboardRestServiceService) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.errorMessage = '';
    this.loading = true;

    this.dashboardService.getClientDashboard()
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: (response) => {
          this.dashboard = response;
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Could not load client dashboard.';
          this.dashboard = null;
        }
      });
  }

  getSupermarketName(order: Order): string {
    if (typeof order.supermarketId === 'string') {
      return 'Unknown supermarket';
    }

    return (order.supermarketId as OrderSupermarket).name || 'Unknown supermarket';
  }

  getOrderItemsCount(order: Order): number {
    return order.items.reduce((total: number, item) => total + item.quantity, 0);
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'pending':
        return 'text-bg-warning';
      case 'confirmed':
        return 'text-bg-primary';
      case 'preparing':
        return 'text-bg-info';
      case 'delivering':
        return 'text-bg-dark';
      case 'delivered':
        return 'text-bg-success';
      case 'cancelled':
        return 'text-bg-secondary';
      default:
        return 'text-bg-light border';
    }
  }
}