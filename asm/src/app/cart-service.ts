import { Injectable } from '@angular/core';
import { Icart, ISanPham } from './cautrucdata';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  themVaoGio(sp: ISanPham) {
    let sp_arr = JSON.parse(localStorage.getItem('cart') || "[]") as Icart[];
    let index = sp_arr.findIndex(s => s.id === sp.id);
    if (index > 0) {
      sp_arr[index].so_luong += 1;
    }
    else {
      let c: Icart = {
        id: sp.id,
        ten_sp: sp.ten_sp,
        so_luong: 1,
        gia_mua: sp.gia,
        hinh: sp.hinh
      }
      sp_arr.push(c)
    }
    localStorage.setItem("cart", JSON.stringify(sp_arr))
    console.log('đã thêm sp');

  }
  suaSL(id: number, so_luong: number) {
    let sp_arr = JSON.parse(localStorage.getItem('cart') || "[]") as Icart[]
    let index = sp_arr.findIndex(sp => sp.id === id)
    if (index !== -1 && so_luong > 0) {
      sp_arr[index].so_luong = so_luong;
    } else if (index !== -1 && so_luong <= 0) {
      sp_arr.slice(index, 1)
    }
    localStorage.setItem('cart', JSON.stringify(sp_arr))
  }
  xoaSP(id: number) {
    let sp_arr = JSON.parse(localStorage.getItem('cart') || "[]") as Icart[]
    let index = sp_arr.findIndex(sp => sp.id === id)
    if (index >= 0) {
      sp_arr.splice(index, 1)
    }
    localStorage.setItem('cart', JSON.stringify(sp_arr))
  }
}
