import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    <div class="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div class="h-16 w-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mb-4">
        <lucide-icon [name]="icon()" class="h-8 w-8"></lucide-icon>
      </div>
      <h3 class="text-lg font-bold text-gray-900 mb-1">{{ title() }}</h3>
      <p class="text-sm text-gray-500 max-w-sm mb-6">{{ message() }}</p>
      
      @if (actionLabel()) {
        <button (click)="actionClicked.emit()" 
                class="inline-flex items-center gap-2 bg-fc-green hover:bg-fc-green-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <lucide-icon name="plus" class="h-4 w-4"></lucide-icon>
          {{ actionLabel() }}
        </button>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmptyStateComponent {
  icon = input<string>('folder-open');
  title = input<string>('Aucune donnée');
  message = input<string>('Il n\'y a rien à afficher pour le moment.');
  actionLabel = input<string | null>(null);
  
  actionClicked = output<void>();
}