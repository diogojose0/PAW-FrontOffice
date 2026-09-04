import { Order } from './order.models';

export interface DashboardSummary {
  totalOrders: number;
  activeOrders: number;
  cancelledOrders: number;
  totalSpent: number;
}

export interface OrdersByStatus {
  status: string;
  count: number;
}

export interface MostPurchasedProduct {
  name: string;
  quantity: number;
  totalSpent: number;
}

export interface ClientDashboardResponse {
  summary: DashboardSummary;
  ordersByStatus: OrdersByStatus[];
  mostPurchasedProducts: MostPurchasedProduct[];
  recentOrders: Order[];
}