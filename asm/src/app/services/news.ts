import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LoaiTin {
  id: number;
  ten_loai: string;
  slug?: string;
  thu_tu: number;
  an_hien: number;
}

export interface TinTuc {
  id: number;
  tieu_de: string;
  slug: string;
  mo_ta?: string;
  hinh: string;
  ngay: string;
  noi_dung?: string;
  id_loai: number;
  luot_xem: number;
  hot: number;
  an_hien: number;
  tags?: string;
  loai_tin?: LoaiTin;
}

export interface NewsPaginationResponse {
  news: TinTuc[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  constructor(private http: HttpClient) {}

  // Lấy danh sách loại tin
  getCategories(): Observable<LoaiTin[]> {
    return this.http.get<LoaiTin[]>(`${environment.apiUrl}/loaitin`);
  }

  // Lấy tin tức có phân trang (Admin)
  getPaginatedNews(page: number = 1, limit: number = 15, search: string = '', categoryId?: number, hot?: number): Observable<NewsPaginationResponse> {
    let url = `${environment.apiUrl}/tintuc/admin?page=${page}&limit=${limit}`;
    if (search) url += `&search=${search}`;
    if (categoryId) url += `&categoryId=${categoryId}`;
    if (hot !== undefined) url += `&hot=${hot}`;
    return this.http.get<NewsPaginationResponse>(url);
  }

  // Lấy tin tức hot (trang chủ)
  getHotNews(limit: number = 6): Observable<TinTuc[]> {
    return this.http.get<TinTuc[]>(`${environment.apiUrl}/tintuchot/${limit}`);
  }

  // Lấy tin tức công khai (có phân trang)
  getNews(page: number = 1, limit: number = 12): Observable<NewsPaginationResponse> {
    return this.http.get<NewsPaginationResponse>(`${environment.apiUrl}/tintuc?page=${page}&limit=${limit}`);
  }

  // Lấy tin tức liên quan
  getRelatedNews(id: number, limit: number = 4): Observable<TinTuc[]> {
    return this.http.get<TinTuc[]>(`${environment.apiUrl}/tintuc/${id}/lienquan?limit=${limit}`);
  }

  // Lấy tin tức theo ID
  getNewsById(id: number): Observable<TinTuc> {
    return this.http.get<TinTuc>(`${environment.apiUrl}/tintuc/${id}`);
  }

  // Thêm tin tức mới
  addNews(formData: FormData): Observable<any> {
    return this.http.post(`${environment.apiUrl}/tintuc`, formData);
  }

  // Cập nhật tin tức
  updateNews(id: number, formData: FormData): Observable<any> {
    return this.http.put(`${environment.apiUrl}/tintuc/${id}`, formData);
  }

  // Xóa tin tức
  deleteNews(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/tintuc/${id}`);
  }

  // Get image URL
  getImageUrl(path: string): string {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${environment.apiUrl.replace('/api', '')}${path}`;
  }
}
