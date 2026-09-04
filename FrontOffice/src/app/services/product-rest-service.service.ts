import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import {
  ProductComparisonResponse,
  ProductFilters,
  ProductsResponse,
} from '../models/product.models';

@Injectable({
  providedIn: 'root',
})
export class ProductRestServiceService {
  private endpoint = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  listProducts(filters: ProductFilters = {}): Observable<ProductsResponse> {
    let params = new HttpParams();

    if (filters.search) {
      params = params.set('search', filters.search);
    }

    if (filters.category) {
      params = params.set('category', filters.category);
    }

    if (filters.supermarket) {
      params = params.set('supermarket', filters.supermarket);
    }

    if (filters.sort) {
      params = params.set('sort', filters.sort);
    }

    return this.http.get<ProductsResponse>(this.endpoint, { params });
  }

  comparePrices(productName: string): Observable<ProductComparisonResponse> {
    const params = new HttpParams().set('name', productName);

    return this.http.get<ProductComparisonResponse>(`${this.endpoint}/compare`, {
      params,
    });
  }
}