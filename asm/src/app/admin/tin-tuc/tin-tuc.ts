import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { NewsService, TinTuc, LoaiTin } from '../../services/news';
import { NotificationService } from '../../services/notification';

@Component({
  selector: 'app-tin-tuc-admin',
  imports: [CommonModule, FormsModule, CKEditorModule],
  templateUrl: './tin-tuc.html',
  styleUrl: './tin-tuc.css',
})
export class TinTucAdmin implements OnInit {
  news = signal<TinTuc[]>([]);
  categories = signal<LoaiTin[]>([]);
  loading = signal(false);
  
  // CKEditor
  public Editor = ClassicEditor;
  public editorConfig = {
    toolbar: {
      items: [
        'heading',
        '|',
        'bold',
        'italic',
        'link',
        'bulletedList',
        'numberedList',
        '|',
        'outdent',
        'indent',
        '|',
        'imageUpload',
        'blockQuote',
        'insertTable',
        'mediaEmbed',
        'undo',
        'redo'
      ]
    },
    language: 'vi',
    image: {
      toolbar: [
        'imageTextAlternative',
        'imageStyle:inline',
        'imageStyle:block',
        'imageStyle:side'
      ]
    },
    table: {
      contentToolbar: [
        'tableColumn',
        'tableRow',
        'mergeTableCells'
      ]
    }
  };
  
  // HTML Mode
  showHtmlMode = signal(false);
  htmlContent = signal('');
  
  // Pagination
  currentPage = signal(1);
  totalPages = signal(1);
  totalItems = signal(0);
  limit = 15;
  
  // Filter
  searchTerm = signal('');
  selectedCategory = signal<number | undefined>(undefined);
  selectedHot = signal<number | undefined>(undefined);
  
  // Modal
  showModal = signal(false);
  isEditMode = signal(false);
  
  // Form data
  formData = signal<Partial<TinTuc> & { file?: File }>({
    tieu_de: '',
    slug: '',
    mo_ta: '',
    hinh: '',
    ngay: new Date().toISOString().split('T')[0],
    noi_dung: '',
    id_loai: 0,
    hot: 0,
    an_hien: 1,
    tags: ''
  });
  
  selectedFile: File | null = null;
  previewUrl: string = '';
  selectedNewsId = signal<number | null>(null);

  Math = Math;

  constructor(
    private newsService: NewsService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadNews();
  }

  loadCategories(): void {
    this.newsService.getCategories().subscribe({
      next: (data) => {
        this.categories.set(data);
      },
      error: () => {
        this.notification.error('Không thể tải danh mục tin');
      }
    });
  }

  loadNews(): void {
    this.loading.set(true);
    this.newsService.getPaginatedNews(
      this.currentPage(),
      this.limit,
      this.searchTerm(),
      this.selectedCategory(),
      this.selectedHot()
    ).subscribe({
      next: (response) => {
        this.news.set(response.news);
        this.totalPages.set(response.totalPages);
        this.totalItems.set(response.total);
        this.loading.set(false);
      },
      error: () => {
        this.notification.error('Không thể tải danh sách tin tức');
        this.loading.set(false);
      }
    });
  }

  onSearch(): void {
    this.currentPage.set(1);
    this.loadNews();
  }

  onCategoryFilter(categoryId: number | undefined): void {
    this.selectedCategory.set(categoryId);
    this.currentPage.set(1);
    this.loadNews();
  }

  onHotFilter(hot: number | undefined): void {
    this.selectedHot.set(hot);
    this.currentPage.set(1);
    this.loadNews();
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.loadNews();
    }
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
    return this.newsService.getImageUrl(path);
  }

  toggleHtmlMode(): void {
    if (!this.showHtmlMode()) {
      // Chuyển sang HTML mode
      this.htmlContent.set(this.formData().noi_dung || '');
      this.showHtmlMode.set(true);
    } else {
      // Chuyển về Visual mode
      const currentFormData = this.formData();
      this.formData.set({
        ...currentFormData,
        noi_dung: this.htmlContent()
      });
      this.showHtmlMode.set(false);
    }
  }

  openAddModal(): void {
    this.isEditMode.set(false);
    this.resetForm();
    this.showModal.set(true);
  }

  openEditModal(item: TinTuc): void {
    this.isEditMode.set(true);
    this.selectedNewsId.set(item.id);
    this.formData.set({
      tieu_de: item.tieu_de,
      slug: item.slug,
      mo_ta: item.mo_ta || '',
      hinh: item.hinh,
      ngay: item.ngay,
      noi_dung: item.noi_dung || '',
      id_loai: item.id_loai,
      hot: item.hot,
      an_hien: item.an_hien,
      tags: item.tags || ''
    });
    this.previewUrl = this.getImageUrl(item.hinh);
    this.showModal.set(true);
  }

  deleteNews(item: TinTuc): void {
    if (!confirm(`Bạn có chắc muốn xóa tin "${item.tieu_de}"?`)) {
      return;
    }

    this.newsService.deleteNews(item.id).subscribe({
      next: () => {
        this.notification.success('Xóa tin tức thành công');
        this.loadNews();
      },
      error: () => {
        this.notification.error('Không thể xóa tin tức');
      }
    });
  }

  saveNews(): void {
    // Nếu đang ở HTML mode, cập nhật nội dung trước
    if (this.showHtmlMode()) {
      const currentFormData = this.formData();
      this.formData.set({
        ...currentFormData,
        noi_dung: this.htmlContent()
      });
    }

    const data = this.formData();
    
    if (!data.tieu_de || !data.id_loai) {
      this.notification.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (!this.isEditMode() && !this.selectedFile) {
      this.notification.error('Vui lòng chọn ảnh');
      return;
    }

    const formData = new FormData();
    formData.append('tieu_de', data.tieu_de);
    formData.append('slug', data.slug || '');
    formData.append('mo_ta', data.mo_ta || '');
    formData.append('ngay', data.ngay || '');
    formData.append('noi_dung', data.noi_dung || '');
    formData.append('id_loai', data.id_loai.toString());
    formData.append('hot', data.hot?.toString() || '0');
    formData.append('an_hien', data.an_hien?.toString() || '1');
    formData.append('tags', data.tags || '');

    if (this.selectedFile) {
      formData.append('hinh', this.selectedFile);
    }

    if (this.isEditMode()) {
      const id = this.selectedNewsId();
      if (!id) return;

      this.newsService.updateNews(id, formData).subscribe({
        next: () => {
          this.notification.success('Cập nhật tin tức thành công');
          this.closeModal();
          this.loadNews();
        },
        error: () => {
          this.notification.error('Không thể cập nhật tin tức');
        }
      });
    } else {
      this.newsService.addNews(formData).subscribe({
        next: () => {
          this.notification.success('Thêm tin tức thành công');
          this.closeModal();
          this.loadNews();
        },
        error: () => {
          this.notification.error('Không thể thêm tin tức');
        }
      });
    }
  }

  closeModal(): void {
    this.showModal.set(false);
    this.resetForm();
  }

  resetForm(): void {
    this.formData.set({
      tieu_de: '',
      slug: '',
      mo_ta: '',
      hinh: '',
      ngay: new Date().toISOString().split('T')[0],
      noi_dung: '',
      id_loai: 0,
      hot: 0,
      an_hien: 1,
      tags: ''
    });
    this.selectedFile = null;
    this.previewUrl = '';
    this.selectedNewsId.set(null);
    this.showHtmlMode.set(false);
    this.htmlContent.set('');
  }

  getCategoryName(id: number): string {
    const cat = this.categories().find(c => c.id === id);
    return cat ? cat.ten_loai : 'N/A';
  }

  formatDate(date: string): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('vi-VN');
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
