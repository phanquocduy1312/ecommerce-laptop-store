import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
  id: number;
  email: string;
  ho_ten: string;
  vai_tro: number;
}

export interface LoginRequest {
  email: string;
  mat_khau: string;
}

export interface RegisterRequest {
  email: string;
  mat_khau: string;
  go_lai_mat_khau: string;
  ho_ten: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3001/api';
  
  currentUser = signal<User | null>(null);
  currentAdmin = signal<User | null>(null);
  isLoggedIn = signal(false);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadUserFromStorage();
  }

  // Đăng ký
  register(data: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/dangky`, data);
  }

  // Đăng nhập
  login(data: LoginRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/dangnhap`, data).pipe(
      tap((response: any) => {
        if (response.user.vai_tro === 0) {
          this.setUser(response.user);
        } else {
          this.setUserAdmin(response.user);
        }
      })
    );
  }

  // ✅ Đăng xuất USER (chỉ xóa user, giữ admin)
  logout() {
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.isLoggedIn.set(false);
    this.router.navigate(['/']);
  }

  // ✅ Đăng xuất ADMIN (chỉ xóa admin, giữ user)
  logoutAdmin() {
    localStorage.removeItem('admin');
    this.currentAdmin.set(null);
    this.router.navigate(['/admin/login-admin']);
  }

  // Lưu user vào localStorage
  private setUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUser.set(user);
    this.isLoggedIn.set(true);
  }

  // Lưu admin vào localStorage
  private setUserAdmin(user: User) {
    localStorage.setItem('admin', JSON.stringify(user));
    this.currentAdmin.set(user);
    this.isLoggedIn.set(true);
  }

  // Load user từ localStorage khi khởi động
  private loadUserFromStorage() {
    // Load user thường
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUser.set(user);
        this.isLoggedIn.set(true);
      } catch (e) {
        localStorage.removeItem('user');
      }
    }

    // Load admin
    const adminStr = localStorage.getItem('admin');
    if (adminStr) {
      try {
        const admin = JSON.parse(adminStr);
        this.currentAdmin.set(admin);
        this.isLoggedIn.set(true);
      } catch (e) {
        localStorage.removeItem('admin');
      }
    }
  }

  // Get current user
  getUser() {
    return this.currentUser();
  }

  // Get current admin
  getAdmin() {
    return this.currentAdmin();
  }

  // Check if user is admin
  isAdmin(): boolean {
    return this.currentAdmin() !== null;
  }

  // Check if user is regular user
  isUser(): boolean {
    return this.currentUser() !== null;
  }
}
