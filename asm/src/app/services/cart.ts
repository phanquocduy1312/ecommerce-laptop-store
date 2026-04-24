// services/cart.ts
import { Injectable, signal, computed } from '@angular/core';
import { Product } from './product';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = signal<CartItem[]>([]);


  totalItems = computed(() =>
    this.cartItems().reduce((sum, item) => sum + item.quantity, 0)
  );
  totalPrice = computed(() =>
    this.cartItems().reduce((sum, item) => {
      const price = item.product.gia_km || item.product.gia;
      return sum + (price * item.quantity);
    }, 0)
  );

  constructor() {
    this.loadFromLocalStorage();
  }

  // Lấy giỏ hàng
  getCart() {
    return this.cartItems();
  }

  // Thêm vào giỏ
  addToCart(product: Product, quantity: number = 1) {
    const items = this.cartItems();
    const existingItem = items.find(item => item.product.id === product.id);

    if (existingItem) {
      this.cartItems.update(items =>
        items.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      this.cartItems.update(items => [...items, { product, quantity }]);
    }

    this.saveToLocalStorage();
  }

  // Xóa khỏi giỏ
  removeFromCart(productId: number) {
    this.cartItems.update(items =>
      items.filter(item => item.product.id !== productId)
    );
    this.saveToLocalStorage();
  }

  // Update số lượng
  updateQuantity(productId: number, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    this.cartItems.update(items =>
      items.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
    this.saveToLocalStorage();
  }

  // Xóa toàn bộ
  clearCart() {
    this.cartItems.set([]);
    localStorage.removeItem('cart');
  }

  // Lưu localStorage
  private saveToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(this.cartItems()));
  }

  // Load localStorage
  private loadFromLocalStorage() {
    const saved = localStorage.getItem('cart');
    if (saved) {
      try {
        this.cartItems.set(JSON.parse(saved));
      } catch (e) {
        console.error('Lỗi parse cart:', e);
        localStorage.removeItem('cart');
      }
    }
  }
}
