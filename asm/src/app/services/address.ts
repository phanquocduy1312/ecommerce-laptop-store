import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Province {
  code: number;
  name: string;
  name_en: string;
  full_name: string;
  full_name_en: string;
  code_name: string;
}

export interface District {
  code: number;
  name: string;
  name_en: string;
  full_name: string;
  full_name_en: string;
  code_name: string;
  province_code: number;
}

export interface Ward {
  code: number;
  name: string;
  name_en: string;
  full_name: string;
  full_name_en: string;
  code_name: string;
  district_code: number;
}

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private apiUrl = 'https://provinces.open-api.vn/api';

  constructor(private http: HttpClient) {}

  // Lấy danh sách tỉnh/thành phố
  getProvinces(): Observable<Province[]> {
    return this.http.get<Province[]>(`${this.apiUrl}/p/`);
  }

  // Lấy danh sách quận/huyện theo tỉnh
  getDistricts(provinceCode: number): Observable<{ districts: District[] }> {
    return this.http.get<{ districts: District[] }>(`${this.apiUrl}/p/${provinceCode}?depth=2`);
  }

  // Lấy danh sách phường/xã theo quận
  getWards(districtCode: number): Observable<{ wards: Ward[] }> {
    return this.http.get<{ wards: Ward[] }>(`${this.apiUrl}/d/${districtCode}?depth=2`);
  }
}
