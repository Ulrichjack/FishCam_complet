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

  // 1. ÉTAT INTERNE (Signaux)
  searchQuery = signal<string>('');
  results = signal<ProduitResponse[]>([]);
  isSearching = signal<boolean>(false);
  isOpen = signal<boolean>(false);

  // 2. OUTPUT (Ce qu'on envoie au parent)
  productSelected = output<ProduitResponse>();

  private readonly produitService = inject(ProduitService);

  constructor() {
    // 3. On écoute le signal searchQuery de manière réactive
    toObservable(this.searchQuery).pipe(
      debounceTime(300), // On attend 300ms
      distinctUntilChanged(), // On ignore si c'est la même recherche
      tap(() => this.isSearching.set(true)), // On active le spinner
      switchMap(query => {
        // Si la recherche est trop courte, on annule et on renvoie un tableau vide
        if (query.trim() === '' || query.length < 2) {
          return of([]);
        }
        // Sinon, on appelle le backend
        return this.produitService.searchProduits(query).pipe(
          catchError(() => of([])) // En cas d'erreur, on renvoie un tableau vide
        );
      })
    ).subscribe(produits => {
      // 4. On reçoit la réponse du backend et on met à jour l'interface
      this.results.set(produits);
      this.isSearching.set(false);
      this.isOpen.set(produits.length > 0); // On ouvre le menu s'il y a des résultats
    });
  }

  // Quand l'utilisateur tape au clavier
  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery.set(target.value);
    
    if (target.value.trim() === '') {
      this.isOpen.set(false);
      this.results.set([]);
    }
  }

  // Quand l'utilisateur clique sur un produit dans la liste
  selectProduct(produit: ProduitResponse): void {
    this.productSelected.emit(produit); // On envoie au parent
    this.searchQuery.set(produit.nom);  // On affiche le nom dans l'input
    this.isOpen.set(false);             // On ferme la liste
  }

  // Quand on clique en dehors de l'input
  closeDropdown(): void {
    setTimeout(() => {
      this.isOpen.set(false);
    }, 200); // Petit délai pour laisser le temps au clic de s'enregistrer
  }
}