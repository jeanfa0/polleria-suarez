import { Routes } from '@angular/router';
import { roleGuard } from './core/guards/role.guard';
import { LandingComponent } from './features/public/landing.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./features/public/sections/hero/hero.component').then(m => m.HeroComponent)
      },
      {
        path: 'menu',
        loadComponent: () => import('./features/public/sections/menu/menu.component').then(m => m.MenuSectionComponent)
      },
      {
        path: 'app',
        loadComponent: () => import('./features/public/sections/app-download/app-download.component')
          .then(m => m.AppDownloadComponent)
      },
      {
        path: 'promociones',
        loadComponent: () => import('./features/public/sections/promociones/promociones.component').then(m => m.PromocionesComponent)
      },
      {
        path: 'nosotros',
        loadComponent: () => import('./features/public/sections/nosotros/nosotros.component').then(m => m.NosotrosComponent)
      },
      {
        path: 'contacto',
        loadComponent: () => import('./features/public/sections/contacto/contacto.component').then(m => m.ContactoComponent)
      },
    ]
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'admin',
    canActivate: [roleGuard(['admin'])],
    children: [
      { path: 'dashboard', loadComponent: () => import('./features/admin/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  {
    path: 'cajero',
    canActivate: [roleGuard(['cajero'])],
    children: [
      { path: 'cobros', loadComponent: () => import('./features/cajero/cajero-cobros.component').then(m => m.CajeroCobrosComponent) },
      { path: '', redirectTo: 'cobros', pathMatch: 'full' }
    ]
  },
  {
    path: 'empleado',
    canActivate: [roleGuard(['empleado'])],
    children: [
      { path: 'pedido', loadComponent: () => import('./features/empleado/nuevo-pedido.component').then(m => m.NuevoPedidoComponent) },
      { path: '', redirectTo: 'pedido', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '' }
];