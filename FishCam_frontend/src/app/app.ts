import { Component, signal, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './shared/components/toast/toast.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
  // Nécessaire pour que les styles globaux (Tailwind, etc.) s'appliquent correctement à toute l'application
  encapsulation: ViewEncapsulation.None
})
export class App {

  protected readonly title = signal('FishCam_frontend');
}
