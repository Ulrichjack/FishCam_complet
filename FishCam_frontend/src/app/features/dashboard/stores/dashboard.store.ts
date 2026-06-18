import { FactureResponse } from '../../../core/models/facture.model';
import { Injectable, inject, signal, computed } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { StatistiquesPoissonnerieResponse } from '../../../core/models/statistiques.model';
import { CompteCourantResponse } from '../../../core/models/compte-courant.model';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardStore {

  private dashboardService = inject(DashboardService);

  // --- STATE SIGNALS ---
  private readonly _stats = signal<StatistiquesPoissonnerieResponse | null>(null);
  private readonly _debtors = signal<CompteCourantResponse[]>([]);
  private readonly _facturesDuJour = signal<FactureResponse[]>([]);
   private readonly _isLoading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  readonly stats = this._stats.asReadonly();
  readonly debtors = this._debtors.asReadonly();
  readonly facturesDuJour = this._facturesDuJour.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  // --- COMPUTED SIGNALS ---
  // 3. ADDED: This automatically finds the daily report!


  // --- ACTIONS ---
  // 4. ADDED: We now require userId as a parameter
  async loadStats(poissonnerieId: number) {
    this._isLoading.set(true);
    this._error.set(null);

    try {
      const [statsResponse, debtorsResponse ] = await Promise.all([
        firstValueFrom(this.dashboardService.getStats(poissonnerieId)),
        firstValueFrom(this.dashboardService.getDebtors(poissonnerieId)),

      ]);

      this._stats.set(statsResponse.data);
      this._debtors.set(debtorsResponse.data);

    } catch (err) {
      this._error.set('Erreur lors du chargement des statistiques. Veuillez réessayer.');
    } finally {
      this._isLoading.set(false);
    }
  }

  async loadRoleSpecificData(poissonnerieId: number, role: string) {
      this._isLoading.set(true);
      this._error.set(null);
      const todayDate = new Date().toISOString().split('T')[0];

      if(role === 'CAISSIERE'){
        try {
            const [debtorsResponse, factureResponse, statsResponse] = await Promise.all([
               firstValueFrom(this.dashboardService.getDebtors(poissonnerieId)),
               firstValueFrom(this.dashboardService.getFacturesDuJour(poissonnerieId,todayDate)),
               firstValueFrom(this.dashboardService.getStats(poissonnerieId)) // <-- ADD THIS
            ])

            this._debtors.set(debtorsResponse.data);
            this._facturesDuJour.set(factureResponse.data);    
            this._stats.set(statsResponse.data);
          }catch (err) {
          this._error.set('Erreur lors du chargement des statistiques. Veuillez réessayer.');
        } finally {
          this._isLoading.set(false);
        }
      }

      if(role === 'ENREGISTREUR'){
        try {
            const [factureResponse] = await Promise.all([
               firstValueFrom(this.dashboardService.getFacturesDuJour(poissonnerieId,todayDate))
            ])
            this._facturesDuJour.set(factureResponse.data);   
        }catch (err) {
          this._error.set('Erreur lors du chargement des statistiques. Veuillez réessayer.');
        } finally {
          this._isLoading.set(false);
        }
      }


      

  }

}

