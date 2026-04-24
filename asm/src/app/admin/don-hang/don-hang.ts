import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderService, Order, OrderDetail } from '../../services/order';
import { NotificationService } from '../../services/notification';

@Component({
  selector: 'app-don-hang',
  templateUrl: './don-hang.html',
  imports: [CommonModule, FormsModule]
})
export class DonHang implements OnInit {
  orders = signal<Order[]>([]);
  filteredOrders = signal<Order[]>([]);
  
  searchTerm = '';
  statusFilter = 'all';
  
  showDetailModal = signal(false);
  selectedOrder = signal<Order | null>(null);
  
  currentPage = 1;
  totalPages = 1;
  totalItems = 0;
  itemsPerPage = 15;
  
  statusLabels: { [key: number]: string } = {
    0: 'Chờ xử lý',
    1: 'Đã xác nhận',
    2: 'Đang giao',
    3: 'Hoàn thành',
    4: 'Đã hủy'
  };

  statusColors: { [key: number]: string } = {
    0: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    1: 'bg-blue-50 text-blue-700 border-blue-200',
    2: 'bg-purple-50 text-purple-700 border-purple-200',
    3: 'bg-green-50 text-green-700 border-green-200',
    4: 'bg-red-50 text-red-700 border-red-200'
  };

  constructor(
    private orderService: OrderService,
    private notification: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getAllOrders(this.currentPage, this.itemsPerPage).subscribe({
      next: (data) => {
        this.orders.set(data.orders);
        this.totalPages = data.totalPages;
        this.totalItems = data.total;
        this.applyFilters();
      },
      error: () => {
        this.notification.error('Không thể tải danh sách đơn hàng');
      }
    });
  }

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadOrders();
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);
    
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  applyFilters(): void {
    let filtered = this.orders();

    if (this.searchTerm) {
      filtered = filtered.filter(o => 
        o.ho_ten.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        o.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        o.dien_thoai.includes(this.searchTerm)
      );
    }

    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(o => o.trang_thai === Number(this.statusFilter));
    }

    this.filteredOrders.set(filtered);
  }

  onSearch(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getOrderDate(order: Order): string {
    return this.formatDate(order.ngay || order.thoi_diem_mua);
  }

  viewOrderDetail(order: Order): void {
    this.orderService.getOrderById(order.id).subscribe({
      next: (data) => {
        this.selectedOrder.set(data);
        this.showDetailModal.set(true);
      },
      error: () => {
        this.notification.error('Không thể tải chi tiết đơn hàng');
      }
    });
  }

  updateOrderStatus(orderId: number, newStatus: number): void {
    this.orderService.updateOrderStatus(orderId, newStatus).subscribe({
      next: () => {
        this.notification.success('Cập nhật trạng thái thành công');
        this.loadOrders();
        
        // Update selected order if modal is open
        const selected = this.selectedOrder();
        if (selected && selected.id === orderId) {
          selected.trang_thai = newStatus;
          this.selectedOrder.set({...selected});
        }
      },
      error: () => {
        this.notification.error('Không thể cập nhật trạng thái');
      }
    });
  }

  deleteOrder(id: number): void {
    if (confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) {
      this.orderService.deleteOrder(id).subscribe({
        next: () => {
          this.notification.success('Xóa đơn hàng thành công');
          this.loadOrders();
        },
        error: () => {
          this.notification.error('Không thể xóa đơn hàng');
        }
      });
    }
  }

  closeDetailModal(): void {
    this.showDetailModal.set(false);
    this.selectedOrder.set(null);
  }

  getImageUrl(path: string): string {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `http://localhost:3001${path}`;
  }

  getTotalQuantity(order: Order): number {
    if (!order.chi_tiet) return 0;
    return order.chi_tiet.reduce((sum, item) => sum + item.so_luong, 0);
  }
}
