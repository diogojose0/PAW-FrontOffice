import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { CategoriesResponse } from '../models/category.models';

@Injectable({
  providedIn: 'root',
})
export class CategoryRestServiceService {
  private endpoint = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  listCategories(search?: string): Observable<CategoriesResponse> {
    let params = new HttpParams();

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<CategoriesResponse>(this.endpoint, { params });
  }
}