import { Category } from './category.models';
import { Supermarket } from './supermarket.models';

export interface Product {
  _id: string;
  supermarketId: Supermarket | string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  stock: number;
  active: boolean;
  categoryId: Category;
}

export interface ProductsResponse {
  count: number;
  products: Product[];
}

export interface ProductFilters {
  search?: string;
  category?: string;
  supermarket?: string;
  sort?: string;
}

export interface ProductComparisonOffer {
  productId: string;
  name: string;
  price: number;
  stock: number;
  supermarket: {
    _id: string;
    name: string;
    location: string;
  };
}

export interface CheapestProductOffer {
  productId: string;
  name: string;
  supermarket: string;
  price: number;
}

export interface ProductComparisonResponse {
  productName: string;
  count: number;
  cheapest: CheapestProductOffer | null;
  offers: ProductComparisonOffer[];
}