// sp-hot.ts
import { Component, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../services/product';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sp-hot',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sp-hot.html',
  styleUrl: './sp-hot.css'
})
export class SpHot {
  // Signals - reactive state
  products = signal<Product[]>([]);
  loading = signal(false);
  error = signal('');
  
  // Computed signal - tự động tính toán
  hasProducts = computed(() => this.products().length > 0);
  productCount = computed(() => this.products().length);
  
  constructor(private productService: ProductService) {
    this.loadHotProducts();
  }
  
  loadHotProducts() {    this.loading.set(true);
    this.error.set('');
    
    this.productService.getHotProducts(8).subscribe({
      next: (data) => {
        this.products.set(data);  
        this.loading.set(false);
        console.log(data);
        
      },
      error: (err) => {
        console.error('Lỗi:', err);
        this.error.set('Không thể tải sản phẩm');
        this.loading.set(false);
      }
    });
  }

  getImageUrl(path: string): string {
    if (!path) return '';
    // Nếu đã là URL đầy đủ (http/https), trả về luôn
    if (path.startsWith('http')) return path;
    // Nếu là đường dẫn local, thêm base URL
    return `http://localhost:3001${path}`;
  }
  
}
