import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { OrderService, Order } from '../services/order';
import { NotificationService } from '../services/notification';

@Component({
  selector: 'app-order-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './order-detail.html',
  styleUrl: './order-detail.css',
})
export class OrderDetail implements OnInit {
  order = signal<Order | null>(null);
  loading = signal(false);

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private notification: NotificationService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadOrder(id);
    }
  }

  loadOrder(id: number) {
    this.loading.set(true);
    this.orderService.getOrderById(id).subscribe({
      next: (data) => {
        this.order.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.notification.error('Không thể tải thông tin đơn hàng');
      }
    });
  }

  getStatusText(status: number): string {
    return this.orderService.getStatusText(status);
  }

  getStatusColor(status: number): string {
    return this.orderService.getStatusColor(status);
  }

  getStatusIcon(status: number): string {
    const iconMap: { [key: number]: string } = {
      0: 'schedule',
      1: 'check_circle',
      2: 'local_shipping',
      3: 'done_all',
      4: 'cancel'
    };
    return iconMap[status] || 'help';
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  calculateSubtotal(): number {
    const o = this.order();
    if (!o || !o.chi_tiet) return 0;
    return o.chi_tiet.reduce((sum, item) => sum + (item.gia * item.so_luong), 0);
  }
}
