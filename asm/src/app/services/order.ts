import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from './product';
import { environment } from '../../environments/environment';

export interface OrderDetail {
  id: number;
  id_dh: number;
  id_sp: number;
  so_luong: number;
  gia: number;
  san_pham?: Product;
}

export interface Order {
  id: number;
  ho_ten: string;
  email: string;
  dien_thoai: string;
  dia_chi: string;
  ghi_chu?: string;
  tong_tien: number;
  trang_thai: number;
  ngay?: string;
  thoi_diem_mua?: string;
  chi_tiet?: OrderDetail[];
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getUserOrders(email: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/donhang/user/${email}`);
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/donhang/${id}`);
  }

  getStatusText(status: number): string {
    const statusMap: { [key: number]: string } = {
      0: 'Chờ xử lý',
      1: 'Đã xác nhận',
      2: 'Đang giao hàng',
      3: 'Đã giao hàng',
      4: 'Đã hủy'
    };
    return statusMap[status] || 'Không xác định';
  }

  getStatusColor(status: number): string {
    const colorMap: { [key: number]: string } = {
      0: 'bg-yellow-100 text-yellow-800',
      1: 'bg-blue-100 text-blue-800',
      2: 'bg-purple-100 text-purple-800',
      3: 'bg-green-100 text-green-800',
      4: 'bg-red-100 text-red-800'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  }

  // Admin methods
  getAllOrders(page: number = 1, limit: number = 15): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/donhang/admin?page=${page}&limit=${limit}`);
  }

  updateOrderStatus(orderId: number, status: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/donhang/${orderId}/status`, { trang_thai: status });
  }

  deleteOrder(orderId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/donhang/${orderId}`);
  }
}
