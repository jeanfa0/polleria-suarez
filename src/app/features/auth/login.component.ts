import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private auth = inject(AuthService);

  email    = '';
  password = '';
  mostrarPass = signal(false);
  cargando = signal(false);
  error    = signal('');

  accesosRapidos = [
    { rol: '👑 Admin',    email: 'admin@suarez.pe' },
    { rol: '💰 Cajero',   email: 'cajero@suarez.pe' },
    { rol: '📋 Empleado', email: 'empleado@suarez.pe' },
  ];

  fill(email: string) {
    this.email    = email;
    this.password = 'Suarez2024!';
    this.error.set('');
  }

  async login() {
    if (!this.email || !this.password) {
      this.error.set('Completa todos los campos.');
      return;
    }
    this.cargando.set(true);
    this.error.set('');
    try {
      await this.auth.login(this.email, this.password);
      // auth.service redirige automáticamente según rol
    } catch (e: any) {
      this.error.set(
        e.code === 'auth/invalid-credential'
          ? 'Correo o contraseña incorrectos.'
          : e.message || 'Error al iniciar sesión.'
      );
    }
    this.cargando.set(false);
  }
}
