import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { LivreurStore } from '../../stores/livreur.store';
import { EvaluationStore } from '../../stores/evaluation.store'; // <-- NOUVEAU STORE
import { SlideOverPanelComponent } from '../../../../shared/components/slide-over-panel/slide-over-panel.component';
import { LivreurFormComponent } from '../../components/livreur-form/livreur-form.component';
import { LivreurResponse } from '../../../../core/models/livreur.model';
import { DatePipe, DecimalPipe } from '@angular/common'; // <-- AJOUTS POUR L'AFFICHAGE

@Component({
  selector: 'app-livreurs-list',
  standalone: true,
  imports: [LucideAngularModule, SlideOverPanelComponent, LivreurFormComponent, DatePipe, DecimalPipe], // <-- IMPORTS
  templateUrl: './livreurs-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LivreursListComponent implements OnInit {

  readonly store = inject(LivreurStore);
  readonly evalStore = inject(EvaluationStore); // <-- INJECTION

  isSlideOverOpen = signal<boolean>(false);
  isEvalSlideOverOpen = signal<boolean>(false); // <-- NOUVEAU PANNEAU
  
  searchTerm = signal<string>('');
  livreurToEdit = signal<LivreurResponse | null>(null);
  livreurToView = signal<LivreurResponse | null>(null); // <-- LIVREUR SÉLECTIONNÉ POUR LES ÉVALS

  readonly filteredLivreurs = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.store.livreurs().filter(l => 
      l.nom.toLowerCase().includes(term) || 
      l.prenom.toLowerCase().includes(term)
    );
  });

  ngOnInit(): void {
    this.store.loadLivreurs();
  }

  openCreatePanel() {
    this.livreurToEdit.set(null); 
    this.isSlideOverOpen.set(true);
  }

  openEditPanel(livreur: LivreurResponse) { 
    this.livreurToEdit.set(livreur);
    this.isSlideOverOpen.set(true);
  }

  // NOUVELLE MÉTHODE POUR OUVRIR LES ÉVALUATIONS
  openEvaluationsPanel(livreur: LivreurResponse) {
    this.livreurToView.set(livreur);
    this.evalStore.loadEvaluations(livreur.id);
    this.isEvalSlideOverOpen.set(true);
  }

  async onSaveLivreur(data: any) {
    if (this.livreurToEdit()) {
      await this.store.updateLivreur(this.livreurToEdit()!.id, data);
    } else {
      await this.store.createLivreur(data);
    }
    this.isSlideOverOpen.set(false);
  }
  
  async toggleStatut(id: number) {
    await this.store.toggleStatut(id);
  }

  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
  }
}