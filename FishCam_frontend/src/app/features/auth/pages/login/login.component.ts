import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink,RouterModule],
  templateUrl: './login.component.html', // On change aussi le lien vers le HTML
  styleUrl: './login.component.css',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class LoginComponent {

  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  isPasswordVisible = signal<boolean>(false);

  loginForm: FormGroup = this.fb.group({
    phone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

    async  onSubmit(){
    if(this.loginForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const {phone, password} = this.loginForm.value;

    try{
          await firstValueFrom(this.authService.login(phone, password));

          this.isLoading.set(false);
          this.router.navigate(['/dashboard'])
      } catch (err){
            this.isLoading.set(false);
            this.errorMessage.set("Téléphone ou mot de passe incorrect");
      }
    };

}




