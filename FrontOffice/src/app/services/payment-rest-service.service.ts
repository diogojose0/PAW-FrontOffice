import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import {
  StripeConfirmSessionResponse,
  StripeCreateCheckoutSessionResponse,
} from '../models/order.models';

@Injectable({
  providedIn: 'root',
})
export class PaymentRestServiceService {
  private endpoint = `${environment.apiUrl}/payments`;

  constructor(private http: HttpClient) {}

  createStripeCheckoutSession(orderId: string): Observable<StripeCreateCheckoutSessionResponse> {
    return this.http.post<StripeCreateCheckoutSessionResponse>(
      `${this.endpoint}/stripe/create-checkout-session`,
      { orderId },
    );
  }

  confirmStripeSession(sessionId: string): Observable<StripeConfirmSessionResponse> {
    return this.http.post<StripeConfirmSessionResponse>(
      `${this.endpoint}/stripe/confirm-session`,
      { sessionId },
    );
  }
}