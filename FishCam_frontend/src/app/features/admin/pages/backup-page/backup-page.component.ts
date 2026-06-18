import { ChangeDetectionStrategy, Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { DatePipe } from '@angular/common'; // <-- NOUVEAU : Import obligatoire pour le HTML
import { BackupStore } from '../../stores/backup.store';

@Component({
  selector: 'app-backup-page',
  standalone: true,
  imports: [LucideAngularModule, DatePipe], // <-- NOUVEAU : Ajout du DatePipe ici
  templateUrl: './backup-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BackupPageComponent implements OnInit {

  readonly store = inject(BackupStore);
  readonly isOnline = signal<boolean>(navigator.onLine);

  ngOnInit() {
    this.store.loadStatus();
  }

  @HostListener('window:online')
  onOnline() {
    this.isOnline.set(true);
  }

  @HostListener('window:offline')
  onOffline() {
    this.isOnline.set(false);
  }

  async onSyncCloud() {
    await this.store.syncCloud();
  }

  // NOUVEAU : Fonction pour formater le type de backup dans le tableau HTML
  formatType(type: string): string {
    switch (type) {
      case 'CLOUD_WEEKLY': return 'Cloud (Hebdomadaire)';
      case 'LOCAL_DAILY': return 'Local (Quotidien)';
      default: return type;
    }
  }
}