export type UserRole = 'admin' | 'cajero' | 'empleado';
export type OrderStatus = 'pendiente' | 'en_cocina' | 'listo' | 'entregado' | 'cancelado';
export type OrderType = 'local' | 'delivery' | 'llevar';
export type PaymentMethod = 'efectivo' | 'yape' | 'plin' | 'tarjeta';

export interface Usuario {
  uid: string;
  nombre: string;
  email: string;
  rol: UserRole;
  activo: boolean;
  creadoEn: any;
}

export interface Producto {
  id?: string;
  nombre: string;
  precio: number;
  categoria: 'pollo' | 'acompanamiento' | 'bebida' | 'postre';
  disponible: boolean;
  emoji: string;
}

export interface ItemPedido {
  productoId: string;
  nombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface Pedido {
  id?: string;
  numero: number;
  tipo: OrderType;
  estado: OrderStatus;
  mesa?: number | null;
  clienteNombre?: string | null;
  clienteTelefono?: string | null;
  clienteDireccion?: string | null;
  items: ItemPedido[];
  total: number;
  metodoPago?: PaymentMethod | null;
  empleadoId: string;
  empleadoNombre: string;
  cajeroId?: string | null;
  creadoEn: any;
  actualizadoEn: any;
  pagadoEn?: any;
  fuente?: 'app_movil' | 'local';
}
