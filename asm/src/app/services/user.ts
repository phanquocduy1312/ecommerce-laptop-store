import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
  id: number;
  email: string;
  ho_ten: string;
  vai_tro: number;
  khoa: number;
}

export interface UserPaginationResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}

  // Lấy danh sách user có phân trang
  getPaginatedUsers(page: number = 1, limit: number = 15, search: string = '', role?: number): Observable<UserPaginationResponse> {
    let url = `${environment.apiUrl}/users/admin?page=${page}&limit=${limit}`;
    if (search) url += `&search=${search}`;
    if (role !== undefined) url += `&role=${role}`;
    return this.http.get<UserPaginationResponse>(url);
  }

  // Thêm user mới
  addUser(user: Partial<User> & { mat_khau: string }): Observable<any> {
    return this.http.post(`${environment.apiUrl}/users`, user);
  }

  // Cập nhật user
  updateUser(id: number, user: Partial<User>): Observable<any> {
    return this.http.put(`${environment.apiUrl}/users/${id}`, user);
  }

  // Xóa user
  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/users/${id}`);
  }

  // Đổi mật khẩu
  changePassword(id: number, mat_khau: string): Observable<any> {
    return this.http.put(`${environment.apiUrl}/users/${id}/password`, { mat_khau });
  }

  // Khóa/Mở khóa user
  toggleLockUser(id: number, khoa: number): Observable<any> {
    return this.http.put(`${environment.apiUrl}/users/${id}/lock`, { khoa });
  }
}
