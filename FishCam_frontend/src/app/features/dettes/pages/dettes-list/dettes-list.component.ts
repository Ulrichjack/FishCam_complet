import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { DettesStore } from '../../stores/dettes.store';
import { AuthStore } from '../../../../core/stores/auth.store';
import { DebtorCardComponent } from '../../components/debtor-card/debtor-card.component';
import { LucideAngularModule } from 'lucide-angular';

// NOUVEAUX IMPORTS :
import { TransactionFormComponent } from '../../../../shared/components/transaction-form/transaction-form.component';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { CompteCourantResponse } from '../../../../core/models/compte-courant.model';
import { ErrorStateComponent } from '../../../../shared/components/error-state/error-state.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { LoadingSkeletonComponent } from '../../../../shared/components/loading-skeleton/loading-skeleton.component';


@Component({
  selector: 'app-dettes-list',
  standalone: true,
  imports: [
    DebtorCardComponent, 
    LucideAngularModule,
    TransactionFormComponent,
    ModalComponent,
    LoadingSkeletonComponent,
    EmptyStateComponent,
    ErrorStateComponent           
  ],
  templateUrl: './dettes-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DettesListComponent implements OnInit {
  
   readonly store = inject(DettesStore);
   readonly authStore = inject(AuthStore);

  readonly isModalOpen = signal(false);
  readonly selectedCompte = signal<CompteCourantResponse | null>(null);

  ngOnInit(): void {
    const poissonnerieId = this.authStore.activePoissonnerieId();
    if (poissonnerieId) {
      this.store.loadDebtors(poissonnerieId);
    } else {
      console.error("No active poissonnerie ID found for the user.");
    }
  }

  openReimburseModal(compteId: number): void {
    const compte = this.store.debtors().find(c => c.id === compteId) || null;
    this.selectedCompte.set(compte);
    this.isModalOpen.set(true);
  }

  async onSaveTransaction(data: {amount: number, notes: string}) {
    const compte = this.selectedCompte();
    const poissonnerieId = this.authStore.activePoissonnerieId();
    if (!compte || !poissonnerieId) return;

    try {
      // On appelle juste le store !
      await this.store.rembourserDette(compte.id, data.amount, data.notes, poissonnerieId);
      this.isModalOpen.set(false);
    } catch (error) {
      alert("Erreur lors du remboursement");
    }
  }
}