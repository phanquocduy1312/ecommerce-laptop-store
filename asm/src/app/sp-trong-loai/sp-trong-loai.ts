import { Component, OnInit,signal } from '@angular/core';
import { ILoai, ISanPham } from '../cautrucdata';
import { CommonModule, } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sp-trong-loai',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sp-trong-loai.html',
  styleUrl: './sp-trong-loai.css'
})
export class SpTrongLoai implements OnInit {
  constructor(private route: ActivatedRoute) { }
  
  sp_arr =signal<ISanPham[]>([]) ;
  id: number = 0;
  loai: ILoai = {} as ILoai;

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    
    // Lấy danh sách sản phẩm theo loại
    fetch(`http://localhost:3000/api/sptrongloai/${this.id}`)
      .then(res => res.json())
      .then(data => {
        this.sp_arr.set(data as ISanPham[])
      })
      .catch(error => console.error('Lỗi khi fetch SP trong loại:', error));

    // Lấy thông tin tên loại
    fetch(`http://localhost:3000/api/loai/${this.id}`)
      .then(res => res.json())
      .then(data => {
        this.loai = data as ILoai;
      })
      .catch(error => console.error('Lỗi khi fetch Loai:', error));
  }
}