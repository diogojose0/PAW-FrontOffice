import { Injectable } from '@angular/core';

import { ShopCart, CartItem } from '../models/cart.models';
import { Product } from '../models/product.models';
import { Supermarket } from '../models/supermarket.models';

const CART_KEY = 'cart';

export interface CartOperationResult {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  getCart(): ShopCart {
    const storedCart = localStorage.getItem(CART_KEY);

    if (!storedCart) {
      return this.getEmptyCart();
    }

    try {
      const cart = JSON.parse(storedCart) as ShopCart;

      if (!cart.items || !Array.isArray(cart.items)) {
        this.clearCart();
        return this.getEmptyCart();
      }

      return cart;
    } catch (error) {
      this.clearCart();
      return this.getEmptyCart();
    }
  }

  addProduct(product: Product, supermarketOverride?: Supermarket): CartOperationResult {
    const cart = this.getCart();

    const productSupermarketId = this.getProductSupermarketId(product, supermarketOverride);
    const productSupermarketName = this.getProductSupermarketName(product, supermarketOverride);

    if (!productSupermarketId || !productSupermarketName) {
      return {
        success: false,
        message: 'Invalid product supermarket.',
      };
    }

    if (product.stock <= 0) {
      return {
        success: false,
        message: 'This product is out of stock.',
      };
    }

    if (cart.supermarketId && cart.supermarketId !== productSupermarketId) {
      return {
        success: false,
        message: `Your cart already has products from ${cart.supermarketName}. Clear the cart before adding products from ${productSupermarketName}.`,
      };
    }

    const existingItem = cart.items.find((item: CartItem) => item.productId === product._id);

    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        return {
          success: false,
          message: 'There is not enough stock for this product.',
        };
      }

      existingItem.quantity += 1;
      existingItem.stock = product.stock;
    } else {
      const item: CartItem = {
        productId: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        imageUrl: product.imageUrl,
        stock: product.stock,
        quantity: 1,
        supermarketId: productSupermarketId,
        supermarketName: productSupermarketName,
        categoryName: product.categoryId.name,
      };

      cart.items.push(item);
    }

    cart.supermarketId = productSupermarketId;
    cart.supermarketName = productSupermarketName;

    this.saveCart(cart);

    return {
      success: true,
      message: `${product.name} added to cart.`,
    };
  }

  updateQuantity(productId: string, quantity: number): CartOperationResult {
    const cart = this.getCart();

    const item = cart.items.find((cartItem: CartItem) => cartItem.productId === productId);

    if (!item) {
      return {
        success: false,
        message: 'Product not found in cart.',
      };
    }

    const newQuantity = Number(quantity);

    if (!Number.isInteger(newQuantity) || newQuantity < 1) {
      return {
        success: false,
        message: 'Quantity must be at least 1.',
      };
    }

    if (newQuantity > item.stock) {
      return {
        success: false,
        message: 'There is not enough stock for this product.',
      };
    }

    item.quantity = newQuantity;

    this.saveCart(cart);

    return {
      success: true,
      message: 'Cart updated.',
    };
  }

  removeItem(productId: string): void {
    const cart = this.getCart();

    cart.items = cart.items.filter((item) => item.productId !== productId);

    if (cart.items.length === 0) {
      this.clearCart();
      return;
    }

    this.saveCart(cart);
  }

  clearCart(): void {
    localStorage.removeItem(CART_KEY);
  }

  getTotalItems(): number {
    return this.getCart().items.reduce((total, item) => total + item.quantity, 0);
  }

  getSubtotal(): number {
    return this.getCart().items.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  private saveCart(cart: ShopCart): void {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }

  private getEmptyCart(): ShopCart {
    return {
      supermarketId: null,
      supermarketName: null,
      items: [],
    };
  }

  private getProductSupermarketId(
    product: Product,
    supermarketOverride?: Supermarket,
  ): string | null {
    if (supermarketOverride?._id) {
      return supermarketOverride._id;
    }

    if (typeof product.supermarketId === 'string') {
      return product.supermarketId;
    }

    return product.supermarketId?._id || null;
  }

  private getProductSupermarketName(
    product: Product,
    supermarketOverride?: Supermarket,
  ): string | null {
    if (supermarketOverride?.name) {
      return supermarketOverride.name;
    }

    if (typeof product.supermarketId === 'string') {
      return null;
    }

    return product.supermarketId?.name || null;
  }
}
