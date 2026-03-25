import { Injectable, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Usuario, UserRole } from '../models/index';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);

  currentUser$ = new BehaviorSubject<Usuario | null>(null);

  constructor() {
    onAuthStateChanged(this.auth, async (fbUser) => {
      if (!fbUser) { this.currentUser$.next(null); return; }
      try {
        const snap = await getDoc(doc(this.firestore, 'usuarios', fbUser.uid));
        if (snap.exists()) this.currentUser$.next({ uid: snap.id, ...snap.data() } as Usuario);
        else this.currentUser$.next(null);
      } catch { this.currentUser$.next(null); }
    });
  }

  async login(email: string, password: string): Promise<void> {
    const cred = await signInWithEmailAndPassword(this.auth, email, password);
    const snap = await getDoc(doc(this.firestore, 'usuarios', cred.user.uid));
    if (!snap.exists()) throw new Error('Usuario no registrado. Contacta al administrador.');
    const usuario = { uid: snap.id, ...snap.data() } as Usuario;
    if (!usuario.activo) throw new Error('Cuenta desactivada. Contacta al administrador.');
    this.currentUser$.next(usuario);
    this.redirectByRole(usuario.rol);
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
    this.currentUser$.next(null);
    this.router.navigate(['/login']);
  }

  get currentUser(): Usuario | null { return this.currentUser$.value; }
  get userRole(): UserRole | null { return this.currentUser?.rol ?? null; }

  private redirectByRole(rol: UserRole): void {
    const routes: Record<UserRole, string> = {
      admin: '/admin/dashboard',
      cajero: '/cajero/cobros',
      empleado: '/empleado/pedido'
    };
    this.router.navigate([routes[rol]]);
  }
}
