import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { firstValueFrom } from 'rxjs';
import { AchatJournalierService } from '../../services/achat-journalier.service';
import { AuthStore } from '../../../../core/stores/auth.store';
import { FactureDetailResponse } from '../../../../core/models/facture.model';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { LigneFormComponent } from '../../../../shared/components/ligne-form/ligne-form.component';
import { CurrencyFcfaPipe } from '../../../../shared/pipes/currency-fcfa.pipe';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LivreurService } from '../../../livreurs/services/livreur.service';
import { EvaluationService } from '../../../livreurs/services/evaluation.service';
import { StarRatingComponent } from '../../../../shared/components/star-rating/star-rating.component';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { EvaluationLivreurResponse } from '../../../../core/models/evaluation.model';
import { CreateEvaluationRequest } from '../../../livreurs/models/evaluation-request.model';

@Component({
  selector: 'app-facture-detail',
  standalone: true,
  imports: [
    RouterLink, DatePipe,  ReactiveFormsModule,
    LucideAngularModule, ConfirmDialogComponent, LigneFormComponent, CurrencyFcfaPipe,
    StarRatingComponent, ModalComponent
  ],
  templateUrl: './facture-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FactureDetailComponent {

  private readonly route = inject(ActivatedRoute);
  private readonly achatService = inject(AchatJournalierService);
  public readonly authStore = inject(AuthStore);
  private readonly fb = inject(FormBuilder);
  private readonly livreurService = inject(LivreurService);
  private readonly evaluationService = inject(EvaluationService);

  private readonly paramMap = toSignal(this.route.paramMap);

  facture = signal<FactureDetailResponse | null>(null);
  evaluation = signal<EvaluationLivreurResponse | null>(null); // <-- SIGNAL POUR L'ÉVALUATION
  
  // Computed pour savoir si on a déjà évalué
  hasEvaluation = computed(() => this.evaluation() !== null);

  isLoading = signal(false);
  error = signal<string | null>(null);
  isConfirmOpen = signal(false);
  showAddForm = signal(false);
  isDeleteConfirmOpen = signal(false);
  ligneToDelete = signal<number | null>(null);
  isEvalModalOpen = signal(false);
  livreurs = signal<any[]>([]);

  evalForm = this.fb.group({
    livreurId: [null, Validators.required],
    qualiteProduit: [null, [Validators.required, Validators.min(1), Validators.max(5)]],
    respectPoids: [null, [Validators.required, Validators.min(1), Validators.max(5)]],
    problemeSignale: [false],
    commentaire: ['']
  });

  constructor() {
    effect(() => {
      const idParam = this.paramMap()?.get('id');
      if (idParam) {
        this.loadFacture(Number(idParam));
      }
    });
  }

  async loadFacture(id: number) {
    this.isLoading.set(true);
    this.error.set(null);
    try {
      // CHARGEMENT EN PARALLÈLE DE LA FACTURE ET DE L'ÉVALUATION
      const [factureRes, evalRes] = await Promise.all([
        firstValueFrom(this.achatService.getFactureDetail(id)),
        firstValueFrom(this.evaluationService.getEvaluationByFacture(id))
      ]);
      
      this.facture.set(factureRes.data);
      this.evaluation.set(evalRes.data); // Sera null si pas d'évaluation
      
    } catch (err) {
      this.error.set('Erreur lors du chargement de la facture');
    } finally {
      this.isLoading.set(false);
    }
  }

  openCloseDialog() {
    this.isConfirmOpen.set(true);
  }

  async executeClose() {
    const factureId = this.facture()?.id;
    if (!factureId) return;

    try {
      await firstValueFrom(this.achatService.cloturerFacture(factureId));
      await this.loadFacture(factureId);
    } catch (err) {
      this.error.set('Erreur lors de la clôture de la facture');
    } finally {
      this.isConfirmOpen.set(false);
    }
  }

  async downloadPdf() {
    const fact = this.facture();
    if (!fact) return;

    try {
      const blob = await firstValueFrom(this.achatService.downloadFacturePdf(fact.id));
      const url = window.URL.createObjectURL(blob);
      
      const cleanFournisseur = fact.fournisseurNom.replace(/[^a-zA-Z0-9]/g, '_');
      const beauNom = `Facture_${cleanFournisseur}_${fact.dateAchat}.pdf`;
      
      const a = document.createElement('a');
      a.href = url;
      a.download = beauNom;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

    } catch(error) {
      this.error.set('Erreur lors du téléchargement du PDF');
    }
  }

  async onLigneAdded(ligneData: any) {
    const factureId = this.facture()?.id;
    if (!factureId) return;

    this.isLoading.set(true);
    try {
      await firstValueFrom(this.achatService.addLigne(factureId, ligneData));
      await this.loadFacture(factureId); 
    } catch (err) {
      this.error.set("Erreur lors de l'ajout de la ligne");
      this.isLoading.set(false);
    }
  }

  deleteLigne(ligneId: number) {
    this.ligneToDelete.set(ligneId);
    this.isDeleteConfirmOpen.set(true);
  }

  async executeDeleteLigne() {
    const factureId = this.facture()?.id;
    const ligneId = this.ligneToDelete();
    if (!factureId || !ligneId) return;

    this.isLoading.set(true);
    try {
      await firstValueFrom(this.achatService.deleteLigne(factureId, ligneId));
      await this.loadFacture(factureId);
    } catch (err) {
      this.error.set("Erreur lors de la suppression de la ligne");
    } finally {
      this.isDeleteConfirmOpen.set(false);
      this.ligneToDelete.set(null);
      this.isLoading.set(false);
    }
  }

  getTotalPoids(lignes: any[] | undefined): number {
    if (!lignes) return 0;
    return lignes.reduce((sum, ligne) => sum + ligne.poidsKg, 0);
  }

  openEvaluationModal() {
    this.isEvalModalOpen.set(true);
    this.evalForm.reset();
    this.livreurService.getAll().subscribe({
      next: (response) => {
        this.livreurs.set(response.data);
      },
      error: () => {
        this.error.set("Erreur lors du chargement des livreurs");
      }
    });
  }

  async submitEvaluation() {
    if (this.evalForm.invalid) {
      this.error.set("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const formValue = this.evalForm.value;
    
    if (!formValue.qualiteProduit || formValue.qualiteProduit < 1 || 
        !formValue.respectPoids || formValue.respectPoids < 1) {
      this.error.set("Veuillez donner une note d'au moins 1 étoile.");
      return;
    }

    const factureId = this.facture()?.id;
    if (!factureId) return;

    const evalData: CreateEvaluationRequest = {
      achatJournalierId: factureId,
      livreurId: formValue.livreurId!,
      qualiteProduit: formValue.qualiteProduit!,
      respectPoids: formValue.respectPoids!,
      problemeSignale: formValue.problemeSignale ?? false,
      commentaire: formValue.commentaire ?? undefined
    };

    this.isLoading.set(true);
    try {
      const response = await firstValueFrom(this.evaluationService.submitEvaluation(evalData));
      this.evaluation.set(response.data); // On met à jour le signal avec la nouvelle évaluation !
      this.isEvalModalOpen.set(false);
    } catch (err: any) {
      this.error.set(err.error?.message || "Erreur lors de la soumission de l'évaluation");
    } finally {
      this.isLoading.set(false);
    }
  }
}