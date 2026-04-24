import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { AuthService } from '../services/auth';
import { OrderService, Order } from '../services/order';
import { NotificationService } from '../services/notification';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  user = computed(() => this.authService.currentUser());
  orders = signal<Order[]>([]);
  loading = signal(false);
  activeTab = signal<'info' | 'orders' | 'password'>('orders');
  
  // Form states
  editMode = signal(false);
  profileForm: FormGroup;
  passwordForm: FormGroup;
  savingProfile = signal(false);
  changingPassword = signal(false);

  // Statistics
  totalOrders = computed(() => this.orders().length);
  pendingOrders = computed(() => this.orders().filter(o => o.trang_thai === 0).length);
  shippingOrders = computed(() => this.orders().filter(o => o.trang_thai === 2).length);
  completedOrders = computed(() => this.orders().filter(o => o.trang_thai === 3).length);
  totalSpent = computed(() => 
    this.orders()
      .filter(o => o.trang_thai !== 4)
      .reduce((sum, o) => sum + o.tong_tien, 0)
  );

  constructor(
    private authService: AuthService,
    private orderService: OrderService,
    private notification: NotificationService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      ho_ten: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      so_dien_thoai: ['', [Validators.pattern(/^[0-9]{10}$/)]],
      dia_chi: ['']
    });

    this.passwordForm = this.fb.group({
      mat_khau_cu: ['', Validators.required],
      mat_khau_moi: ['', [Validators.required, Validators.minLength(6)]],
      xac_nhan_mat_khau: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    const user = this.user();
    if (!user) {
      this.router.navigate(['/dang-nhap']);
      return;
    }
    
    // Load user info into form
    this.profileForm.patchValue({
      ho_ten: user.ho_ten,
      email: user.email
    });

    this.loadOrders(user.email);
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('mat_khau_moi')?.value === g.get('xac_nhan_mat_khau')?.value
      ? null : { mismatch: true };
  }

  loadOrders(email: string) {
    this.loading.set(true);
    this.orderService.getUserOrders(email).subscribe({
      next: (data) => {
        this.orders.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.notification.error('Không thể tải danh sách đơn hàng');
      }
    });
  }

  setActiveTab(tab: 'info' | 'orders' | 'password') {
    this.activeTab.set(tab);
  }

  toggleEditMode() {
    this.editMode.set(!this.editMode());
  }

  saveProfile() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.savingProfile.set(true);
    
    // Giả lập API call
    setTimeout(() => {
      this.savingProfile.set(false);
      this.editMode.set(false);
      this.notification.success('Cập nhật thông tin thành công!');
    }, 1000);
  }

  changePassword() {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.changingPassword.set(true);
    
    // Giả lập API call
    setTimeout(() => {
      this.changingPassword.set(false);
      this.passwordForm.reset();
      this.notification.success('Đổi mật khẩu thành công!');
    }, 1000);
  }

  logout() {
    this.authService.logout();
  }

  getStatusText(status: number): string {
    return this.orderService.getStatusText(status);
  }

  getStatusColor(status: number): string {
    return this.orderService.getStatusColor(status);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  isFieldInvalid(formGroup: FormGroup, fieldName: string): boolean {
    const field = formGroup.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}
