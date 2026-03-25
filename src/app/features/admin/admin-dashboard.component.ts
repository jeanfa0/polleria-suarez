import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {
  Firestore, collection, collectionData, query, where, orderBy,
  doc, updateDoc, Timestamp, getDocs
} from '@angular/fire/firestore';
import { PedidosService } from '../../core/services/pedidos.service';
import { AuthService } from '../../core/services/auth.service';
import { Pedido } from '../../core/models';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  public auth = inject(AuthService);
  private svc = inject(PedidosService);
  private db = inject(Firestore);

  hoy = new Date();

  // ── Streams en tiempo real ──────────────────────────────────
  pedidosActivos$ = this.svc.getPedidosPendientes() as Observable<Pedido[]>;

  // ── KPIs (calculados desde Firestore al iniciar) ─────────────
  totalVentas = signal(0);
  totalPedidos = signal(0);
  ticketPromedio = signal(0);
  pctDelivery = signal(0);
  cargandoKpis = signal(true);

  // ── Ventas por producto ──────────────────────────────────────
  ventasProducto = signal<{ nombre: string; monto: number; pct: number }[]>([]);

  // ── Vista activa (tabs) ──────────────────────────────────────
  vistaActiva = signal<'dashboard' | 'pedidos' | 'productos' | 'usuarios'>('dashboard');

  // ── Gestión de pedidos (modal estado) ───────────────────────
  pedidoEditando = signal<Pedido | null>(null);
  nuevoEstado = signal('');
  actualizando = signal(false);

  // ── Gestión de productos ─────────────────────────────────────
  productos$ = collectionData(
    collection(this.db, 'productos'), { idField: 'id' }
  );

  // ── Gestión de usuarios ──────────────────────────────────────
  usuarios$ = collectionData(
    collection(this.db, 'usuarios'), { idField: 'uid' }
  );
  usuarioEditando = signal<any>(null);

  // ── Toast ───────────────────────────────────────────────────
  toastMsg = signal('');

  private sub?: Subscription;

  estados = [
    { val: 'pendiente', label: 'Pendiente', color: 'est-pendiente' },
    { val: 'en_cocina', label: 'En cocina 🔥', color: 'est-cocina' },
    { val: 'listo', label: 'Listo ✓', color: 'est-listo' },
    { val: 'entregado', label: 'Entregado', color: 'est-entregado' },
    { val: 'cancelado', label: 'Cancelado', color: 'est-cancelado' },
  ];

  async ngOnInit() {
    await this.cargarKpis();
  }

  ngOnDestroy() { this.sub?.unsubscribe(); }

  // ── Cargar KPIs desde Firestore ──────────────────────────────
  async cargarKpis() {
    this.cargandoKpis.set(true);
    try {
      const hoyInicio = new Date(); hoyInicio.setHours(0, 0, 0, 0);
      const snap = await getDocs(query(
        collection(this.db, 'pedidos'),
        where('creadoEn', '>=', Timestamp.fromDate(hoyInicio)),
        where('estado', '!=', 'cancelado')
      ));
      const pedidos = snap.docs.map(d => ({ id: d.id, ...d.data() })) as any[];
      const total = pedidos.reduce((s, p) => s + (p.total || 0), 0);
      const delivery = pedidos.filter(p => p.tipo === 'delivery').length;

      this.totalVentas.set(total);
      this.totalPedidos.set(pedidos.length);
      this.ticketPromedio.set(pedidos.length ? +(total / pedidos.length).toFixed(1) : 0);
      this.pctDelivery.set(pedidos.length ? Math.round(delivery / pedidos.length * 100) : 0);

      // Ventas por producto
      const mapa: Record<string, number> = {};
      pedidos.forEach(p => p.items?.forEach((i: any) => {
        mapa[i.nombre] = (mapa[i.nombre] || 0) + i.subtotal;
      }));
      const maxMonto = Math.max(...Object.values(mapa), 1);
      const arr = Object.entries(mapa)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([nombre, monto]) => ({ nombre, monto, pct: Math.round(monto / maxMonto * 100) }));
      this.ventasProducto.set(arr.length ? arr : [
        { nombre: 'Pollo entero', monto: 0, pct: 0 },
      ]);
    } catch { }
    this.cargandoKpis.set(false);
  }

  // ── Cambiar estado de pedido ─────────────────────────────────
  abrirEditarEstado(pedido: Pedido) {
    this.pedidoEditando.set(pedido);
    this.nuevoEstado.set(pedido.estado);
  }

  async guardarEstado() {
    const p = this.pedidoEditando();
    if (!p?.id || !this.nuevoEstado()) return;
    this.actualizando.set(true);
    try {
      await updateDoc(doc(this.db, 'pedidos', p.id), {
        estado: this.nuevoEstado(),
        actualizadoEn: Timestamp.now()
      });
      this.pedidoEditando.set(null);
      this.toast('Estado actualizado ✓');
    } catch (e: any) {
      this.toast('Error: ' + e.message);
    }
    this.actualizando.set(false);
  }

  // ── Cambiar activo de usuario ────────────────────────────────
  async toggleUsuario(uid: string, activo: boolean) {
    try {
      await updateDoc(doc(this.db, 'usuarios', uid), { activo: !activo });
      this.toast(!activo ? 'Usuario activado ✓' : 'Usuario desactivado');
    } catch (e: any) { this.toast('Error: ' + e.message); }
  }

  // ── Toggle disponibilidad producto ──────────────────────────
  async toggleProducto(id: string, disponible: boolean) {
    try {
      await updateDoc(doc(this.db, 'productos', id), { disponible: !disponible });
      this.toast(!disponible ? 'Producto activado ✓' : 'Producto desactivado');
    } catch (e: any) { this.toast('Error: ' + e.message); }
  }

  estadoLabel(e: string) {
    return this.estados.find(x => x.val === e)?.label ?? e;
  }

  estadoClass(e: string) {
    return this.estados.find(x => x.val === e)?.color ?? '';
  }

  private toast(msg: string) {
    this.toastMsg.set(msg);
    setTimeout(() => this.toastMsg.set(''), 3000);
  }
}
