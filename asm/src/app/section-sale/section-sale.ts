import { Component, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../services/product';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-section-sale',
  imports: [CommonModule, RouterLink],
  templateUrl: './section-sale.html',
  styleUrl: './section-sale.css',
})
export class SectionSale implements OnDestroy {
  arr_sp = signal<Product[]>([]);
  loading = signal(false);
  error = signal('');
  
  // Countdown timer signals
  hours = signal(2);
  minutes = signal(45);
  seconds = signal(12);
  
  private intervalId: any;
  
  constructor(private productService: ProductService) {
    this.loadSaleProduct();
    this.startCountdown();
  }
  
  loadSaleProduct() {
    this.loading.set(true);
    this.error.set('');
    
    this.productService.getSaleProducts(5).subscribe({
      next: (data) => {
        this.arr_sp.set(data);
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
  
  startCountdown() {
    // Chạy mỗi giây
    this.intervalId = setInterval(() => {
      let h = this.hours();
      let m = this.minutes();
      let s = this.seconds();
      
      // Giảm giây
      s--;
      
      // Nếu giây < 0, reset về 59 và giảm phút
      if (s < 0) {
        s = 59;
        m--;
        
        // Nếu phút < 0, reset về 59 và giảm giờ
        if (m < 0) {
          m = 59;
          h--;
          
          // Nếu giờ < 0, reset lại countdown
          if (h < 0) {
            h = 2;
            m = 45;
            s = 12;
          }
        }
      }
      
      // Update signals
      this.hours.set(h);
      this.minutes.set(m);
      this.seconds.set(s);
    }, 1000);
  }
  
  ngOnDestroy() {
    // Clear interval khi component bị destroy
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
  
  // Format số thành 2 chữ số (01, 02, 03...)
  formatTime(value: number): string {
    return value.toString().padStart(2, '0');
  }

  getImageUrl(path: string): string {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `http://localhost:3001${path}`;
  }
}
