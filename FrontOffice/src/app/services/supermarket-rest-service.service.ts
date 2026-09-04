import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Product, ProductFilters } from '../models/product.models';
import {
  Supermarket,
  SupermarketResponse,
  SupermarketReviewsResponse,
  SupermarketsResponse,
} from '../models/supermarket.models';

@Injectable({
  providedIn: 'root',
})
export class SupermarketRestServiceService {
  private endpoint = `${environment.apiUrl}/supermarkets`;

  constructor(private http: HttpClient) {}

  listSupermarkets(search?: string): Observable<SupermarketsResponse> {
    let params = new HttpParams();

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<SupermarketsResponse>(this.endpoint, { params });
  }

  getSupermarketById(id: string): Observable<SupermarketResponse> {
    return this.http.get<SupermarketResponse>(`${this.endpoint}/${id}`);
  }

  getSupermarketReviews(id: string): Observable<SupermarketReviewsResponse> {
    return this.http.get<SupermarketReviewsResponse>(`${this.endpoint}/${id}/reviews`);
  }

  listSupermarketProducts(
    supermarketId: string,
    filters: ProductFilters = {},
  ): Observable<{ supermarket: Supermarket; count: number; products: Product[] }> {
    let params = new HttpParams();

    if (filters.search) {
      params = params.set('search', filters.search);
    }

    if (filters.category) {
      params = params.set('category', filters.category);
    }

    if (filters.sort) {
      params = params.set('sort', filters.sort);
    }

    return this.http.get<{ supermarket: Supermarket; count: number; products: Product[] }>(
      `${this.endpoint}/${supermarketId}/products`,
      { params },
    );
  }
}