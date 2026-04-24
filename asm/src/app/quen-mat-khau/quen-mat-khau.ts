import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../services/notification';

@Component({
  selector: 'app-quen-mat-khau',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './quen-mat-khau.html',
  styleUrl: './quen-mat-khau.css',
})
export class QuenMatKhau {
  private apiUrl = 'http://localhost:3000/api';
  
  // Bước hiện tại: 1 = nhập email, 2 = nhập OTP, 3 = đặt mật khẩu mới
  step = signal(1);
  loading = signal(false);
  
  // Form data
  email = '';
  otp = '';
  mat_khau_moi = '';
  xac_nhan_mat_khau = '';
  
  // Countdown timer
  countdown = signal(0);
  canResend = signal(true);

  constructor(
    private http: HttpClient,
    private router: Router,
    private notification: NotificationService
  ) {}

  // Bước 1: Gửi OTP
  sendOTP() {
    if (!this.email) {
      this.notification.error('Vui lòng nhập email');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.notification.error('Email không hợp lệ');
      return;
    }

    this.loading.set(true);
    this.http.post(`${this.apiUrl}/forgot-password/send-otp`, { email: this.email })
      .subscribe({
        next: (response: any) => {
          this.loading.set(false);
          this.notification.success(response.thong_bao);
          this.step.set(2);
          this.startCountdown();
        },
        error: (error) => {
          this.loading.set(false);
          this.notification.error(error.error?.thong_bao || 'Có lỗi xảy ra');
        }
      });
  }

  // Bước 2: Xác thực OTP
  verifyOTP() {
    if (!this.otp) {
      this.notification.error('Vui lòng nhập mã OTP');
      return;
    }

    if (this.otp.length !== 6) {
      this.notification.error('Mã OTP phải có 6 số');
      return;
    }

    this.loading.set(true);
    this.http.post(`${this.apiUrl}/forgot-password/verify-otp`, {
      email: this.email,
      otp: this.otp
    }).subscribe({
      next: (response: any) => {
        this.loading.set(false);
        this.notification.success(response.thong_bao);
        this.step.set(3);
      },
      error: (error) => {
        this.loading.set(false);
        this.notification.error(error.error?.thong_bao || 'Mã OTP không đúng');
      }
    });
  }

  // Bước 3: Đặt lại mật khẩu
  resetPassword() {
    if (!this.mat_khau_moi || !this.xac_nhan_mat_khau) {
      this.notification.error('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    if (this.mat_khau_moi.length < 6) {
      this.notification.error('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    if (this.mat_khau_moi !== this.xac_nhan_mat_khau) {
      this.notification.error('Mật khẩu xác nhận không khớp');
      return;
    }

    this.loading.set(true);
    this.http.post(`${this.apiUrl}/forgot-password/reset-password`, {
      email: this.email,
      otp: this.otp,
      mat_khau_moi: this.mat_khau_moi
    }).subscribe({
      next: (response: any) => {
        this.loading.set(false);
        this.notification.success('Đặt lại mật khẩu thành công! Đang chuyển đến trang đăng nhập...');
        setTimeout(() => {
          this.router.navigate(['/dang-nhap']);
        }, 2000);
      },
      error: (error) => {
        this.loading.set(false);
        this.notification.error(error.error?.thong_bao || 'Có lỗi xảy ra');
      }
    });
  }

  // Gửi lại OTP
  resendOTP() {
    if (!this.canResend()) {
      return;
    }
    this.otp = '';
    this.sendOTP();
  }

  // Đếm ngược 60 giây
  startCountdown() {
    this.canResend.set(false);
    this.countdown.set(60);
    
    const interval = setInterval(() => {
      const current = this.countdown();
      if (current <= 1) {
        clearInterval(interval);
        this.canResend.set(true);
        this.countdown.set(0);
      } else {
        this.countdown.set(current - 1);
      }
    }, 1000);
  }

  // Quay lại bước trước
  goBack() {
    if (this.step() > 1) {
      this.step.set(this.step() - 1);
    }
  }
}
