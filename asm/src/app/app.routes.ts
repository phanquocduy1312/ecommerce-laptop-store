import { Routes } from '@angular/router';
import { Home } from './home/home';
import { SpTrongLoai } from './sp-trong-loai/sp-trong-loai';
import { DangKy } from './dang-ky/dang-ky';
import { DangNhap } from './dang-nhap/dang-nhap';
import { LienHe } from './lien-he/lien-he';
import { NotFound } from './not-found/not-found';
import { Sp } from './sp/sp';
import { Cart } from './cart/cart';
import { Products } from './products/products';
import { TinTuc } from './tin-tuc/tin-tuc';
import { CheckOut } from './check-out/check-out';
import { OrderSuccess } from './order-success/order-success';
import { Profile } from './profile/profile';
import { OrderDetail } from './order-detail/order-detail';
import { QuenMatKhau } from './quen-mat-khau/quen-mat-khau';
import { Dashboard } from './admin/dashboard/dashboard';
import { AdminLayout } from './admin/admin-layout/admin-layout';
import { loai } from './admin/loai/loai';
import { SanPham } from './admin/san-pham/san-pham';
import { DonHang } from './admin/don-hang/don-hang';
import { NguoiDung } from './admin/nguoi-dung/nguoi-dung';
import { TinTucAdmin } from './admin/tin-tuc/tin-tuc';
import { AdminLoginComponent } from './admin/login-admin/login-admin';
import { adminGuard } from './guards/admin.guard';
import { GioiThieu } from './gioi-thieu/gioi-thieu';

export const routes: Routes = [
  { path: '', component: Home, title: 'Trang chủ' },
  { path: 'gioi-thieu', component: GioiThieu, title: 'Giới thiệu' },
  { path: 'dang-ky', component: DangKy, title: 'Đăng ký thành viên' },
  { path: 'dang-nhap', component: DangNhap, title: 'Đăng nhập hệ thống' },
  { path: 'quen-mat-khau', component: QuenMatKhau, title: 'Quên mật khẩu' },
  { path: 'lien-he', component: LienHe, title: 'Liên hệ' },
  { path: 'sptrongloai/:id', component: SpTrongLoai },
  { path: 'sp/:id', component: Sp },
  { path: 'cart', component: Cart, title: 'giỏ hàng' },
  { path: 'checkout', component: CheckOut, title: 'Thanh toán' },
  { path: 'order-success', component: OrderSuccess, title: 'Đặt hàng thành công' },
  { path: 'products', component: Products, title: 'trang sản phẩm' },
  { path: 'tin-tuc', component: TinTuc, title: 'Tin tức' },
  { path: 'tin-tuc/:id', component: TinTuc, title: 'Chi tiết tin tức' },
  { path: 'profile', component: Profile, title: 'Tài khoản của tôi' },
  { path: 'order-detail/:id', component: OrderDetail, title: 'Chi tiết đơn hàng' },
  
  // Admin login (không cần guard)
  { path: 'admin/login-admin', component: AdminLoginComponent, title: 'Đăng nhập Admin' },
  
  // Admin routes (có guard bảo vệ)
  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: Dashboard, title: 'Admin Dashboard' },
      { path: 'category', component: loai, title: 'Danh mục sản phẩm' },
      { path: 'san-pham', component: SanPham, title: 'Quản lý sản phẩm' },
      { path: 'don-hang', component: DonHang, title: 'Quản lý đơn hàng' },
      { path: 'nguoi-dung', component: NguoiDung, title: 'Quản lý người dùng' },
      { path: 'tin-tuc', component: TinTucAdmin, title: 'Quản lý tin tức' },
    ]
  },
  { path: '**', component: NotFound, title: 'Không tìm thấy trang' },
];  