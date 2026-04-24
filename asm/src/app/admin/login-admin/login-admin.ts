import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { NotificationService } from '../../services/notification';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-admin.html',
})
export class AdminLoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  loading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  showPassword = signal<boolean>(false);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    mat_khau: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false]
  });

  ngOnInit() {
    // Nếu đã đăng nhập admin rồi thì chuyển về dashboard
    if (this.authService.isAdmin()) {
      this.router.navigate(['/admin/dashboard']);
    }
  }

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  isFieldInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    const { email, mat_khau } = this.loginForm.value;

    this.authService.login({ email, mat_khau }).subscribe({
      next: (response) => {
        this.loading.set(false);
        
        // Kiểm tra vai_tro phải là admin (vai_tro = 1)
        if (response.user.vai_tro === 1) {
          this.notificationService.success('Đăng nhập admin thành công!');
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.errorMessage.set('Tài khoản này không có quyền truy cập admin!');
          this.authService.logout(); // Xóa thông tin đăng nhập
        }
      },
      error: (error) => {
        this.loading.set(false);
        this.errorMessage.set(error.error?.message || 'Sai email hoặc mật khẩu!');
        this.notificationService.error('Đăng nhập thất bại!');
      }
    });
  }
}