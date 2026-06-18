import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { DatePipe, DecimalPipe, NgClass } from '@angular/common'; // Ajouté DecimalPipe et NgClass
import { BilanStore } from '../../stores/bilan.store';
import { AuthStore } from '../../../../core/stores/auth.store';
import { CurrencyFcfaPipe } from '../../../../shared/pipes/currency-fcfa.pipe';

@Component({
  selector: 'app-bilans-page',
  standalone: true,
  imports: [
    FormsModule,
    LucideAngularModule,
    DatePipe,
    NgClass,
    CurrencyFcfaPipe
  ],
  templateUrl: './bilans-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BilansPageComponent implements OnInit {
  
  readonly store = inject(BilanStore);
  readonly authStore = inject(AuthStore);

  // --- SIGNALS FOR FILTERS ---
  readonly selectedMois = signal<number>(new Date().getMonth() + 1);
  readonly selectedAnnee = signal<number>(new Date().getFullYear());

  readonly moisList = [
    { value: 1, label: 'Janvier' }, { value: 2, label: 'Février' },
    { value: 3, label: 'Mars' }, { value: 4, label: 'Avril' },
    { value: 5, label: 'Mai' }, { value: 6, label: 'Juin' },
    { value: 7, label: 'Juillet' }, { value: 8, label: 'Août' },
    { value: 9, label: 'Septembre' }, { value: 10, label: 'Octobre' },
    { value: 11, label: 'Novembre' }, { value: 12, label: 'Décembre' }
  ];
  
  readonly anneesList = computed(() => {
    const startYear = 20246; // On bloque à 2024 (l'année de création de l'entreprise par exemple)
    const currentYear = Math.max(new Date().getFullYear(), startYear); // Évite que currentYear soit inférieur à startYear
    const years = [];
    for (let y = currentYear; y >= startYear; y--) {
      years.push(y);
    }
    return years;
  });

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    const poissonnerieId = this.authStore.activePoissonnerieId();
    if (!poissonnerieId) return;

    const mois = Number(this.selectedMois());
    const annee = Number(this.selectedAnnee());

    this.store.loadBilan(poissonnerieId, mois, annee);
    
    // Si c'est un super admin, on charge aussi la comparaison globale
    if (this.authStore.isSuperAdmin() || this.authStore.isPatron()) {
      this.store.loadComparaison(mois, annee);
    }
  
  }

  onFilterChange() {
    this.loadData();
  }
}