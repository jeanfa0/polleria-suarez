import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuSectionComponent {
  menuCat = signal('all');
  cartToast = signal('');

  menuFilters = [
    { val: 'all',    label: 'Todo',        icon: '🍽️' },
    { val: 'pollo',  label: 'Pollos',      icon: '🍗' },
    { val: 'combo',  label: 'Combos',      icon: '🎁' },
    { val: 'acomp',  label: 'Acompañam.',  icon: '🍟' },
    { val: 'postre', label: 'Postres',     icon: '🍮' },
    { val: 'bebida', label: 'Bebidas',     icon: '🥤' },
  ];

  menuItems = [

    // ── POLLOS ──
    {
      id: 1,
      nombre: 'Pollo Entero',
      cat: 'Pollo a la Brasa',
      catFilter: 'pollo',
      desc: 'Marinado 24h en especias andinas. El clásico irresistible de la familia.',
      precio: 45,
      precioOld: null,
      sub: '+ acompañ.',
      emoji: '🍗',
      img: 'assets/menu/pollo-entero.png',
      tags: ['Papas', 'Cremas', 'Ensalada'],
      badge: 'Popular'
    },
    {
      id: 2,
      nombre: '1/2 Pollo',
      cat: 'Pollo a la Brasa',
      catFilter: 'pollo',
      desc: 'Media presa jugosa con papas doradas y crema de ají amarillo.',
      precio: 25,
      precioOld: null,
      sub: '+ acompañ.',
      emoji: '🍗',
      img: 'assets/menu/medio-pollo.png',
      tags: ['Papas', 'Crema de ají'],
      badge: ''
    },
    {
      id: 3,
      nombre: '1/4 Pollo',
      cat: 'Pollo a la Brasa',
      catFilter: 'pollo',
      desc: 'La opción personal perfecta. Sabor de Suárez en cada bocado.',
      precio: 14,
      precioOld: null,
      sub: '+ acompañ.',
      emoji: '🍗',
      img: 'assets/menu/cuarto-pollo.png',
      tags: ['Papas', 'Salsa huancaína'],
      badge: ''
    },
    {
      id: 4,
      nombre: 'Pechuga a la Brasa',
      cat: 'Pollo a la Brasa',
      catFilter: 'pollo',
      desc: 'Pechuga entera jugosa, dorada en brasa de leña. La favorita de los fitness.',
      precio: 18,
      precioOld: null,
      sub: '+ acompañ.',
      emoji: '🍗',
      img: 'assets/menu/pechuga.png',
      tags: ['Alta proteína', 'Sin piel'],
      badge: 'Nuevo'
    },
    {
      id: 5,
      nombre: 'Alitas Brasa',
      cat: 'Pollo a la Brasa',
      catFilter: 'pollo',
      desc: '6 alitas crujientes bañadas en nuestra salsa secreta de ají panca y miel.',
      precio: 22,
      precioOld: 26,
      sub: '6 unidades',
      emoji: '🍗',
      img: 'assets/menu/alitas.png',
      tags: ['Picante suave', 'Crujientes'],
      badge: 'Oferta'
    },

    // ── COMBOS ──
    {
      id: 6,
      nombre: 'Combo Familiar',
      cat: 'Combos',
      catFilter: 'combo',
      desc: 'Pollo entero + 2 papas grandes + 4 gaseosas + salsas. Ideal para 4 personas.',
      precio: 65,
      precioOld: 82,
      sub: '4 personas',
      emoji: '🎁',
      img: 'assets/menu/combo-familiar.png',
      tags: ['Pollo entero', '2 Papas', '4 Gaseosas', 'Salsas'],
      badge: 'Oferta'
    },
    {
      id: 7,
      nombre: 'Combo Pareja',
      cat: 'Combos',
      catFilter: 'combo',
      desc: '1/2 pollo + papas + 2 gaseosas + cremas. Perfecto para compartir.',
      precio: 38,
      precioOld: 46,
      sub: '2 personas',
      emoji: '🎁',
      img: 'assets/menu/combo-pareja.png',
      tags: ['1/2 Pollo', 'Papas', '2 Gaseosas'],
      badge: 'Popular'
    },
    {
      id: 8,
      nombre: 'Combo Ejecutivo',
      cat: 'Combos',
      catFilter: 'combo',
      desc: '1/4 pollo + papas medianas + gaseosa personal. Rápido y contundente.',
      precio: 22,
      precioOld: 27,
      sub: '1 persona',
      emoji: '🎁',
      img: 'assets/menu/combo-ejecutivo.png',
      tags: ['1/4 Pollo', 'Papas', 'Gaseosa'],
      badge: ''
    },
    {
      id: 9,
      nombre: 'Combo Niños',
      cat: 'Combos',
      catFilter: 'combo',
      desc: '1/4 pollo + papas pequeñas + juguito de fruta + sorpresita incluida.',
      precio: 18,
      precioOld: null,
      sub: '1 niño',
      emoji: '🎁',
      img: 'assets/menu/combo-ninos.png',
      tags: ['1/4 Pollo', 'Papas', 'Jugo', 'Sorpresa'],
      badge: 'Nuevo'
    },

    // ── ACOMPAÑAMIENTOS ──
    {
      id: 10,
      nombre: 'Papas Fritas',
      cat: 'Acompañamiento',
      catFilter: 'acomp',
      desc: 'Peladas y fritas al momento. Doradas por fuera, suaves por dentro.',
      precio: 8,
      precioOld: null,
      sub: '',
      emoji: '🍟',
      img: 'assets/menu/papas-fritas.png',
      tags: ['Ketchup', 'Mayonesa'],
      badge: ''
    },
    {
      id: 11,
      nombre: 'Papas al Hilo',
      cat: 'Acompañamiento',
      catFilter: 'acomp',
      desc: 'Papas cortadas finísimas y fritas hasta quedar supercrujientes. Irresistibles.',
      precio: 10,
      precioOld: null,
      sub: '',
      emoji: '🍟',
      img: 'assets/menu/papas-hilo.png',
      tags: ['Extra crujiente'],
      badge: 'Popular'
    },
    {
      id: 12,
      nombre: 'Ensalada Fresca',
      cat: 'Acompañamiento',
      catFilter: 'acomp',
      desc: 'Lechugas, tomate cherry y zanahoria rallada con aderezo especial de la casa.',
      precio: 6,
      precioOld: null,
      sub: '',
      emoji: '🥗',
      img: 'assets/menu/ensalada.png',
      tags: ['Sin gluten', 'Vegano'],
      badge: ''
    },
    {
      id: 13,
      nombre: 'Arroz con Leche',
      cat: 'Acompañamiento',
      catFilter: 'acomp',
      desc: 'Arroz cremoso con leche evaporada, canela y pasas. Receta de la abuela.',
      precio: 7,
      precioOld: null,
      sub: '',
      emoji: '🍚',
      img: 'assets/menu/arroz-leche.png',
      tags: ['Casero', 'Dulce'],
      badge: ''
    },
    {
      id: 14,
      nombre: 'Crema Huancaína',
      cat: 'Acompañamiento',
      catFilter: 'acomp',
      desc: 'Nuestra crema de ají amarillo con queso fresco. Ideal para mojar y repetir.',
      precio: 4,
      precioOld: null,
      sub: 'porción',
      emoji: '🫙',
      img: 'assets/menu/huancaina.png',
      tags: ['Picante suave', 'Vegetariano'],
      badge: ''
    },

    // ── POSTRES ──
    {
      id: 15,
      nombre: 'Picarones',
      cat: 'Postres',
      catFilter: 'postre',
      desc: 'Picarones esponjosos de camote y zapallo con miel de chancaca artesanal.',
      precio: 9,
      precioOld: null,
      sub: '4 unidades',
      emoji: '🍩',
      img: 'assets/menu/picarones.png',
      tags: ['Miel de chancaca', 'Artesanal'],
      badge: 'Popular'
    },
    {
      id: 16,
      nombre: 'Mazamorra Morada',
      cat: 'Postres',
      catFilter: 'postre',
      desc: 'Tradicional postre limeño con maíz morado, frutas y canela. Sabor de Lima.',
      precio: 7,
      precioOld: null,
      sub: 'porción',
      emoji: '🍮',
      img: 'assets/menu/mazamorra.png',
      tags: ['Tradicional', 'Sin lactosa'],
      badge: ''
    },
    {
      id: 17,
      nombre: 'Suspiro Limeño',
      cat: 'Postres',
      catFilter: 'postre',
      desc: 'Dulce de leche con merengue de oporto. El postre más romántico del Perú.',
      precio: 8,
      precioOld: null,
      sub: 'porción',
      emoji: '🍮',
      img: 'assets/menu/suspiro.png',
      tags: ['Cremoso', 'Clásico'],
      badge: 'Nuevo'
    },

    // ── BEBIDAS ──
    {
      id: 18,
      nombre: 'Gaseosas',
      cat: 'Bebidas',
      catFilter: 'bebida',
      desc: 'Inca Kola, Coca-Cola, Sprite y Fanta. La compañía perfecta del pollo.',
      precio: 5,
      precioOld: null,
      sub: '— S/ 8',
      emoji: '🥤',
      img: 'assets/menu/gaseosas.png',
      tags: ['Personal', 'Familiar'],
      badge: ''
    },
    {
      id: 19,
      nombre: 'Chicha Morada',
      cat: 'Bebidas',
      catFilter: 'bebida',
      desc: 'Preparada diariamente con maíz morado, piña, membrillo y especias.',
      precio: 6,
      precioOld: null,
      sub: 'vaso',
      emoji: '🫗',
      img: 'assets/menu/chicha.png',
      tags: ['Artesanal', 'Sin gas'],
      badge: 'Popular'
    },
    {
      id: 20,
      nombre: 'Limonada Frozen',
      cat: 'Bebidas',
      catFilter: 'bebida',
      desc: 'Limón sutil, agua, azúcar y hielo triturado. Refrescante y natural.',
      precio: 7,
      precioOld: null,
      sub: 'vaso grande',
      emoji: '🍋',
      img: 'assets/menu/limonada.png',
      tags: ['Natural', 'Sin gas'],
      badge: 'Nuevo'
    },
    {
      id: 21,
      nombre: 'Agua Mineral',
      cat: 'Bebidas',
      catFilter: 'bebida',
      desc: 'San Luis con gas o sin gas. Fría y lista para acompañar tu pedido.',
      precio: 3,
      precioOld: null,
      sub: '625ml',
      emoji: '💧',
      img: 'assets/menu/agua.png',
      tags: ['Con gas', 'Sin gas'],
      badge: ''
    },

  ];

  filteredMenu() {
    return this.menuCat() === 'all'
      ? this.menuItems
      : this.menuItems.filter(i => i.catFilter === this.menuCat());
  }

  showToast(nombre: string) {
    this.cartToast.set(nombre);
    setTimeout(() => this.cartToast.set(''), 2000);
  }

  onImgError(event: Event, emoji: string) {
    const el = event.target as HTMLImageElement;
    const span = document.createElement('span');
    span.className = 'mcard-emo';
    span.textContent = emoji;
    el.replaceWith(span);
  }
}