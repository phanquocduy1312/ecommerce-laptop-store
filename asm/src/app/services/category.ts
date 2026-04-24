import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Category {
  id: number;
  ten_loai: string;
  hinh_icon: string;
  slug?: string;
  thu_tu: number;
  an_hien: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface PaginatedResponse {
  categories: Category[];
  total: number;
  page: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/loai`);
  }

  getPaginatedCategories(page: number = 1, limit: number = 10): Observable<PaginatedResponse> {
    return this.http.get<PaginatedResponse>(`${this.apiUrl}/loai/paginated?page=${page}&limit=${limit}`);
  }

  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/loai/${id}`);
  }

  addCategory(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/loai`, formData);
  }

  updateCategory(id: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/loai/${id}`, formData);
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/loai/${id}`);
  }

  getImageUrl(path: string): string {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `http://localhost:3001${path}`;
  }
}
