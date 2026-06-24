import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { catchError, debounceTime, distinctUntilChanged, of, switchMap, tap } from 'rxjs';
import { ProduitResponse } from '../../../core/models/produit.model';
import { ProduitService } from '../../../features/factures/services/produit.service';
import { toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-product-autocomplete',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './product-autocomplete.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductAutocompleteComponent {

  searchQuery = signal<string>('');
  results = signal<ProduitResponse[]>([]);
  isSearching = signal<boolean>(false);
  isOpen = signal<boolean>(false);

  productSelected = output<ProduitResponse>();

  private readonly produitService = inject(ProduitService);
  
  // 🟢 NOUVEAU : Un drapeau pour bloquer la recherche automatique après un clic
  private skipNextSearch = false;

  constructor() {
    toObservable(this.searchQuery).pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => {
        // On n'affiche le spinner que si on ne saute pas la recherche
        if (!this.skipNextSearch) this.isSearching.set(true);
      }),
      switchMap(query => {
        // 🟢 NOUVEAU : Si on vient de cliquer, on annule la recherche et on baisse le drapeau
        if (this.skipNextSearch) {
          this.skipNextSearch = false;
          this.isSearching.set(false);
          return of(null); // On renvoie null pour dire "pas de recherche"
        }

        if (query.trim() === '' || query.length < 2) {
          return of([]);
        }
        return this.produitService.searchProduits(query).pipe(
          catchError(() => of([]))
        );
      })
    ).subscribe(produits => {
      // 🟢 NOUVEAU : Si on a annulé la recherche (null), on ne fait rien !
      if (produits === null) return;

      this.results.set(produits);
      this.isSearching.set(false);
      this.isOpen.set(produits.length > 0);
    });
  }

  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery.set(target.value);
    
    if (target.value.trim() === '') {
      this.isOpen.set(false);
      this.results.set([]);
    }
  }

  selectProduct(produit: ProduitResponse): void {
    // 🟢 NOUVEAU : On lève le drapeau AVANT de modifier le searchQuery
    this.skipNextSearch = true; 
    
    this.productSelected.emit(produit);
    this.searchQuery.set(produit.nom);
    this.isOpen.set(false);
  }

  closeDropdown(): void {
    setTimeout(() => {
      this.isOpen.set(false);
    }, 200);
  }
}