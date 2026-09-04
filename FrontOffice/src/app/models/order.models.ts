export interface CreateOrderItemRequest {
  productId: string;
  quantity: number;
}

export type PaymentMethod = 'on_delivery' | 'stripe';
export type PaymentStatus = 'pending' | 'unpaid' | 'paid' | 'failed';

export interface CreateOrderRequest {
  items: CreateOrderItemRequest[];
  deliveryMethod: 'pickup' | 'courier';
  couponCode?: string;
  paymentMethod?: PaymentMethod;
}

export interface OrderItem {
  productId: string;
  nameSnapshot: string;
  priceSnapshot: number;
  quantity: number;
  subtotal: number;
}

export interface OrderSupermarket {
  _id: string;
  name: string;
  location: string;
}

export interface Delivery {
  _id: string;
  orderId: string;
  status: string;
  courierUserId?: string;
  acceptedAt?: string;
  deliveredAt?: string;
}

export interface Order {
  _id: string;
  clientUserId: string;
  supermarketId: string | OrderSupermarket;
  items: OrderItem[];
  itemsTotal: number;
  deliveryMethod: 'pickup' | 'courier';
  deliveryCost: number;
  finalTotal: number;
  paymentMethod?: PaymentMethod;
  paymentStatus?: PaymentStatus;
  stripeCheckoutSessionId?: string | null;
  paidAt?: string | null;
  status: string;
  createdAt: string;
  confirmedAt?: string;
  cancelledAt?: string;
  delivery?: Delivery;
  couponCode?: string | null;
  discountType?: string | null;
  discountValue?: number;
  discountAmount?: number;
}

export interface CreateOrderResponse {
  message: string;
  order: Order;
}

export interface OrdersResponse {
  count: number;
  orders: Order[];
}

export interface OrderResponse {
  order: Order;
}

export interface CancelOrderResponse {
  message: string;
  order: Order;
}

export interface ValidateCouponRequest {
  items: CreateOrderItemRequest[];
  deliveryMethod: 'pickup' | 'courier';
  couponCode: string;
}

export interface ValidateCouponResponse {
  message: string;
  couponCode: string;
  discountType: string;
  discountValue: number;
  discountAmount: number;
  itemsTotal: number;
  deliveryCost: number;
  finalTotal: number;
}

export interface OrderReview {
  _id: string;
  orderId: string;
  clientUserId: string;
  supermarketId: string;
  courierUserId?: string | null;
  supermarketRating: number;
  supermarketComment?: string;
  courierRating?: number | null;
  courierComment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewFormRequest {
  supermarketRating: number;
  supermarketComment?: string;
  courierRating?: number | null;
  courierComment?: string;
}

export interface OrderReviewResponse {
  canReview: boolean;
  review: OrderReview | null;
}

export interface SaveOrderReviewResponse {
  message: string;
  review: OrderReview;
}

export interface StripeCreateCheckoutSessionRequest {
  orderId: string;
}

export interface StripeCreateCheckoutSessionResponse {
  message: string;
  checkoutUrl: string;
  sessionId: string;
  orderId: string;
}

export interface StripeConfirmSessionRequest {
  sessionId: string;
}

export interface StripeConfirmSessionResponse {
  message: string;
  paymentStatus: PaymentStatus;
  stripePaymentStatus: string;
  order: Order;
}