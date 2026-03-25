import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Firestore, collection, collectionData, query, where,
  orderBy, doc, updateDoc, Timestamp, getDocs
} from '@angular/fire/firestore';
import { PedidosService } from '../../core/services/pedidos.service';
import { AuthService } from '../../core/services/auth.service';
import { Pedido, PaymentMethod } from '../../core/models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cajero-cobros',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cajero-cobros.component.html',
  styleUrls: ['./cajero-cobros.component.css']
})
export class CajeroCobrosComponent implements OnInit {
  auth: AuthService = inject(AuthService);
  private svc = inject(PedidosService);
  private db = inject(Firestore);

  // ── Streams en tiempo real ──────────────────────────────────
  // Muestra pendientes + listos (todo lo que debe cobrar el cajero)
  pedidos$ = this.svc.getPedidosPorCobrar() as Observable<Pedido[]>;

  // ── Modal cobro ──────────────────────────────────────────────
  pedidoSel = signal<Pedido | null>(null);
  metodo = signal<PaymentMethod | null>(null);
  paying = signal(false);

  // ── KPIs del cajero (calculados desde Firestore) ─────────────
  totalCobrado = signal(0);
  transacciones = signal(0);
  cargandoKpis = signal(true);

  // ── Historial de cobros de hoy ───────────────────────────────
  vistaActiva = signal<'cola' | 'historial'>('cola');
  historial$ = collectionData(
    query(
      collection(this.db, 'pedidos'),
      where('estado', '==', 'entregado'),
      orderBy('actualizadoEn', 'desc')
    ), { idField: 'id' }
  );

  // ── Toast ────────────────────────────────────────────────────
  toastMsg = signal('');

  metodos = [
    { val: 'efectivo' as PaymentMethod, icon: '💵', label: 'Efectivo' },
    { val: 'yape' as PaymentMethod, icon: '📱', label: 'Yape' },
    { val: 'plin' as PaymentMethod, icon: '📲', label: 'Plin' },
    { val: 'tarjeta' as PaymentMethod, icon: '💳', label: 'Tarjeta' },
  ];

  async ngOnInit() {
    await this.cargarKpis();
  }

  async cargarKpis() {
    this.cargandoKpis.set(true);
    try {
      const hoyInicio = new Date(); hoyInicio.setHours(0, 0, 0, 0);
      const snap = await getDocs(query(
        collection(this.db, 'pedidos'),
        where('estado', '==', 'entregado'),
        where('actualizadoEn', '>=', Timestamp.fromDate(hoyInicio))
      ));
      const pedidos = snap.docs.map(d => d.data()) as any[];
      const total = pedidos.reduce((s, p) => s + (p.total || 0), 0);
      this.totalCobrado.set(total);
      this.transacciones.set(pedidos.length);
    } catch { }
    this.cargandoKpis.set(false);
  }

  // ── Abrir modal de cobro ─────────────────────────────────────
  abrirModal(p: Pedido) {
    this.pedidoSel.set(p);
    this.metodo.set(null);
  }

  cerrar() { this.pedidoSel.set(null); }

  // ── Procesar cobro completo ──────────────────────────────────
  async pagar() {
    const p = this.pedidoSel();
    const m = this.metodo();
    if (!p?.id || !m) return;
    this.paying.set(true);
    try {
      await this.svc.registrarPago(p.id, m, this.auth.currentUser!.uid);
      this.cerrar();
      await this.cargarKpis();
      this.toast(`✓ Cobro de S/ ${p.total} registrado (${m})`);
    } catch (e: any) {
      this.toast('Error: ' + e.message);
    }
    this.paying.set(false);
  }

  // ── Marcar como "listo" desde el cajero ─────────────────────
  async marcarListo(pedidoId: string) {
    try {
      await updateDoc(doc(this.db, 'pedidos', pedidoId), {
        estado: 'listo',
        actualizadoEn: Timestamp.now()
      });
      this.toast('Pedido marcado como listo ✓');
    } catch (e: any) { this.toast('Error: ' + e.message); }
  }

  // ── Cancelar pedido ──────────────────────────────────────────
  async cancelar(pedidoId: string) {
    if (!confirm('¿Cancelar este pedido?')) return;
    try {
      await updateDoc(doc(this.db, 'pedidos', pedidoId), {
        estado: 'cancelado',
        actualizadoEn: Timestamp.now()
      });
      this.toast('Pedido cancelado');
    } catch (e: any) { this.toast('Error: ' + e.message); }
  }

  resumenItems(items: any[]): string {
    return items.map(i => `${i.cantidad}× ${i.nombre}`).join(' · ');
  }

  private toast(msg: string) {
    this.toastMsg.set(msg);
    setTimeout(() => this.toastMsg.set(''), 3000);
  }
}
