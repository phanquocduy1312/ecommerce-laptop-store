import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth';
import { NotificationService } from '../services/notification';

@Component({
  selector: 'app-dang-nhap',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './dang-nhap.html',
  styleUrl: './dang-nhap.css',
})
export class DangNhap {
  formData = {
    email: '',
    mat_khau: ''
  };

  loading = false;

  constructor(
    private authService: AuthService,
    private notification: NotificationService,
    private router: Router
  ) {}

  onSubmit() {
    // Validate
    if (!this.formData.email || !this.formData.mat_khau) {
      this.notification.warning('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    // Call API
    this.authService.login(this.formData).subscribe({
      next: (response) => {
        this.notification.success(`Xin chào ${response.user?.ho_ten || 'bạn'}!`);
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1000);
      },
      error: (error) => {
        this.notification.error(error.error?.thong_bao || 'Email hoặc mật khẩu không đúng!');
      }
    });
  }
}
