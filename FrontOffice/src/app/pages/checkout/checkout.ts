import { Component, OnInit } from '@angular/core';

import { ShopCart } from '../../models/cart.models';
import {
  CreateOrderResponse,
  PaymentMethod,
  ValidateCouponResponse,
} from '../../models/order.models';
import { Supermarket } from '../../models/supermarket.models';
import { CartService } from '../../services/cart.service';
import { OrderRestServiceService } from '../../services/order-rest-service.service';
import { PaymentRestServiceService } from '../../services/payment-rest-service.service';
import { SupermarketRestServiceService } from '../../services/supermarket-rest-service.service';

@Component({
  selector: 'app-checkout',
  standalone: false,
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit {
  cartData: ShopCart = {
    supermarketId: null,
    supermarketName: null,
    items: [],
  };

  supermarket: Supermarket | null = null;

  deliveryMethod: 'pickup' | 'courier' = 'pickup';
  paymentMethod: PaymentMethod = 'on_delivery';

  createdOrder: CreateOrderResponse | null = null;

  loadingSupermarket = false;
  creatingOrder = false;

  errorMessage = '';
  successMessage = '';

  couponCode = '';

  validatingCoupon = false;
  couponSuccessMessage = '';
  couponErrorMessage = '';
  appliedCoupon: ValidateCouponResponse | null = null;

  constructor(
    private cartService: CartService,
    private orderService: OrderRestServiceService,
    private paymentService: PaymentRestServiceService,
    private supermarketService: SupermarketRestServiceService,
  ) {}

  ngOnInit(): void {
    this.loadCart();
    this.loadSupermarket();
  }

  loadCart(): void {
    this.cartData = this.cartService.getCart();
  }

  loadSupermarket(): void {
    if (!this.cartData.supermarketId) {
      return;
    }

    this.loadingSupermarket = true;

    this.supermarketService.getSupermarketById(this.cartData.supermarketId).subscribe({
      next: (response) => {
        this.supermarket = response.supermarket;

        if (!this.hasDeliveryMethod(this.deliveryMethod)) {
          const firstMethod = this.supermarket.deliveryMethods?.[0];

          if (firstMethod === 'pickup' || firstMethod === 'courier') {
            this.deliveryMethod = firstMethod;
          }
        }

        this.loadingSupermarket = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Could not load supermarket information.';
        this.loadingSupermarket = false;
      },
    });
  }

  hasDeliveryMethod(method: 'pickup' | 'courier'): boolean {
    return this.supermarket?.deliveryMethods?.includes(method) || false;
  }

  getDeliveryCost(): number {
    if (!this.supermarket) {
      return 0;
    }

    return this.supermarket.deliveryCosts?.[this.deliveryMethod] || 0;
  }

  getSubtotal(): number {
    return this.cartService.getSubtotal();
  }

  getFinalTotal(): number {
    return Math.max(this.getSubtotal() + this.getDeliveryCost() - this.getCouponDiscount(), 0);
  }

  getCouponDiscount(): number {
    return this.appliedCoupon?.discountAmount || 0;
  }

  getTotalItems(): number {
    return this.cartService.getTotalItems();
  }

  createOrder(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.createdOrder = null;

    if (this.cartData.items.length === 0) {
      this.errorMessage = 'Your cart is empty.';
      return;
    }

    if (!this.hasDeliveryMethod(this.deliveryMethod)) {
      this.errorMessage = 'Selected delivery method is not available for this supermarket.';
      return;
    }

    this.creatingOrder = true;

    this.orderService
      .createOrder({
        deliveryMethod: this.deliveryMethod,
        paymentMethod: this.paymentMethod,
        couponCode: this.couponCode.trim().toUpperCase() || undefined,
        items: this.cartData.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      })
      .subscribe({
        next: (response) => {
          this.createdOrder = response;
          this.appliedCoupon = null;
          this.couponSuccessMessage = '';
          this.couponErrorMessage = '';

          if (this.paymentMethod === 'stripe') {
            this.startStripePayment(response.order._id);
            return;
          }

          this.successMessage = response.message;
          this.cartService.clearCart();
          this.loadCart();
          this.creatingOrder = false;
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Could not create order.';
          this.creatingOrder = false;
        },
      });
  }

  startStripePayment(orderId: string): void {
    this.paymentService.createStripeCheckoutSession(orderId).subscribe({
      next: (response) => {
        this.cartService.clearCart();
        this.loadCart();

        window.location.href = response.checkoutUrl;
      },
      error: (error) => {
        this.errorMessage =
          error.error?.message ||
          'Order was created, but Stripe payment could not be started. You can retry from the order details page.';

        this.successMessage = 'Order created, but payment is still unpaid.';
        this.creatingOrder = false;
      },
    });
  }

  clearCouponPreview(): void {
    this.appliedCoupon = null;
    this.couponSuccessMessage = '';
    this.couponErrorMessage = '';
  }

  applyCoupon(): void {
    this.couponSuccessMessage = '';
    this.couponErrorMessage = '';
    this.appliedCoupon = null;

    const normalizedCouponCode = this.couponCode.trim().toUpperCase();

    if (!normalizedCouponCode) {
      this.couponErrorMessage = 'Coupon code is required.';
      return;
    }

    if (this.cartData.items.length === 0) {
      this.couponErrorMessage = 'Your cart is empty.';
      return;
    }

    if (!this.hasDeliveryMethod(this.deliveryMethod)) {
      this.couponErrorMessage = 'Selected delivery method is not available.';
      return;
    }

    this.validatingCoupon = true;

    this.orderService
      .validateCoupon({
        deliveryMethod: this.deliveryMethod,
        couponCode: normalizedCouponCode,
        items: this.cartData.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      })
      .subscribe({
        next: (response) => {
          this.appliedCoupon = response;
          this.couponSuccessMessage = response.message;
          this.couponCode = response.couponCode;
          this.validatingCoupon = false;
        },
        error: (error) => {
          this.couponErrorMessage = error.error?.message || 'Invalid coupon.';
          this.validatingCoupon = false;
        },
      });
  }
}