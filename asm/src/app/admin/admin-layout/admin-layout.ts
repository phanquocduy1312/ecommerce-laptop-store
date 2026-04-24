import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-admin-layout',
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout {
  sidebarOpen = signal(true);
  
  menuItems = [
    { icon: 'dashboard', label: 'Dashboard', route: '/admin/dashboard' },
    { icon: 'inventory_2', label: 'Sản phẩm', route: '/admin/san-pham' },
    { icon: 'category', label: 'Danh mục', route: '/admin/category' },
    { icon: 'shopping_cart', label: 'Đơn hàng', route: '/admin/don-hang' },
    { icon: 'people', label: 'Người dùng', route: '/admin/nguoi-dung' },
    { icon: 'article', label: 'Tin tức', route: '/admin/tin-tuc' },
  ];

  // Computed để lấy currentAdmin
  currentAdmin = computed(() => this.authService.currentAdmin());

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  toggleSidebar() {
    this.sidebarOpen.set(!this.sidebarOpen());
  }

  logout() {
    this.authService.logoutAdmin();
  }
}
