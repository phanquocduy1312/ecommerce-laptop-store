import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product';
import { CategoryService, Category } from '../../services/category';
import { NotificationService } from '../../services/notification';

export interface Product {
  id: number;
  ten_sp: string;
  gia: number;
  gia_km: number;
  hinh: string;
  ngay: Date;
  mo_ta: string;
  luot_xem: number;
  hot: number;
  an_hien: number;
  id_loai: number;
}

export interface PaginatedProductResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}

@Component({
  selector: 'app-san-pham',
  templateUrl: './san-pham.html',
  imports: [CommonModule, FormsModule]
})
export class SanPham implements OnInit {
  products = signal<Product[]>([]);
  filteredProducts = signal<Product[]>([]);
  categories = signal<Category[]>([]);

  searchTerm = '';
  categoryFilter = 'all';
  statusFilter = 'all';
  hotFilter = 'all';

  showModal = signal(false);
  isEditMode = signal(false);

  selectedFile: File | null = null;
  previewUrl: string = '';

  currentPage = 1;
  totalPages = 1;
  totalItems = 0;
  itemsFilter = 10;
  itemsPerPage = this.itemsFilter;

  formData = {
    id: 0,
    ten_sp: '',
    gia: 0,
    gia_km: 0,
    hinh: '',
    mo_ta: '',
    id_loai: 0,
    hot: 0,
    an_hien: 1
  };

  specsData = {
    cpu: '',
    ram: '',
    gpu: '',
    dia_cung: '',
    man_hinh: '',
    pin: '',
    cong_ket_noi: '',
    mau_sac: '',
    can_nang: ''
  };

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private notification: NotificationService
  ) { }

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        this.categories.set(data);
      },
      error: () => {
        this.notification.error('Không thể tải danh mục');
      }
    });
  }

  loadProducts(): void {
    this.productService.getPaginatedProducts(this.currentPage, this.itemsPerPage).subscribe({
      next: (data) => {
        this.products.set(data.products);
        this.totalPages = data.totalPages;
        this.totalItems = data.total;
        this.applyFilters();
      },
      error: () => {
        this.notification.error('Không thể tải danh sách sản phẩm');
      }
    });
  }

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadProducts();
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  applyFilters(): void {
    let filtered = this.products();

    if (this.searchTerm) {
      filtered = filtered.filter(p =>
        p.ten_sp.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    if (this.categoryFilter !== 'all') {
      filtered = filtered.filter(p => p.id_loai === Number(this.categoryFilter));
    }

    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(p => p.an_hien === Number(this.statusFilter));
    }

    if (this.hotFilter !== 'all') {
      filtered = filtered.filter(p => p.hot === Number(this.hotFilter));
    }

    this.filteredProducts.set(filtered);
  }

  onSearch(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  getImageUrl(path: string): string {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `http://localhost:3001${path}`;
  }

  getCategoryName(id_loai: number): string {
    const cat = this.categories().find(c => c.id === id_loai);
    return cat ? cat.ten_loai : 'N/A';
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  }

  calculateDiscount(gia: number, gia_km: number): number {
    if (!gia_km || gia_km >= gia) return 0;
    return Math.round(((gia - gia_km) / gia) * 100);
  }

  openAddModal(): void {
    this.isEditMode.set(false);
    this.resetForm();
    this.showModal.set(true);
  }

  editProduct(item: Product): void {
    this.isEditMode.set(true);
    this.formData = {
      id: item.id,
      ten_sp: item.ten_sp,
      gia: item.gia,
      gia_km: item.gia_km,
      hinh: item.hinh,
      mo_ta: item.mo_ta,
      id_loai: item.id_loai,
      hot: item.hot,
      an_hien: item.an_hien
    };
    this.previewUrl = this.getImageUrl(item.hinh);

    // Load specs if exists
    this.loadProductSpecs(item.id);

    this.showModal.set(true);
  }

  loadProductSpecs(productId: number): void {
    this.productService.getProductById(productId).subscribe({
      next: (product: any) => {
        if (product.thuoc_tinh && product.thuoc_tinh.length > 0) {
          const specs = product.thuoc_tinh[0];
          this.specsData = {
            cpu: specs.cpu || '',
            ram: specs.ram || '',
            gpu: specs.gpu || '',
            dia_cung: specs.dia_cung || '',
            man_hinh: specs.man_hinh || '',
            pin: specs.pin || '',
            cong_ket_noi: specs.cong_ket_noi || '',
            mau_sac: specs.mau_sac || '',
            can_nang: specs.can_nang || ''
          };
        }
      }
    });
  }

  deleteProduct(id: number): void {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.notification.success('Xóa sản phẩm thành công');
          this.loadProducts();
        },
        error: () => {
          this.notification.error('Không thể xóa sản phẩm');
        }
      });
    }
  }

  saveProduct(): void {
    if (!this.formData.ten_sp || !this.formData.gia || !this.formData.id_loai) {
      this.notification.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    if (!this.isEditMode() && !this.selectedFile) {
      this.notification.error('Vui lòng chọn hình ảnh sản phẩm');
      return;
    }

    const formData = new FormData();
    formData.append('ten_sp', this.formData.ten_sp);
    formData.append('gia', this.formData.gia.toString());
    formData.append('gia_km', this.formData.gia_km.toString());
    formData.append('mo_ta', this.formData.mo_ta);
    formData.append('id_loai', this.formData.id_loai.toString());
    formData.append('hot', this.formData.hot.toString());
    formData.append('an_hien', this.formData.an_hien.toString());

    // Add specs data
    formData.append('specs', JSON.stringify(this.specsData));

    if (this.selectedFile) {
      formData.append('hinh', this.selectedFile);
    }

    if (this.isEditMode()) {
      this.productService.updateProduct(this.formData.id, formData).subscribe({
        next: () => {
          this.notification.success('Cập nhật sản phẩm thành công');
          this.closeModal();
          this.loadProducts();
        },
        error: () => {
          this.notification.error('Không thể cập nhật sản phẩm');
        }
      });
    } else {
      this.productService.addProduct(formData).subscribe({
        next: () => {
          this.notification.success('Thêm sản phẩm thành công');
          this.closeModal();
          this.loadProducts();
        },
        error: () => {
          this.notification.error('Không thể thêm sản phẩm');
        }
      });
    }
  }
  onItemsChange() {

    this.itemsPerPage = this.itemsFilter;  // ✅ Cập nhật itemsPerPage
    this.currentPage = 1;  // Reset về trang 1

    this.loadProducts()
  }
  closeModal(): void {
    this.showModal.set(false);
    this.resetForm();
  }

  resetForm(): void {
    this.formData = {
      id: 0,
      ten_sp: '',
      gia: 0,
      gia_km: 0,
      hinh: '',
      mo_ta: '',
      id_loai: 0,
      hot: 0,
      an_hien: 1
    };
    this.specsData = {
      cpu: '',
      ram: '',
      gpu: '',
      dia_cung: '',
      man_hinh: '',
      pin: '',
      cong_ket_noi: '',
      mau_sac: '',
      can_nang: ''
    };
    this.selectedFile = null;
    this.previewUrl = '';
  }
}
