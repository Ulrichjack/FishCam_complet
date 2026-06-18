import { computed, Injectable, signal } from '@angular/core';
import { UserResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthStore {

  private currentUser = signal<UserResponse | null>(null);
  private currentPoissonnerieId = signal<number | null>(null);
  
  // 1. NOUVEAU : Signal pour le nom de la boutique active
  private currentPoissonnerieName = signal<string | null>(null);

  readonly user = this.currentUser.asReadonly();
  
  readonly activePoissonnerieId = computed(() => 
    this.currentPoissonnerieId() ?? this.currentUser()?.poissonnerieId ?? null
  );

  // 2. NOUVEAU : Computed pour exposer le nom actif
  readonly activePoissonnerieName = computed(() => 
    this.currentPoissonnerieName() ?? this.currentUser()?.poissonnerieName ?? null
  );

  isLoggedIn = computed(()=> !!this.currentUser());
  isPatron = computed(() => this.currentUser()?.role === 'PATRON');
  isCaissiere = computed(() => this.currentUser()?.role === 'CAISSIERE');
  isEnregistreur = computed(() => this.currentUser()?.role === 'ENREGISTREUR');
  isSuperAdmin = computed(() => this.currentUser()?.role === 'SUPER_ADMIN');
  isMultiPoissonnerie = computed(() => this.currentUser()?.scope === 'MULTI_POISSONNERIE');

  constructor() {
    const savedUser = localStorage.getItem('fishcam_user');
    const savedPoissonnerieId = localStorage.getItem('fishcam_active_poissonnerie');
    const savedPoissonnerieName = localStorage.getItem('fishcam_active_poissonnerie_name'); // <-- NOUVEAU
    
    if (savedUser) {
      try {
        this.currentUser.set(JSON.parse(savedUser));
        if (savedPoissonnerieId) {
          this.currentPoissonnerieId.set(Number(savedPoissonnerieId));
        }
        if (savedPoissonnerieName) {
          this.currentPoissonnerieName.set(savedPoissonnerieName); // <-- NOUVEAU
        }
      } catch (error) {
        console.error("Erreur de lecture du profil utilisateur :", error);
        this.logout();
      }
    }
  }

  public setUser(user: UserResponse){
    this.currentUser.set(user);
    this.currentPoissonnerieId.set(user.poissonnerieId);
    this.currentPoissonnerieName.set(user.poissonnerieName); // <-- NOUVEAU
    
    localStorage.setItem('fishcam_user', JSON.stringify(user));
    if (user.poissonnerieId) {
      localStorage.setItem('fishcam_active_poissonnerie', user.poissonnerieId.toString());
    }
    if (user.poissonnerieName) {
      localStorage.setItem('fishcam_active_poissonnerie_name', user.poissonnerieName); // <-- NOUVEAU
    }
  }

  // 3. MODIFIÉ : Accepte l'ID et le NOM
  public setActivePoissonnerie(id: number, name: string) {
    this.currentPoissonnerieId.set(id);
    this.currentPoissonnerieName.set(name);
    localStorage.setItem('fishcam_active_poissonnerie', id.toString());
    localStorage.setItem('fishcam_active_poissonnerie_name', name);
    window.location.reload(); 
  }

  public logout(){
    this.currentUser.set(null);
    this.currentPoissonnerieId.set(null);
    this.currentPoissonnerieName.set(null);
    localStorage.removeItem('fishcam_token');
    localStorage.removeItem('fishcam_user');
    localStorage.removeItem('fishcam_active_poissonnerie');
    localStorage.removeItem('fishcam_active_poissonnerie_name');
  }
}