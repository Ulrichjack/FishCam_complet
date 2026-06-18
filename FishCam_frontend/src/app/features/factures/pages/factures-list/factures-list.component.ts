import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { FactureStore } from '../../stores/facture.store';
import { AuthStore } from '../../../../core/stores/auth.store';
import { FormsModule } from '@angular/forms'; // Needed for ngModel on the date input
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { CurrencyFcfaPipe } from '../../../../shared/pipes/currency-fcfa.pipe';

@Component({
  selector: 'app-factures-list',
  standalone: true,
  imports: [RouterLink, LucideAngularModule,  FormsModule, ConfirmDialogComponent, CurrencyFcfaPipe],
  templateUrl: './factures-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FacturesListComponent implements OnInit {

  readonly factureStore = inject(FactureStore);
  public readonly authStore = inject(AuthStore);

 
  selectedDate = signal<string>('');

  // Signals for the Confirm Dialog
  isConfirmOpen = signal<boolean>(false);
  factureToClose = signal<number | null>(null);

  ngOnInit() {
    this.selectedDate.set(new Date().toISOString().substring(0, 10));
    this.loadData();
  }

  loadData() {
    
    const poissonnerieId = this.authStore.activePoissonnerieId();
    if (poissonnerieId) {
      this.factureStore.loadFactures(poissonnerieId, this.selectedDate());
    }
  }

  onDateChange(newDate: string) {
    
    this.selectedDate.set(newDate);
    this.loadData();
  }

  openCloseDialog(factureId: number) {
    this.factureToClose.set(factureId);
    this.isConfirmOpen.set(true);
  }

  async executeClose() {
    const id = this.factureToClose();
    if (id) {
      await this.factureStore.cloturerFacture(id);
    }
    this.isConfirmOpen.set(false);
  }
}