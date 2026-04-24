import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth';
import { NotificationService } from '../services/notification';

@Component({
  selector: 'app-dang-ky',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './dang-ky.html',
  styleUrl: './dang-ky.css',
})
export class DangKy {
  formData = {
    email: '',
    mat_khau: '',
    go_lai_mat_khau: '',
    ho_ten: ''
  };

  loading = false;

  constructor(
    private authService: AuthService,
    private notification: NotificationService,
    private router: Router
  ) {}

  onSubmit() {
    // Validate
    if (!this.formData.email || !this.formData.mat_khau || !this.formData.ho_ten) {
      this.notification.warning('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    if (this.formData.mat_khau !== this.formData.go_lai_mat_khau) {
      this.notification.error('Mật khẩu không khớp!');
      return;
    }

    if (this.formData.mat_khau.length < 6) {
      this.notification.warning('Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }

    // Call API
    this.authService.register(this.formData).subscribe({
      next: (response) => {
        this.notification.success('Đăng ký thành công! Vui lòng đăng nhập.');
        setTimeout(() => {
          this.router.navigate(['/dang-nhap']);
        }, 1500);
      },
      error: (error) => {
        this.notification.error(error.error?.thong_bao || 'Đăng ký thất bại!');
      }
    });
  }
}
