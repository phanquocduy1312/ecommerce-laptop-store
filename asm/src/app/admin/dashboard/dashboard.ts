import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalCategories: number;
  totalUsers: number;
  recentOrders: any[];
  topProducts: any[];
  revenueByMonth: any[];
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  stats = signal<DashboardStats>({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalCategories: 0,
    totalUsers: 0,
    recentOrders: [],
    topProducts: [],
    revenueByMonth: []
  });

  loading = signal(true);

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.http.get<DashboardStats>(`${environment.apiUrl}/dashboard/stats`).subscribe({
      next: (data) => {
        this.stats.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Lỗi tải dashboard:', err);
        this.loading.set(false);
      }
    });
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  getStatusLabel(status: number): string {
    const labels: { [key: number]: string } = {
      0: 'Chờ xử lý',
      1: 'Đã xác nhận',
      2: 'Đang giao',
      3: 'Hoàn thành',
      4: 'Đã hủy'
    };
    return labels[status] || 'N/A';
  }

  getStatusColor(status: number): string {
    const colors: { [key: number]: string } = {
      0: 'bg-yellow-100 text-yellow-800',
      1: 'bg-blue-100 text-blue-800',
      2: 'bg-purple-100 text-purple-800',
      3: 'bg-green-100 text-green-800',
      4: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  }

  getImageUrl(path: string): string {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `http://localhost:3001${path}`;
  }
}

