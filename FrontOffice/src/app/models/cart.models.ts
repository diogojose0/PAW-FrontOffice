export interface CartItem {
  productId: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  stock: number;
  quantity: number;
  supermarketId: string;
  supermarketName: string;
  categoryName: string;
}

export interface ShopCart {
  supermarketId: string | null;
  supermarketName: string | null;
  items: CartItem[];
}
