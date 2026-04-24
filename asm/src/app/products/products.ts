import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ProductService, Product } from '../services/product';
import { CategoryService, Category } from '../services/category';
import { CartService } from '../services/cart';
import { NotificationService } from '../services/notification';

@Component({
  selector: 'app-products',
  imports: [CommonModule, RouterLink],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit {
  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  loading = signal(false);
  currentPage = signal(1);
  totalPages = signal(1);
  totalProducts = signal(0);
  limit = 12;

  // Filter states
  selectedCategories = signal<number[]>([]);
  selectedPriceRange = signal<string>('');
  sortBy = signal<string>('newest');
  searchQuery = signal<string>('');

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private cartService: CartService,
    private notification: NotificationService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadCategories();
    
    // Lấy category từ query params nếu có
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        const categoryId = parseInt(params['category']);
        this.selectedCategories.set([categoryId]);
      }
      this.loadProducts();
    });
  }

  loadCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        this.categories.set(data);
      },
      error: () => {
        this.notification.error('Không thể tải danh mục');
      }
    });
  }

  loadProducts() {
    this.loading.set(true);
    
    const params: any = {
      page: this.currentPage(),
      limit: this.limit,
      sort: this.sortBy()
    };

    if (this.selectedCategories().length > 0) {
      params.categories = this.selectedCategories().join(',');
    }

    if (this.selectedPriceRange()) {
      params.priceRange = this.selectedPriceRange();
    }

    if (this.searchQuery()) {
      params.search = this.searchQuery();
    }

    this.productService.getFilteredProducts(params).subscribe({
      next: (data) => {
        this.products.set(data.products);
        this.totalPages.set(data.totalPages);
        this.totalProducts.set(data.total);
        this.loading.set(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: () => {
        this.loading.set(false);
        this.notification.error('Không thể tải danh sách sản phẩm');
      }
    });
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.loadProducts();
    }
  }

  toggleCategory(categoryId: number) {
    const current = this.selectedCategories();
    if (current.includes(categoryId)) {
      this.selectedCategories.set(current.filter(id => id !== categoryId));
    } else {
      this.selectedCategories.set([...current, categoryId]);
    }
    this.currentPage.set(1);
    this.loadProducts();
  }

  isCategorySelected(categoryId: number): boolean {
    return this.selectedCategories().includes(categoryId);
  }

  getSelectedCategoryName(): string {
    if (this.selectedCategories().length === 1) {
      const category = this.categories().find(c => c.id === this.selectedCategories()[0]);
      return category ? category.ten_loai : 'Laptop & Workstation';
    }
    return 'Laptop & Workstation';
  }

  setPriceRange(range: string) {
    this.selectedPriceRange.set(range);
    this.currentPage.set(1);
    this.loadProducts();
  }

  setSortBy(sort: string) {
    this.sortBy.set(sort);
    this.currentPage.set(1);
    this.loadProducts();
  }

  clearFilters() {
    this.selectedCategories.set([]);
    this.selectedPriceRange.set('');
    this.sortBy.set('newest');
    this.searchQuery.set('');
    this.currentPage.set(1);
    this.loadProducts();
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product, 1);
    this.notification.success(`Đã thêm "${product.ten_sp}" vào giỏ hàng!`);
  }

  getPrice(product: Product): number {
    return product.gia_km && product.gia_km > 0 ? product.gia_km : product.gia;
  }

  hasDiscount(product: Product): boolean {
    return !!(product.gia_km && product.gia_km > 0 && product.gia_km < product.gia);
  }

  getDiscountPercent(product: Product): number {
    if (this.hasDiscount(product)) {
      return Math.round(((product.gia - product.gia_km!) / product.gia) * 100);
    }
    return 0;
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const total = this.totalPages();
    const current = this.currentPage();

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      if (current <= 3) {
        pages.push(1, 2, 3, 4, -1, total);
      } else if (current >= total - 2) {
        pages.push(1, -1, total - 3, total - 2, total - 1, total);
      } else {
        pages.push(1, -1, current - 1, current, current + 1, -1, total);
      }
    }
    return pages;
  }
   getImageUrl(path: string): string {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `http://localhost:3001${path}`;
  }
}
