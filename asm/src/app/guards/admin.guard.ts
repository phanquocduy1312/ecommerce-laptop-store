import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Kiểm tra xem user có phải admin không
  if (authService.isAdmin()) {
    return true;
  }

  // Nếu không phải admin, chuyển về trang login admin
  router.navigate(['/admin/login-admin']);
  return false;
};
