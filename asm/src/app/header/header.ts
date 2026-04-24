import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../services/cart';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  isMenuOpen = false;
  cartCount = computed(() => this.cartService.totalItems());
  isLoggedIn = computed(() => this.authService.isLoggedIn());
  currentUser = computed(() => this.authService.getUser());

  constructor(
    private cartService: CartService,
    private authService: AuthService
  ) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  
  closeMenu() {
    this.isMenuOpen = false;
  }

  logout() {
    this.authService.logout();
  }
}