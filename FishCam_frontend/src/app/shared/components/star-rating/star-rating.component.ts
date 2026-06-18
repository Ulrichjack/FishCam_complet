import { ChangeDetectionStrategy, Component, forwardRef, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [LucideAngularModule, NgClass],
  template: `
    <div class="flex items-center gap-1">
      @for (star of stars; track star) {
        <button type="button" 
                (click)="setRating(star)"
                (mouseenter)="hoverRating.set(star)"
                (mouseleave)="hoverRating.set(0)"
                class="focus:outline-none transition-transform hover:scale-110"
                [disabled]="isDisabled()">
          <lucide-icon name="star" 
                       class="h-8 w-8 transition-colors duration-200"
                       [ngClass]="{
                         'fill-fc-yellow text-fc-yellow': star <= (hoverRating() || currentRating()),
                         'text-gray-300': star > (hoverRating() || currentRating()),
                         'opacity-50 cursor-not-allowed': isDisabled()
                       }">
          </lucide-icon>
        </button>
      }
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StarRatingComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StarRatingComponent implements ControlValueAccessor {
  
  stars = [1, 2, 3, 4, 5];
  
  currentRating = signal<number>(0);
  hoverRating = signal<number>(0);
  isDisabled = signal<boolean>(false);

  // Fonctions de callback pour Angular Forms
  onChange: any = () => {};
  onTouch: any = () => {};

  // 1. Reçoit la valeur du formulaire
  writeValue(value: number): void {
    this.currentRating.set(value || 0);
  }

  // 2. Enregistre la fonction de changement
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // 3. Enregistre la fonction de touch (blur)
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  // 4. Gère l'état désactivé
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  // Action utilisateur
  setRating(rating: number) {
    if (this.isDisabled()) return;
    
    this.currentRating.set(rating);
    this.onChange(rating);
    this.onTouch();
  }
}