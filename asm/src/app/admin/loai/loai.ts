import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService, Category } from '../../services/category';
import { NotificationService } from '../../services/notification';

@Component({
  selector: 'app-category',
  templateUrl: './loai.html',
  imports: [CommonModule, FormsModule]
})
export class loai implements OnInit {
  categories = signal<Category[]>([]);
  filteredCategories = signal<Category[]>([]);
  
  searchTerm = '';
  statusFilter = 'all';
  
  showModal = signal(false);
  isEditMode = signal(false);
  
  selectedFile: File | null = null;
  previewUrl: string = '';
  
  currentPage = 1;
  totalPages = 1;
  totalItems = 0;
  itemsPerPage = 10;
  
  formData = {
    id: 0,
    ten_loai: '',
    slug: '',
    hinh_icon: '',
    thu_tu: 1,
    an_hien: 1
  };

  constructor(
    private categoryService: CategoryService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getPaginatedCategories(this.currentPage, this.itemsPerPage).subscribe({
      next: (data) => {
        this.categories.set(data.categories);
        this.totalPages = data.totalPages;
        this.totalItems = data.total;
        this.applyFilters();
      },
      error: () => {
        this.notification.error('Không thể tải danh sách danh mục');
      }
    });
  }

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadCategories();
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
    let filtered = this.categories();

    if (this.searchTerm) {
      filtered = filtered.filter(cat => 
        cat.ten_loai.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(cat => 
        cat.an_hien === Number(this.statusFilter)
      );
    }

    this.filteredCategories.set(filtered);
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
    return this.categoryService.getImageUrl(path);
  }

  openAddModal(): void {
    this.isEditMode.set(false);
    this.resetForm();
    this.showModal.set(true);
  }

  editCategory(item: Category): void {
    this.isEditMode.set(true);
    this.formData = {
      id: item.id,
      ten_loai: item.ten_loai,
      slug: item.slug || '',
      hinh_icon: item.hinh_icon,
      thu_tu: item.thu_tu,
      an_hien: item.an_hien
    };
    this.previewUrl = this.getImageUrl(item.hinh_icon);
    this.showModal.set(true);
  }

  deleteCategory(id: number): void {
    if (confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          this.notification.success('Xóa danh mục thành công');
          this.loadCategories();
        },
        error: () => {
          this.notification.error('Không thể xóa danh mục');
        }
      });
    }
  }

  saveCategory(): void {
    if (!this.formData.ten_loai) {
      this.notification.error('Vui lòng nhập tên hãng');
      return;
    }

    if (!this.isEditMode() && !this.selectedFile) {
      this.notification.error('Vui lòng chọn logo');
      return;
    }

    const formData = new FormData();
    formData.append('ten_loai', this.formData.ten_loai);
    formData.append('slug', this.formData.slug || '');
    formData.append('thu_tu', this.formData.thu_tu.toString());
    formData.append('an_hien', this.formData.an_hien.toString());
    
    if (this.selectedFile) {
      formData.append('hinh_icon', this.selectedFile);
    }

    if (this.isEditMode()) {
      this.categoryService.updateCategory(this.formData.id, formData).subscribe({
        next: () => {
          this.notification.success('Cập nhật danh mục thành công');
          this.closeModal();
          this.loadCategories();
        },
        error: () => {
          this.notification.error('Không thể cập nhật danh mục');
        }
      });
    } else {
      this.categoryService.addCategory(formData).subscribe({
        next: () => {
          this.notification.success('Thêm danh mục thành công');
          this.closeModal();
          this.loadCategories();
        },
        error: () => {
          this.notification.error('Không thể thêm danh mục');
        }
      });
    }
  }

  closeModal(): void {
    this.showModal.set(false);
    this.resetForm();
  }

  resetForm(): void {
    this.formData = {
      id: 0,
      ten_loai: '',
      slug: '',
      hinh_icon: '',
      thu_tu: 1,
      an_hien: 1
    };
    this.selectedFile = null;
    this.previewUrl = '';
  }
}
