import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService, CartItem } from '../services/cart';
import { AuthService } from '../services/auth';
import { NotificationService } from '../services/notification';
import { AddressService, Province, District, Ward } from '../services/address';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-check-out',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './check-out.html',
  styleUrl: './check-out.css',
})
export class CheckOut implements OnInit {
  cartItems = computed(() => this.cartService.getCart());
  totalAmount = computed(() => this.cartService.totalPrice());
  
  formData = {
    ho_ten: '',
    email: '',
    dien_thoai: '',
    dia_chi_chi_tiet: '',
    tinh_thanh: '',
    quan_huyen: '',
    phuong_xa: '',
    ghi_chu: ''
  };

  provinces = signal<Province[]>([]);
  districts = signal<District[]>([]);
  wards = signal<Ward[]>([]);
  
  selectedProvince = signal<number | null>(null);
  selectedDistrict = signal<number | null>(null);
  selectedWard = signal<number | null>(null);

  loading = signal(false);
  private apiUrl = 'http://localhost:3001/api';

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private notification: NotificationService,
    private addressService: AddressService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    // Nếu giỏ hàng trống, chuyển về trang giỏ hàng
    if (this.cartItems().length === 0) {
      this.notification.warning('Giỏ hàng của bạn đang trống!');
      this.router.navigate(['/cart']);
      return;
    }

    // Tự động điền thông tin nếu đã đăng nhập
    const user = this.authService.getUser();
    if (user) {
      this.formData.ho_ten = user.ho_ten;
      this.formData.email = user.email;
    }

    // Load danh sách tỉnh/thành phố
    this.loadProvinces();
  }

  loadProvinces() {
    this.addressService.getProvinces().subscribe({
      next: (data) => this.provinces.set(data),
      error: (err) => console.error('Lỗi load provinces:', err)
    });
  }

  onProvinceChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const code = Number(select.value);
    
    if (code) {
      this.selectedProvince.set(code);
      const province = this.provinces().find(p => p.code === code);
      this.formData.tinh_thanh = province?.name || '';
      
      // Reset quận/huyện và phường/xã
      this.selectedDistrict.set(null);
      this.selectedWard.set(null);
      this.formData.quan_huyen = '';
      this.formData.phuong_xa = '';
      this.wards.set([]);
      
      // Load quận/huyện
      this.addressService.getDistricts(code).subscribe({
        next: (data) => this.districts.set(data.districts),
        error: (err) => console.error('Lỗi load districts:', err)
      });
    } else {
      this.districts.set([]);
      this.wards.set([]);
    }
  }

  onDistrictChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const code = Number(select.value);
    
    if (code) {
      this.selectedDistrict.set(code);
      const district = this.districts().find(d => d.code === code);
      this.formData.quan_huyen = district?.name || '';
      
      // Reset phường/xã
      this.selectedWard.set(null);
      this.formData.phuong_xa = '';
      
      // Load phường/xã
      this.addressService.getWards(code).subscribe({
        next: (data) => this.wards.set(data.wards),
        error: (err) => console.error('Lỗi load wards:', err)
      });
    } else {
      this.wards.set([]);
    }
  }

  onWardChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const code = Number(select.value);
    
    if (code) {
      this.selectedWard.set(code);
      const ward = this.wards().find(w => w.code === code);
      this.formData.phuong_xa = ward?.name || '';
    }
  }

  onSubmit() {
    // Validate
    if (!this.formData.ho_ten || !this.formData.email || !this.formData.dien_thoai) {
      this.notification.warning('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    if (!this.formData.dia_chi_chi_tiet || !this.formData.tinh_thanh || !this.formData.quan_huyen || !this.formData.phuong_xa) {
      this.notification.warning('Vui lòng điền đầy đủ địa chỉ!');
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.formData.email)) {
      this.notification.error('Email không hợp lệ!');
      return;
    }

    // Validate phone
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(this.formData.dien_thoai)) {
      this.notification.error('Số điện thoại không hợp lệ!');
      return;
    }

    this.loading.set(true);

    // Ghép địa chỉ đầy đủ
    const diaChiDayDu = `${this.formData.dia_chi_chi_tiet}, ${this.formData.phuong_xa}, ${this.formData.quan_huyen}, ${this.formData.tinh_thanh}`;

    // Tạo đơn hàng
    const orderData = {
      ho_ten: this.formData.ho_ten,
      email: this.formData.email,
      dien_thoai: this.formData.dien_thoai,
      dia_chi: diaChiDayDu,
      ghi_chu: this.formData.ghi_chu,
      tong_tien: this.totalAmount(),
      chi_tiet: this.cartItems().map((item: CartItem) => ({
        id_sp: item.product.id,
        ten_sp: item.product.ten_sp,
        so_luong: item.quantity,
        gia: (item.product.gia_km || 0) > 0 ? (item.product.gia_km || 0) : item.product.gia
      }))
    };

    this.http.post(`${this.apiUrl}/donhang`, orderData).subscribe({
      next: (response: any) => {
        this.loading.set(false);
        
        // Xóa giỏ hàng
        this.cartService.clearCart();
        
        // Chuyển đến trang thành công với thông tin đơn hàng
        this.router.navigate(['/order-success'], {
          state: {
            orderInfo: {
              id: response.don_hang?.id || 'N/A',
              ho_ten: orderData.ho_ten,
              email: orderData.email,
              dien_thoai: orderData.dien_thoai,
              dia_chi: orderData.dia_chi,
              ghi_chu: orderData.ghi_chu,
              tong_tien: orderData.tong_tien,
              chi_tiet: orderData.chi_tiet
            }
          }
        });
      },
      error: (error) => {
        this.loading.set(false);
        console.error('Lỗi đặt hàng:', error);
        this.notification.error('Đặt hàng thất bại! Vui lòng thử lại.');
      }
    });
  }
}
