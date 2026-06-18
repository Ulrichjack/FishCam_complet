import { inject, Injectable, signal, computed } from "@angular/core";
import { EvaluationService } from "../services/evaluation.service";
import { firstValueFrom } from "rxjs";
import { EvaluationLivreurResponse } from "../../../core/models/evaluation.model";

@Injectable({ providedIn: 'root' })
export class EvaluationStore {
  private readonly evaluationService = inject(EvaluationService);

  // --- STATE SIGNALS ---
  private readonly _evaluations = signal<EvaluationLivreurResponse[]>([]);
  private readonly _isLoading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  // --- READONLY SIGNALS ---
  readonly evaluations = this._evaluations.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  // --- COMPUTED SIGNALS (Pour les statistiques du livreur) ---
  readonly moyenneQualite = computed(() => {
    const evals = this._evaluations();
    if (evals.length === 0) return 0;
    const sum = evals.reduce((acc, curr) => acc + curr.qualiteProduit, 0);
    return sum / evals.length;
  });

  readonly moyennePoids = computed(() => {
    const evals = this._evaluations();
    if (evals.length === 0) return 0;
    const sum = evals.reduce((acc, curr) => acc + curr.respectPoids, 0);
    return sum / evals.length;
  });

  readonly nombreProblemes = computed(() => {
    return this._evaluations().filter(e => e.problemeSignale).length;
  });

  // --- ACTIONS ---
  async loadEvaluations(livreurId: number) {
    this._isLoading.set(true);
    this._error.set(null);
    try {
      const response = await firstValueFrom(this.evaluationService.getEvaluation(livreurId));
      this._evaluations.set(response.data);
    } catch (error) {
      this._error.set('Erreur lors du chargement des évaluations');
    } finally {
      this._isLoading.set(false);
    }
  }
}