import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, User } from '../../services/user';
import { NotificationService } from '../../services/notification';

@Component({
  selector: 'app-nguoi-dung',
  imports: [CommonModule, FormsModule],
  templateUrl: './nguoi-dung.html',
  styleUrl: './nguoi-dung.css',
})
export class NguoiDung implements OnInit {
  users = signal<User[]>([]);
  loading = signal(false);
  
  // Pagination
  currentPage = signal(1);
  totalPages = signal(1);
  totalUsers = signal(0);
  limit = 15;
  
  // Filter
  searchTerm = signal('');
  selectedRole = signal<number | undefined>(undefined);
  
  // Modal
  showModal = signal(false);
  showPasswordModal = signal(false);
  isEditMode = signal(false);
  
  // Form data
  formData = signal<Partial<User> & { mat_khau?: string; go_lai_mat_khau?: string }>({
    email: '',
    ho_ten: '',
    vai_tro: 0,
    mat_khau: '',
    go_lai_mat_khau: ''
  });
  
  selectedUserId = signal<number | null>(null);
  newPassword = signal('');
  confirmPassword = signal('');

  // Expose Math to template
  Math = Math;

  constructor(
    private userService: UserService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading.set(true);
    this.userService.getPaginatedUsers(
      this.currentPage(),
      this.limit,
      this.searchTerm(),
      this.selectedRole()
    ).subscribe({
      next: (response) => {
        this.users.set(response.users);
        this.totalPages.set(response.totalPages);
        this.totalUsers.set(response.total);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Lỗi tải users:', err);
        this.notification.error('Lỗi tải danh sách người dùng');
        this.loading.set(false);
      }
    });
  }

  onSearch(): void {
    this.currentPage.set(1);
    this.loadUsers();
  }

  onRoleFilter(role: number | undefined): void {
    this.selectedRole.set(role);
    this.currentPage.set(1);
    this.loadUsers();
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.loadUsers();
    }
  }

  openAddModal(): void {
    this.isEditMode.set(false);
    this.formData.set({
      email: '',
      ho_ten: '',
      vai_tro: 0,
      mat_khau: '',
      go_lai_mat_khau: ''
    });
    this.showModal.set(true);
  }

  openEditModal(user: User): void {
    this.isEditMode.set(true);
    this.selectedUserId.set(user.id);
    this.formData.set({
      email: user.email,
      ho_ten: user.ho_ten,
      vai_tro: user.vai_tro
    });
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.selectedUserId.set(null);
  }

  saveUser(): void {
    const data = this.formData();
    
    // Validation
    if (!data.email || !data.ho_ten) {
      this.notification.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (!this.isEditMode()) {
      // Thêm mới - cần mật khẩu
      if (!data.mat_khau || !data.go_lai_mat_khau) {
        this.notification.error('Vui lòng nhập mật khẩu');
        return;
      }
      if (data.mat_khau !== data.go_lai_mat_khau) {
        this.notification.error('Mật khẩu không khớp');
        return;
      }

      this.userService.addUser(data as any).subscribe({
        next: () => {
          this.notification.success('Thêm người dùng thành công');
          this.closeModal();
          this.loadUsers();
        },
        error: (err) => {
          console.error('Lỗi thêm user:', err);
          this.notification.error(err.error?.thong_bao || 'Lỗi thêm người dùng');
        }
      });
    } else {
      // Cập nhật
      const id = this.selectedUserId();
      if (!id) return;

      this.userService.updateUser(id, data).subscribe({
        next: () => {
          this.notification.success('Cập nhật người dùng thành công');
          this.closeModal();
          this.loadUsers();
        },
        error: (err) => {
          console.error('Lỗi cập nhật user:', err);
          this.notification.error('Lỗi cập nhật người dùng');
        }
      });
    }
  }

  openPasswordModal(user: User): void {
    this.selectedUserId.set(user.id);
    this.newPassword.set('');
    this.confirmPassword.set('');
    this.showPasswordModal.set(true);
  }

  closePasswordModal(): void {
    this.showPasswordModal.set(false);
    this.selectedUserId.set(null);
  }

  changePassword(): void {
    const id = this.selectedUserId();
    if (!id) return;

    if (!this.newPassword() || !this.confirmPassword()) {
      this.notification.error('Vui lòng nhập mật khẩu');
      return;
    }

    if (this.newPassword() !== this.confirmPassword()) {
      this.notification.error('Mật khẩu không khớp');
      return;
    }

    this.userService.changePassword(id, this.newPassword()).subscribe({
      next: () => {
        this.notification.success('Đổi mật khẩu thành công');
        this.closePasswordModal();
      },
      error: (err) => {
        console.error('Lỗi đổi mật khẩu:', err);
        this.notification.error('Lỗi đổi mật khẩu');
      }
    });
  }

  toggleLockUser(user: User): void {
    const action = user.khoa === 1 ? 'mở khóa' : 'khóa';
    if (!confirm(`Bạn có chắc muốn ${action} người dùng "${user.ho_ten}"?`)) {
      return;
    }

    const newStatus = user.khoa === 1 ? 0 : 1;
    this.userService.toggleLockUser(user.id, newStatus).subscribe({
      next: () => {
        this.notification.success(`${action === 'khóa' ? 'Khóa' : 'Mở khóa'} người dùng thành công`);
        this.loadUsers();
      },
      error: (err) => {
        console.error('Lỗi khóa/mở khóa user:', err);
        this.notification.error(`Lỗi ${action} người dùng`);
      }
    });
  }

  getLockStatusLabel(khoa: number): string {
    return khoa === 1 ? 'Đã khóa' : 'Hoạt động';
  }

  getLockStatusBadgeClass(khoa: number): string {
    return khoa === 1 
      ? 'bg-red-100 text-red-800' 
      : 'bg-green-100 text-green-800';
  }

  getRoleLabel(role: number): string {
    return role === 1 ? 'Admin' : 'Khách hàng';
  }

  getRoleBadgeClass(role: number): string {
    return role === 1 
      ? 'bg-purple-100 text-purple-800' 
      : 'bg-blue-100 text-blue-800';
  }

  getPageNumbers(): number[] {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];
    
    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      if (current <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push(-1);
        pages.push(total);
      } else if (current >= total - 3) {
        pages.push(1);
        pages.push(-1);
        for (let i = total - 4; i <= total; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push(-1);
        for (let i = current - 1; i <= current + 1; i++) pages.push(i);
        pages.push(-1);
        pages.push(total);
      }
    }
    
    return pages;
  }
}
