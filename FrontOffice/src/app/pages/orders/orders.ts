import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';

import { Order, OrderSupermarket } from '../../models/order.models';
import { OrderRestServiceService } from '../../services/order-rest-service.service';

@Component({
  selector: 'app-orders',
  standalone: false,
  templateUrl: './orders.html',
  styleUrl: './orders.css'
})
export class Orders implements OnInit {
  orders: Order[] = [];

  loading = false;
  errorMessage = '';

  constructor(private orderService: OrderRestServiceService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.errorMessage = '';
    this.loading = true;

    this.orderService.listOrders()
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: (response) => {
          this.orders = response.orders;
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Could not load orders.';
          this.orders = [];
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