export interface DeliveryCosts {
  pickup?: number;
  courier?: number;
}

export interface SupermarketReviewClient {
  _id: string;
  name: string;
}

export interface SupermarketReview {
  _id: string;
  clientUserId: SupermarketReviewClient | string;
  supermarketRating: number;
  supermarketComment?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface SupermarketReviewStats {
  averageRating: number;
  reviewCount: number;
}

export interface SupermarketReviewsResponse {
  stats: SupermarketReviewStats;
  reviews: SupermarketReview[];
}

export interface Supermarket {
  _id: string;
  name: string;
  description?: string;
  location: string;
  openingHours?: string;
  deliveryMethods?: string[];
  deliveryCosts?: DeliveryCosts;
  approvedByAdmin?: boolean;
}

export interface SupermarketsResponse {
  count: number;
  supermarkets: Supermarket[];
}

export interface SupermarketResponse {
  supermarket: Supermarket;
}