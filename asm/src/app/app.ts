import { Component, signal, computed } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Header } from './header/header';
import { Footer } from './footer/footer';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('bai1');
  isAdminRoute = signal(false);

  constructor(private router: Router) {
    // Lắng nghe sự kiện thay đổi route
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Kiểm tra nếu URL bắt đầu bằng /admin
      this.isAdminRoute.set(event.url.startsWith('/admin'));
    });
  }
}
