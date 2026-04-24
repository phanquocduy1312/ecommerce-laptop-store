
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
export interface ThuocTinh {
  id: number;
  id_sp: number;
  cpu?: string;
  ram?: string;
  gpu?: string;
  dia_cung?: string;
  man_hinh?: string;
  pin?: string;
  cong_ket_noi?: string;
  mau_sac?: string;
  can_nang?: string;
}

export interface Product {
  id: number;           
  ten_sp: string;       
  gia: number;         
  gia_km?: number;      
  hinh: string;         
  mo_ta?: string;       
  hot: number;          
  an_hien: number;      
  ngay: string;         
  luot_xem: number;     
  id_loai: number;      
  tinhchat: number;
  thuoc_tinh?: ThuocTinh[];
}

export interface Category {
  // Interface cho Loại sản phẩm (Category)
  
  id: number;
  // ID loại
  
  ten_loai: string;
  // Tên loại: "Laptop", "Điện thoại", "Tablet"...
  
  thu_tu: number;
  // Thứ tự hiển thị
  // VD: 1, 2, 3... (để sắp xếp menu)
  
  an_hien: number;
  // Ẩn/hiện loại này
  // 0 = ẩn, 1 = hiện
}


// ============================================
// 3. DECORATOR @Injectable
// ============================================

@Injectable({
  // Decorator này báo cho Angular:
  // "Đây là service, có thể inject vào component"
  providedIn: 'root',
  // 'root' = Singleton pattern
  // Chỉ có 1 instance duy nhất trong toàn app
  // Tất cả component dùng chung 1 instance này
  // Tiết kiệm bộ nhớ, chia sẻ data dễ dàng
})


// ============================================
// 4. CLASS ProductService
// ============================================

export class ProductService {
  // Class chứa các method để gọi API
  
  
  // ============================================
  // 4.1. KHAI BÁO BIẾN
  // ============================================
  
  private apiUrl = 'http://localhost:3001/api';
  // URL gốc của API backend
  // private = chỉ dùng trong class này
  // Tất cả API đều bắt đầu bằng URL này
  
  
  // ============================================
  // 4.2. CONSTRUCTOR
  // ============================================
  
  constructor(private http: HttpClient) { }
  // Constructor chạy khi service được tạo
  // Inject HttpClient vào service
  // private http = tự động tạo property this.http
  // Giờ có thể dùng this.http.get(), this.http.post()...
  
  
  // ============================================
  // 4.3. METHOD: getHotProducts()
  // ============================================
  
  getHotProducts(sosp: number = 12): Observable<Product[]> {
    // Lấy danh sách sản phẩm HOT
    
    // THAM SỐ:
    // sosp: number = 12
    // - sosp: tên tham số
    // - number: kiểu dữ liệu
    // - = 12: giá trị mặc định (nếu không truyền vào)
    
    // RETURN TYPE:
    // Observable<Product[]>
    // - Observable: kiểu dữ liệu bất đồng bộ
    // - Product[]: mảng các Product
    
    return this.http.get<Product[]>(`${this.apiUrl}/sphot/${sosp}`);
    // this.http.get(): Gọi HTTP GET request
    // <Product[]>: Kiểu dữ liệu trả về
    // Template string: `http://localhost:3001/api/sphot/12`
    // Trả về Observable, chưa thực thi
    // Phải .subscribe() ở component mới chạy
    
    // VÍ DỤ:
    // getHotProducts(8) → GET http://localhost:3001/api/sphot/8
    // getHotProducts() → GET http://localhost:3001/api/sphot/12 (dùng default)
  }
  
  
  // ============================================
  // 4.4. METHOD: getNewProducts()
  // ============================================
  
  getNewProducts(sosp: number = 6): Observable<Product[]> {
    // Lấy danh sách sản phẩm MỚI
    // Tương tự getHotProducts nhưng gọi endpoint khác
    
    return this.http.get<Product[]>(`${this.apiUrl}/spmoi/${sosp}`);
    // GET http://localhost:3001/api/spmoi/6
  }
  
  
  // ============================================
  // 4.5. METHOD: getProductById()
  // ============================================
  
  getProductById(id: number): Observable<Product> {
    // Lấy chi tiết 1 sản phẩm theo ID
    
    // THAM SỐ:
    // id: number - ID sản phẩm cần lấy
    
    // RETURN:
    // Observable<Product> - 1 sản phẩm (không phải mảng)
    
    return this.http.get<Product>(`${this.apiUrl}/sp/${id}`);
    // GET http://localhost:3001/api/sp/5
    
    // VÍ DỤ:
    // getProductById(5) → GET http://localhost:3001/api/sp/5
    // Trả về: { id: 5, ten_sp: "iPhone 15", gia: 25000000, ... }
  }
  
  
  // ============================================
  // 4.6. METHOD: getProductsByCategory()
  // ============================================
  
  getProductsByCategory(idLoai: number): Observable<Product[]> {
    // Lấy tất cả sản phẩm thuộc 1 loại
    
    // THAM SỐ:
    // idLoai: ID của loại sản phẩm
    // VD: 1 = Laptop, 2 = Điện thoại
    
    return this.http.get<Product[]>(`${this.apiUrl}/sptrongloai/${idLoai}`);
    // GET http://localhost:3001/api/sptrongloai/1
    
    // VÍ DỤ:
    // getProductsByCategory(1) → Lấy tất cả Laptop
    // getProductsByCategory(2) → Lấy tất cả Điện thoại
  }
  
  
  // ============================================
  // 4.7. METHOD: getCategories()
  // ============================================
  
  getCategories(): Observable<Category[]> {
    // Lấy danh sách tất cả loại sản phẩm
    
    // KHÔNG CÓ THAM SỐ
    
    // RETURN:
    // Observable<Category[]> - Mảng các Category
    
    return this.http.get<Category[]>(`${this.apiUrl}/loai`);
    // GET http://localhost:3001/api/loai
    
    // Trả về:
    // [
    //   { id: 1, ten_loai: "Laptop", thu_tu: 1, an_hien: 1 },
    //   { id: 2, ten_loai: "Điện thoại", thu_tu: 2, an_hien: 1 }
    // ]
  }
  
  
  // ============================================
  // 4.8. METHOD: getSaleProducts()
  // ============================================
  
  getSaleProducts(soSp: number): Observable<Product[]> {
    // Lấy danh sách sản phẩm SALE (giảm giá)
    
    // THAM SỐ:
    // soSp: Số lượng sản phẩm cần lấy
    
    return this.http.get<Product[]>(`${this.apiUrl}/spsale/${soSp}`);
    // GET http://localhost:3001/api/spsale/10
    
    // VÍ DỤ:
    // getSaleProducts(10) → Lấy 10 sản phẩm đang sale
  }

  // ============================================
  // 4.9. METHOD: getAllProducts()
  // ============================================
  
  getAllProducts(page: number = 1, limit: number = 12): Observable<any> {
    // Lấy tất cả sản phẩm với phân trang
    
    return this.http.get<any>(`${this.apiUrl}/sanpham?page=${page}&limit=${limit}`);
    // GET http://localhost:3001/api/sanpham?page=1&limit=12
    
    // Trả về:
    // {
    //   products: Product[],
    //   total: number,
    //   page: number,
    //   totalPages: number
    // }
  }

  getFilteredProducts(params: any): Observable<any> {
    // Lấy sản phẩm với bộ lọc
    const queryParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key]) {
        queryParams.append(key, params[key].toString());
      }
    });
    
    return this.http.get<any>(`${this.apiUrl}/sanpham?${queryParams.toString()}`);
  }

  // ============================================
  // ADMIN METHODS
  // ============================================

  getPaginatedProducts(page: number = 1, limit: number = 12): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/sanpham/paginated?page=${page}&limit=${limit}`);
  }

  addProduct(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/sanpham`, formData);
  }

  updateProduct(id: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/sanpham/${id}`, formData);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/sanpham/${id}`);
  }
}
