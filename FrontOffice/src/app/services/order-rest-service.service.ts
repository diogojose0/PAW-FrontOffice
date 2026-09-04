import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import {
  CancelOrderResponse,
  CreateOrderRequest,
  CreateOrderResponse,
  OrderResponse,
  OrdersResponse,
  OrderReviewResponse,
  ReviewFormRequest,
  SaveOrderReviewResponse,
  ValidateCouponRequest,
  ValidateCouponResponse,
} from '../models/order.models';

@Injectable({
  providedIn: 'root',
})
export class OrderRestServiceService {
  private endpoint = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  createOrder(orderData: CreateOrderRequest): Observable<CreateOrderResponse> {
    return this.http.post<CreateOrderResponse>(this.endpoint, orderData);
  }

  listOrders(): Observable<OrdersResponse> {
    return this.http.get<OrdersResponse>(this.endpoint);
  }

  getOrderById(orderId: string): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${this.endpoint}/${orderId}`);
  }

  cancelOrder(orderId: string): Observable<CancelOrderResponse> {
    return this.http.post<CancelOrderResponse>(`${this.endpoint}/${orderId}/cancel`, {});
  }

  validateCoupon(couponData: ValidateCouponRequest): Observable<ValidateCouponResponse> {
    return this.http.post<ValidateCouponResponse>(`${this.endpoint}/validate-coupon`, couponData);
  }

  getOrderReview(orderId: string): Observable<OrderReviewResponse> {
    return this.http.get<OrderReviewResponse>(`${this.endpoint}/${orderId}/review`);
  }

  saveOrderReview(
    orderId: string,
    reviewData: ReviewFormRequest,
  ): Observable<SaveOrderReviewResponse> {
    return this.http.put<SaveOrderReviewResponse>(`${this.endpoint}/${orderId}/review`, reviewData);
  }
}