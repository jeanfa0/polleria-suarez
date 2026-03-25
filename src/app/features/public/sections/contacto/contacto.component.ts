import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.css'
})
export class ContactoComponent {
  cNombre   = '';
  cEmail    = '';
  cTelefono = '';
  cAsunto   = 'Consulta general';
  cMensaje  = '';
  cEnviado  = signal(false);
  enviando  = signal(false);

  enviarMensaje() {
    if (!this.cNombre || !this.cEmail || !this.cMensaje) return;
    this.enviando.set(true);
    setTimeout(() => {
      this.enviando.set(false);
      this.cEnviado.set(true);
      this.cNombre   = '';
      this.cEmail    = '';
      this.cTelefono = '';
      this.cAsunto   = 'Consulta general';
      this.cMensaje  = '';
      setTimeout(() => this.cEnviado.set(false), 4000);
    }, 1000);
  }
}