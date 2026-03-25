import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/index';

export const roleGuard = (roles: UserRole[]): CanActivateFn => () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const user = auth.currentUser;
  if (!user) { router.navigate(['/login']); return false; }
  if (!roles.includes(user.rol)) {
    const routes: Record<UserRole, string> = {
      admin: '/admin/dashboard',
      cajero: '/cajero/cobros',
      empleado: '/empleado/pedido'
    };
    router.navigate([routes[user.rol]]); return false;
  }
  return true;
};
