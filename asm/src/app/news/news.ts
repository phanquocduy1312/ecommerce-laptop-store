import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NewsService, TinTuc } from '../services/news';

@Component({
  selector: 'app-news',
  imports: [CommonModule, RouterLink],
  templateUrl: './news.html',
  styleUrl: './news.css',
})
export class News implements OnInit {
  news = signal<TinTuc[]>([]);
  loading = signal(false);

  constructor(private newsService: NewsService) {}

  ngOnInit(): void {
    this.loadHotNews();
  }

  loadHotNews(): void {
    this.loading.set(true);
    this.newsService.getHotNews(3).subscribe({
      next: (data) => {
        this.news.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  getImageUrl(path: string): string {
    return this.newsService.getImageUrl(path);
  }

  formatDate(date: string): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('vi-VN');
  }
}
