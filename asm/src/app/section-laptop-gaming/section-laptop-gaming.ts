import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService, Product } from '../services/product';
import { CartService } from '../services/cart';
import { NotificationService } from '../services/notification';

@Component({
  selector: 'app-section-laptop-gaming',
  imports: [CommonModule, RouterLink],
  templateUrl: './section-laptop-gaming.html',
  styleUrl: './section-laptop-gaming.css',
})
export class SectionLaptopGaming implements OnInit {
  products = signal<Product[]>([]);
  loading = signal(false);

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadGamingLaptops();
  }

  loadGamingLaptops(): void {
    this.loading.set(true);
    // Lấy sản phẩm gaming (giả sử có id_loai cho gaming laptops)
    // Hoặc lấy sản phẩm hot
    this.productService.getHotProducts(8).subscribe({
      next: (data) => {
        this.products.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  getImageUrl(path: string): string {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `http://localhost:3001${path}`;
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
    this.notification.success(`Đã thêm ${product.ten_sp} vào giỏ hàng`);
  }
}
