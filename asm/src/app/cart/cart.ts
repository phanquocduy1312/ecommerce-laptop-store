import { Component, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../services/cart';
import { NotificationService } from '../services/notification';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart implements OnInit {
  cartItems = computed(() => this.cartService.getCart());
  totalItems = computed(() => this.cartService.totalItems());
  totalPrice = computed(() => this.cartService.totalPrice());

  constructor(
    private cartService: CartService,
    private notification: NotificationService
  ) {}

  ngOnInit() {}

  increaseQuantity(productId: number, currentQty: number) {
    this.cartService.updateQuantity(productId, currentQty + 1);
    this.notification.info('Đã cập nhật số lượng');
  }

  decreaseQuantity(productId: number, currentQty: number) {
    if (currentQty > 1) {
      this.cartService.updateQuantity(productId, currentQty - 1);
      this.notification.info('Đã cập nhật số lượng');
    }
  }

  removeItem(productId: number) {
    if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      this.cartService.removeFromCart(productId);
      this.notification.success('Đã xóa sản phẩm khỏi giỏ hàng');
    }
  }

  clearCart() {
    if (confirm('Bạn có chắc muốn xóa toàn bộ giỏ hàng?')) {
      this.cartService.clearCart();
      this.notification.success('Đã xóa toàn bộ giỏ hàng');
    }
  }

  getItemPrice(item: any): number {
    return item.product.gia_km || item.product.gia;
  }

  getItemTotal(item: any): number {
    return this.getItemPrice(item) * item.quantity;
  }
}
