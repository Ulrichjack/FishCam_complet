import { ChangeDetectionStrategy, Component, effect, inject, input, OnInit, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { CreateLivreurRequest } from '../../models/livreur-request.model';
import { FournisseurService } from '../../../fournisseurs/services/fournisseur.service';
import { LivreurResponse } from '../../../../core/models/livreur.model';

@Component({
  selector: 'app-livreur-form',
  standalone: true,
  imports: [ReactiveFormsModule, LucideAngularModule],
  templateUrl: './livreur-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LivreurFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly fournisseurService = inject(FournisseurService);

  readonly isLoading = input<boolean>(false);
  readonly livreurToEdit = input<LivreurResponse | null>(null); // <-- AJOUT

  readonly save = output<CreateLivreurRequest>();
  readonly cancel = output<void>();

  fournisseurs = signal<any[]>([]);

  livreurForm: FormGroup = this.fb.group({
    nom: ['', Validators.required],
    prenom: ['', Validators.required],
    telephone: ['', [Validators.maxLength(9)]],
    fournisseurId: [null, Validators.required]
  });

  constructor() {
    // Remplir le formulaire si on est en mode édition
    effect(() => {
      const livreur = this.livreurToEdit();
      if (livreur) {
        this.livreurForm.patchValue({
          nom: livreur.nom,
          prenom: livreur.prenom,
          telephone: livreur.telephone,
          fournisseurId: livreur.fournisseurId
        });
      } else {
        this.livreurForm.reset();
      }
    });
  }

  ngOnInit() {
    this.fournisseurService.getAll().subscribe(res => {
      this.fournisseurs.set(res.data);
    });
  }

  onSubmit() {
    if (this.livreurForm.valid) {
      this.save.emit(this.livreurForm.value);
    } else {
      this.livreurForm.markAllAsTouched();
    }
  }
}