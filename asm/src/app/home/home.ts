import { Component } from '@angular/core';
import { SpHot } from '../sp-hot/sp-hot';
import { Banner } from '../banner/banner';
import { Thanhmenu } from '../thanhmenu/thanhmenu';
import { SectionSale } from '../section-sale/section-sale';
import { SectionLaptopGaming } from '../section-laptop-gaming/section-laptop-gaming';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SpHot,Banner,Thanhmenu,SectionSale,SectionLaptopGaming],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  // Logic xử lý của trang chủ (nếu có)
}