import { Component, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../services/product';
import { CartService } from '../services/cart';
import { NotificationService } from '../services/notification';

@Component({
  selector: 'app-sp',
  imports: [CommonModule, RouterLink],
  templateUrl: './sp.html',
  styleUrl: './sp.css'
})
export class Sp implements OnInit {
  product = signal<Product | null>(null);
  loading = signal(false);
  error = signal('');
  quantity = signal(1);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private notification: NotificationService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = Number(params['id']);
      this.loadProduct(id);
    });
  }

  loadProduct(id: number) {
    this.loading.set(true);
    this.error.set('');

    this.productService.getProductById(id).subscribe({
      next: (data) => {
        this.product.set(data);
        this.loading.set(false);
        console.log(data);
        
      },
      error: () => {
        this.error.set('Không thể tải sản phẩm');
        this.loading.set(false);
      }
    });
  }

  increaseQuantity() {
    this.quantity.update(q => q + 1);
  }

  decreaseQuantity() {
    if (this.quantity() > 1) {
      this.quantity.update(q => q - 1);
    }
  }

  addToCart() {
    const p = this.product();
    if (p) {
      this.cartService.addToCart(p, this.quantity());
      this.notification.success(`Đã thêm ${this.quantity()} sản phẩm vào giỏ hàng!`);
    }
  }

  buyNow() {
    const p = this.product();
    if (p) {
      this.cartService.addToCart(p, this.quantity());
      this.notification.success('Đang chuyển đến giỏ hàng...');
      setTimeout(() => {
        this.router.navigate(['/cart']);
      }, 500);
    }
  }

  goBack() {
    window.history.back();
  }

  getDiscountPercent(): number {
    const p = this.product();
    if (p && p.gia && p.gia_km && p.gia_km > 0) {
      return Math.round(((p.gia - p.gia_km) / p.gia) * 100);
    }
    return 0;
  }

  getImageUrl(path: string): string {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `http://localhost:3001${path}`;
  }
}