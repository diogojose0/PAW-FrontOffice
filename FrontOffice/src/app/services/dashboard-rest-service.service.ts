import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { ClientDashboardResponse } from '../models/dashboard.models';

@Injectable({
  providedIn: 'root'
})
export class DashboardRestServiceService {
  private endpoint = `${environment.apiUrl}/dashboard/client`;

  constructor(private http: HttpClient) {}

  getClientDashboard(): Observable<ClientDashboardResponse> {
    return this.http.get<ClientDashboardResponse>(this.endpoint);
  }
}