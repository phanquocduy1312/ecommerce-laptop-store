import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { NewsService, TinTuc as TinTucModel, LoaiTin } from '../services/news';

@Component({
  selector: 'app-tin-tuc',
  imports: [CommonModule, RouterLink],
  templateUrl: './tin-tuc.html',
  styleUrl: './tin-tuc.css',
})
export class TinTuc implements OnInit {
  newsDetail = signal<TinTucModel | null>(null);
  newsList = signal<TinTucModel[]>([]);
  relatedNews = signal<TinTucModel[]>([]);
  categories = signal<LoaiTin[]>([]);
  loading = signal(false);
  isDetailView = signal(false);
  
  // Pagination
  currentPage = signal(1);
  totalPages = signal(1);
  limit = 12;

  constructor(
    private newsService: NewsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.isDetailView.set(true);
        this.loadNewsDetail(Number(id));
      } else {
        this.isDetailView.set(false);
        this.loadNewsList();
      }
    });
  }

  loadCategories(): void {
    this.newsService.getCategories().subscribe({
      next: (data) => {
        this.categories.set(data);
      },
      error: () => {}
    });
  }

  loadNewsList(): void {
    this.loading.set(true);
    this.newsService.getNews(this.currentPage(), this.limit).subscribe({
      next: (response) => {
        this.newsList.set(response.news);
        this.totalPages.set(response.totalPages);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  loadNewsDetail(id: number): void {
    this.loading.set(true);
    this.newsService.getNewsById(id).subscribe({
      next: (data) => {
        this.newsDetail.set(data);
        this.loading.set(false);
        this.loadRelatedNews(id);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  loadRelatedNews(currentId: number): void {
    this.newsService.getRelatedNews(currentId, 4).subscribe({
      next: (data) => {
        this.relatedNews.set(data);
      },
      error: () => {}
    });
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.loadNewsList();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  getImageUrl(path: string): string {
    return this.newsService.getImageUrl(path);
  }

  formatDate(date: string): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('vi-VN');
  }

  getCategoryName(id: number): string {
    const cat = this.categories().find(c => c.id === id);
    return cat ? cat.ten_loai : '';
  }
}
