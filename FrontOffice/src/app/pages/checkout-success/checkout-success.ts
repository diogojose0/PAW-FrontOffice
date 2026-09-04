import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Order } from '../../models/order.models';
import { PaymentRestServiceService } from '../../services/payment-rest-service.service';

@Component({
  selector: 'app-checkout-success',
  standalone: false,
  templateUrl: './checkout-success.html',
  styleUrl: './checkout-success.css',
})
export class CheckoutSuccess implements OnInit {
  order: Order | null = null;

  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private route: ActivatedRoute,
    private paymentService: PaymentRestServiceService,
  ) {}

  ngOnInit(): void {
    const sessionId = this.route.snapshot.queryParamMap.get('session_id');

    if (!sessionId) {
      this.errorMessage = 'Missing Stripe session ID.';
      return;
    }

    this.loading = true;

    this.paymentService.confirmStripeSession(sessionId).subscribe({
      next: (response) => {
        this.order = response.order;
        this.successMessage = response.message;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Could not confirm Stripe payment.';
        this.loading = false;
      },
    });
  }
}