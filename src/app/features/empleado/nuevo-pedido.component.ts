import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Firestore, collection, collectionData, query,
  where, doc, updateDoc, Timestamp
} from '@angular/fire/firestore';
import { PedidosService } from '../../core/services/pedidos.service';
import { AuthService } from '../../core/services/auth.service';
import { Producto, ItemPedido, OrderType } from '../../core/models';

@Component({
  selector: 'app-nuevo-pedido',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './nuevo-pedido.component.html',
  styleUrls: ['./nuevo-pedido.component.css']
})
export class NuevoPedidoComponent implements OnInit {
  private svc = inject(PedidosService);
  private auth = inject(AuthService);
  private db = inject(Firestore);

  // ── Estado del formulario ────────────────────────────────────
  tipo = signal<OrderType>('local');
  mesa = signal<number | null>(null);
  cat = signal('pollo');
  carrito = signal<Map<string, number>>(new Map());
  loading = signal(false);
  err = signal('');
  toast = signal(false);
  cliente = ''; telefono = ''; direccion = ''; notas = '';

  // ── Número de pedido ─────────────────────────────────────────
  proximoNum = signal(0);
  ultimoPedido = signal(0);

  // ── Mesas ocupadas (tiempo real desde Firestore) ─────────────
  mesasOcupadas$ = collectionData<any>(
    query(
      collection(this.db, 'pedidos'),
      where('tipo', '==', 'local'),
      where('estado', 'in', ['pendiente', 'en_cocina', 'listo'])
    ), { idField: 'id' }
  );
  mesasOcupadasList = signal<number[]>([]);

  // ── Productos (desde Firestore, con fallback estático) ────────
productos$ = collectionData(
  collection(this.db, 'productos'), { idField: 'id' }
);
  productosLista = signal<Producto[]>([]);

  // ── Referencia local para computed ───────────────────────────
  private _productos: Producto[] = [];

  mesas = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  tipos = [
    { val: 'local' as OrderType, icon: '🪑', label: 'En local' },
    { val: 'delivery' as OrderType, icon: '🛵', label: 'Delivery' },
    { val: 'llevar' as OrderType, icon: '📦', label: 'Para llevar' },
  ];

  categorias = [
    { val: 'pollo', icon: '🍗', label: 'Pollos' },
    { val: 'acompanamiento', icon: '🍟', label: 'Acompañam.' },
    { val: 'bebida', icon: '🥤', label: 'Bebidas' },
    { val: 'postre', icon: '🍮', label: 'Postres' },
  ];

  // Productos estáticos de fallback
  private readonly productosDefault: Producto[] = [
    { id: 'p1', nombre: 'Pollo entero', precio: 45, categoria: 'pollo', disponible: true, emoji: '🍗' },
    { id: 'p2', nombre: '1/2 Pollo', precio: 25, categoria: 'pollo', disponible: true, emoji: '🍗' },
    { id: 'p3', nombre: '1/4 Pollo', precio: 14, categoria: 'pollo', disponible: true, emoji: '🍗' },
    { id: 'p4', nombre: 'Papas fritas', precio: 8, categoria: 'acompanamiento', disponible: true, emoji: '🍟' },
    { id: 'p5', nombre: 'Yuca frita', precio: 7, categoria: 'acompanamiento', disponible: true, emoji: '🥔' },
    { id: 'p6', nombre: 'Ensalada', precio: 6, categoria: 'acompanamiento', disponible: true, emoji: '🥗' },
    { id: 'p7', nombre: 'Inca Kola', precio: 5, categoria: 'bebida', disponible: true, emoji: '🥤' },
    { id: 'p8', nombre: 'Agua mineral', precio: 3, categoria: 'bebida', disponible: true, emoji: '💧' },
    { id: 'p9', nombre: 'Chicha morada', precio: 5, categoria: 'bebida', disponible: true, emoji: '🍷' },
    { id: 'p10', nombre: 'Mazamorra', precio: 6, categoria: 'postre', disponible: false, emoji: '🍮' },
  ];

  ngOnInit() {
    // Suscribir mesas ocupadas
    this.mesasOcupadas$.subscribe((pedidos: any[]) => {
      this.mesasOcupadasList.set(pedidos.map(p => p.mesa).filter(Boolean));
    });

    // Cargar productos desde Firestore (con fallback)
    this.productos$.subscribe((prods: any[]) => {
      if (prods && prods.length > 0) {
        this._productos = prods as Producto[];
        this.productosLista.set(prods as Producto[]);
      } else {
        this._productos = this.productosDefault;
        this.productosLista.set(this.productosDefault);
      }
    });
  }

  // ── Computed ─────────────────────────────────────────────────
  filtrados = computed(() =>
    this.productosLista().filter(p => p.categoria === this.cat())
  );

  items = computed<ItemPedido[]>(() => {
    const res: ItemPedido[] = [];
    this.carrito().forEach((cant, id) => {
      const p = this.productosLista().find(x => x.id === id);
      if (p && cant > 0) res.push({
        productoId: id, nombre: p.nombre,
        cantidad: cant, precioUnitario: p.precio,
        subtotal: p.precio * cant
      });
    });
    return res;
  });

  total = computed(() => this.items().reduce((a, i) => a + i.subtotal, 0));

  puedeConfirmar = computed(() => {
    if (this.items().length === 0) return false;
    if (this.tipo() === 'local' && !this.mesa()) return false;
    if (this.tipo() === 'delivery' && (!this.cliente || !this.direccion)) return false;
    return true;
  });

  // ── Carrito ──────────────────────────────────────────────────
  qty(id: string) { return this.carrito().get(id) ?? 0; }

  inc(p: Producto) {
    const m = new Map(this.carrito());
    m.set(p.id!, (m.get(p.id!) ?? 0) + 1);
    this.carrito.set(m);
  }

  dec(p: Producto) {
    const m = new Map(this.carrito());
    const v = m.get(p.id!) ?? 0;
    if (v <= 1) m.delete(p.id!); else m.set(p.id!, v - 1);
    this.carrito.set(m);
  }

  setTipo(t: OrderType) { this.tipo.set(t); this.mesa.set(null); }

  padNum(n: number) { return String(n).padStart(3, '0'); }

  esMesaOcupada(m: number) { return this.mesasOcupadasList().includes(m); }

  resetForm() {
    this.carrito.set(new Map());
    this.mesa.set(null);
    this.cliente = ''; this.telefono = '';
    this.direccion = ''; this.notas = '';
    this.err.set('');
  }

  // ── Confirmar pedido → Firestore ─────────────────────────────
  async confirmar() {
    if (!this.puedeConfirmar()) return;
    this.loading.set(true); this.err.set('');
    try {
      await this.svc.crearPedido({
        tipo: this.tipo(),
        mesa: this.mesa() ?? undefined,
        clienteNombre: this.cliente || undefined,
        clienteTelefono: this.telefono || undefined,
        clienteDireccion: this.direccion || undefined,
        notas: this.notas || undefined,
        items: this.items()
      });
      this.ultimoPedido.set(this.proximoNum() + 1);
      this.resetForm();
      this.toast.set(true);
      setTimeout(() => this.toast.set(false), 3000);
    } catch (e: any) {
      this.err.set(e.message || 'Error al registrar el pedido.');
    }
    this.loading.set(false);
  }
}
