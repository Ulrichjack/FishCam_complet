import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-error-state',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    <div class="bg-fc-red-light border border-fc-red/30 p-8 rounded-xl flex flex-col items-center text-center m-4">
      <div class="h-12 w-12 bg-red-100 text-fc-red rounded-full flex items-center justify-center mb-3">
        <lucide-icon name="triangle-alert" class="h-6 w-6"></lucide-icon>
      </div>
      <h3 class="font-bold text-lg text-gray-900 mb-1">Impossible de charger les données</h3>
      <p class="text-sm text-fc-red mb-5">{{ error() }}</p>
      
      <button (click)="retryClicked.emit()" 
              class="inline-flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
        <lucide-icon name="refresh-cw" class="h-4 w-4"></lucide-icon>
        Réessayer
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorStateComponent {
  error = input.required<string>();
  retryClicked = output<void>();
}