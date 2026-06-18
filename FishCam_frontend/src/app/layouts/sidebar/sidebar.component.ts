import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { AuthStore } from '../../core/stores/auth.store';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [LucideAngularModule, RouterLink, RouterLinkActive, ModalComponent, ReactiveFormsModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {

  public readonly authStore = inject(AuthStore);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  isAdministrationMenuOpen = signal(false);
  isGestionMenuOpen = signal(false);
  
  // Signaux pour la modale de mot de passe
  isPasswordModalOpen = signal(false);
  isLoadingPwd = signal(false);
  pwdError = signal<string | null>(null);

  readonly closeRequested = output<void>();

  passwordForm: FormGroup = this.fb.group({
    ancienMotDePasse: ['', Validators.required],
    nouveauMotDePasse: ['', [Validators.required, Validators.minLength(6)]],
    confirmerMdp: ['', Validators.required]
  });

  logout() {
    this.authStore.logout();
    this.router.navigate(['/login']);
  }

  toggleAdministrationMenu() {
    this.isAdministrationMenuOpen.set(!this.isAdministrationMenuOpen());
  }

  toggleGestionMenu() {
    this.isGestionMenuOpen.set(!this.isGestionMenuOpen());
  }

  openPasswordModal() {
    this.passwordForm.reset();
    this.pwdError.set(null);
    this.isPasswordModalOpen.set(true);
  }

  async onChangePassword() {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const vals = this.passwordForm.value;
    if (vals.nouveauMotDePasse !== vals.confirmerMdp) {
      this.pwdError.set("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }

    this.isLoadingPwd.set(true);
    this.pwdError.set(null);

    try {
      await firstValueFrom(this.authService.changePassword({
        ancienMotDePasse: vals.ancienMotDePasse,
        nouveauMotDePasse: vals.nouveauMotDePasse
      }));
      this.isPasswordModalOpen.set(false);
      alert("Mot de passe modifié avec succès !");
    } catch (error: any) {
      this.pwdError.set(error.error?.message || "Erreur lors de la modification.");
    } finally {
      this.isLoadingPwd.set(false);
    }
  }
}