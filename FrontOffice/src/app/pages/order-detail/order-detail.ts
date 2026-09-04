import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';

import { Order, OrderReview, OrderSupermarket } from '../../models/order.models';
import { OrderRestServiceService } from '../../services/order-rest-service.service';
import { PaymentRestServiceService } from '../../services/payment-rest-service.service';

@Component({
  selector: 'app-order-detail',
  standalone: false,
  templateUrl: './order-detail.html',
  styleUrl: './order-detail.css',
})
export class OrderDetail implements OnInit {
  order: Order | null = null;

  loading = false;
  cancelling = false;
  startingPayment = false;
  loadingReview = false;
  savingReview = false;

  review: OrderReview | null = null;

  supermarketRating = 5;
  supermarketComment = '';
  courierRating: number | null = null;
  courierComment = '';

  errorMessage = '';
  successMessage = '';

  private orderId = '';

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderRestServiceService,
    private paymentService: PaymentRestServiceService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.errorMessage = 'Invalid order.';
      return;
    }

    this.orderId = id;
    this.loadOrder();
  }

  loadOrder(): void {
    this.errorMessage = '';
    this.loading = true;

    this.orderService
      .getOrderById(this.orderId)
      .pipe(
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe({
        next: (response) => {
          this.order = response.order;

          if (this.order.status === 'delivered') {
            this.loadReview();
          }
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Could not load order.';
        },
      });
  }

  loadReview(): void {
    if (!this.order) {
      return;
    }

    this.loadingReview = true;

    this.orderService
      .getOrderReview(this.order._id)
      .pipe(
        finalize(() => {
          this.loadingReview = false;
        }),
      )
      .subscribe({
        next: (response) => {
          this.review = response.review;

          if (this.review) {
            this.supermarketRating = this.review.supermarketRating;
            this.supermarketComment = this.review.supermarketComment || '';
            this.courierRating = this.review.courierRating || null;
            this.courierComment = this.review.courierComment || '';
          } else if (this.hasCourierToReview()) {
            this.courierRating = 5;
          }
        },
        error: () => {
          this.review = null;
        },
      });
  }

  saveReview(): void {
    if (!this.order) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';
    this.savingReview = true;

    this.orderService
      .saveOrderReview(this.order._id, {
        supermarketRating: Number(this.supermarketRating),
        supermarketComment: this.supermarketComment,
        courierRating: this.hasCourierToReview() ? Number(this.courierRating || 5) : null,
        courierComment: this.hasCourierToReview() ? this.courierComment : '',
      })
      .pipe(
        finalize(() => {
          this.savingReview = false;
        }),
      )
      .subscribe({
        next: (response) => {
          this.review = response.review;
          this.successMessage = response.message;
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Could not save review.';
        },
      });
  }

  cancelOrder(): void {
    if (!this.order) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';
    this.cancelling = true;

    this.orderService
      .cancelOrder(this.order._id)
      .pipe(
        finalize(() => {
          this.cancelling = false;
        }),
      )
      .subscribe({
        next: (response) => {
          this.order = response.order;
          this.successMessage = response.message;
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Could not cancel order.';
        },
      });
  }

  canReviewOrder(): boolean {
    return this.order?.status === 'delivered';
  }

  hasCourierToReview(): boolean {
    return Boolean(
      this.order?.deliveryMethod === 'courier' &&
      this.order?.delivery &&
      this.order.delivery.courierUserId,
    );
  }

  getRatingOptions(): number[] {
    return [5, 4, 3, 2, 1];
  }

  canCancelOrder(): boolean {
    if (!this.order) {
      return false;
    }

    if (this.order.status !== 'pending') {
      return false;
    }

    const createdAt = new Date(this.order.createdAt).getTime();
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;

    return now - createdAt <= fiveMinutes;
  }

  getSupermarketName(): string {
    if (!this.order) {
      return 'Unknown supermarket';
    }

    if (typeof this.order.supermarketId === 'string') {
      return 'Unknown supermarket';
    }

    return (this.order.supermarketId as OrderSupermarket).name || 'Unknown supermarket';
  }

  getSupermarketLocation(): string {
    if (!this.order) {
      return 'No location available';
    }

    if (typeof this.order.supermarketId === 'string') {
      return 'No location available';
    }

    return (this.order.supermarketId as OrderSupermarket).location || 'No location available';
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

  canPayWithStripe(): boolean {
    return Boolean(
      this.order &&
      this.order.paymentMethod === 'stripe' &&
      this.order.paymentStatus !== 'paid' &&
      this.order.status !== 'cancelled',
    );
  }

  retryStripePayment(): void {
    if (!this.order) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';
    this.startingPayment = true;

    this.paymentService.createStripeCheckoutSession(this.order._id).subscribe({
      next: (response) => {
        window.location.href = response.checkoutUrl;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Could not start Stripe payment.';
        this.startingPayment = false;
      },
    });
  }
}