import { Component, signal, ViewChild, ElementRef } from '@angular/core';
import { Category, CategoryService } from '../services/category';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-thanhmenu',
  imports: [CommonModule, RouterLink],
  templateUrl: './thanhmenu.html',
  styleUrl: './thanhmenu.css',
})
export class Thanhmenu {
  arr_category = signal<Category[]>([]);
  loading = signal(false);
  error = signal('');

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  constructor(private categoryService: CategoryService) {
    this.loadCategories();
  }

  loadCategories() {
    this.loading.set(true);
    this.error.set('');

    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        this.arr_category.set(data);
        this.loading.set(false);
        console.log(data);
      },
      error: (err) => {
        this.error.set(err);
        this.loading.set(false);
        console.log(err);
      }
    });
  }

  // Scroll sang trái
  scrollLeft() {
    const container = this.scrollContainer.nativeElement;
    container.scrollBy({ left: -300, behavior: 'smooth' });
  }

  // Scroll sang phải
  scrollRight() {
    const container = this.scrollContainer.nativeElement;
    container.scrollBy({ left: 300, behavior: 'smooth' });
  }
     getImageUrl(path: string): string {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `http://localhost:3001${path}`;
  }
}
