import { Component, signal, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterOutlet], // 👈 agrega RouterOutlet
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent implements OnInit, OnDestroy {
  private auth = inject(AuthService);
  private router = inject(Router);
  scrolled = signal(false);
  loginOpen = signal(false);
  mobileMenu = signal(false);
  loginEmail = '';
  loginPass = '';
  loginLoading = signal(false);
  loginErr = signal('');
  private scrollHandler = () => this.scrolled.set(window.scrollY > 50);
  ngOnInit() { window.addEventListener('scroll', this.scrollHandler); }
  ngOnDestroy() { window.removeEventListener('scroll', this.scrollHandler); }
  quickFill(email: string) {
    this.loginEmail = email;
    this.loginPass = 'Suarez2024!';
  }
  async doLogin() {
    if (!this.loginEmail || !this.loginPass) {
      this.loginErr.set('Completa todos los campos.');
      return;
    }
    this.loginLoading.set(true);
    this.loginErr.set('');
    try {
      await this.auth.login(this.loginEmail, this.loginPass);
      this.loginOpen.set(false);
    } catch (e: unknown) {
      this.loginErr.set(e instanceof Error ? e.message : 'Error al iniciar sesión.');
    } finally {
      this.loginLoading.set(false);
    }
  }
}