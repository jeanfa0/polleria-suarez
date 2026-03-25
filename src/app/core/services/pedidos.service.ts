import { Injectable, inject } from '@angular/core';
import {
  Firestore, collection, addDoc, updateDoc, doc,
  query, where, orderBy, collectionData, Timestamp, runTransaction
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Pedido, ItemPedido, OrderStatus, OrderType, PaymentMethod } from '../models/index';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class PedidosService {
  private firestore = inject(Firestore);
  private auth = inject(AuthService);

  getPedidosPendientes(): Observable<Pedido[]> {
    const q = query(
      collection(this.firestore, 'pedidos'),
      where('estado', 'in', ['pendiente', 'en_cocina', 'listo']),
      orderBy('creadoEn', 'asc')
    );
    return collectionData(q, { idField: 'id' }) as Observable<Pedido[]>;
  }

  getPedidosListos(): Observable<Pedido[]> {
    const q = query(
      collection(this.firestore, 'pedidos'),
      where('estado', '==', 'listo'),
      orderBy('creadoEn', 'asc')
    );
    return collectionData(q, { idField: 'id' }) as Observable<Pedido[]>;
  }

  getPedidosPorCobrar(): Observable<Pedido[]> {
    const q = query(
      collection(this.firestore, 'pedidos'),
      where('estado', 'in', ['pendiente', 'en_cocina', 'listo']),
      orderBy('creadoEn', 'asc')
    );
    return collectionData(q, { idField: 'id' }) as Observable<Pedido[]>;
  }

  getPedidosHoy(): Observable<Pedido[]> {
    const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
    const q = query(
      collection(this.firestore, 'pedidos'),
      where('creadoEn', '>=', Timestamp.fromDate(hoy)),
      orderBy('creadoEn', 'desc')
    );
    return collectionData(q, { idField: 'id' }) as Observable<Pedido[]>;
  }

  async crearPedido(payload: {
    notas?: string;
    tipo: OrderType; mesa?: number;
    clienteNombre?: string; clienteTelefono?: string; clienteDireccion?: string;
    items: ItemPedido[];
  }): Promise<string> {
    const usuario = this.auth.currentUser;
    if (!usuario) throw new Error('No autenticado');
    const total = payload.items.reduce((acc, i) => acc + i.subtotal, 0);

    const contadorRef = doc(this.firestore, 'contadores', 'pedidos');
    let numero = 1;
    await runTransaction(this.firestore, async (tx) => {
      const snap = await tx.get(contadorRef);
      numero = snap.exists() ? (snap.data()['ultimo'] as number) + 1 : 1;
      tx.set(contadorRef, { ultimo: numero }, { merge: true });
    });

    const ref = await addDoc(collection(this.firestore, 'pedidos'), {
      numero,
      tipo: payload.tipo,
      estado: 'pendiente',
      mesa: payload.mesa ?? null,
      clienteNombre: payload.clienteNombre ?? null,
      clienteTelefono: payload.clienteTelefono ?? null,
      clienteDireccion: payload.clienteDireccion ?? null,
      items: payload.items,
      total,
      metodoPago: null,
      empleadoId: usuario.uid,
      empleadoNombre: usuario.nombre,
      cajeroId: null,
      creadoEn: Timestamp.now(),
      notas: payload.notas ?? null,
      actualizadoEn: Timestamp.now()
    });
    return ref.id;
  }

  async actualizarEstado(id: string, estado: OrderStatus): Promise<void> {
    await updateDoc(doc(this.firestore, 'pedidos', id), {
      estado, actualizadoEn: Timestamp.now()
    });
  }

  async registrarPago(id: string, metodo: PaymentMethod, cajeroId: string): Promise<void> {
    await updateDoc(doc(this.firestore, 'pedidos', id), {
      estado: 'entregado',
      metodoPago: metodo,
      cajeroId,
      pagadoEn: Timestamp.now(),
      actualizadoEn: Timestamp.now()
    });
  }
}
