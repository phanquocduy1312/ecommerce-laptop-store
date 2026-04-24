import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order-success',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-success.html',
  styleUrl: './order-success.css',
})
export class OrderSuccess implements OnInit {
  orderInfo = signal<any>(null);

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Lấy thông tin đơn hàng từ state
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state || history.state;
    
    if (state && state['orderInfo']) {
      this.orderInfo.set(state['orderInfo']);
    } else {
      // Nếu không có thông tin, chuyển về trang chủ
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 3000);
    }
  }
}
