import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-download-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-download.component.html',
  styleUrl: './app-download.component.css'
})
export class AppDownloadComponent {
  downloadAPK(e: Event) {
    e.preventDefault();
    alert('¡APK próximamente disponible! Déjanos tu número y te avisamos.');
  }
}