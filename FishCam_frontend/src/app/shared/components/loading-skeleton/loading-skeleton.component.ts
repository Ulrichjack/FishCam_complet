import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-loading-skeleton',
  standalone: true,
  template: `
    <div class="w-full animate-pulse space-y-4 py-4">
      @for (i of [].constructor(rows()); track $index) {
        <div class="flex items-center justify-between gap-4 px-4">
          <div class="h-4 bg-gray-200 rounded w-1/4"></div>
          <div class="h-4 bg-gray-200 rounded w-1/4"></div>
          <div class="h-4 bg-gray-200 rounded w-1/4"></div>
          <div class="h-8 bg-gray-200 rounded w-12"></div>
        </div>
        <div class="h-px bg-gray-100 w-full"></div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingSkeletonComponent {
  rows = input<number>(5); // Nombre de lignes par défaut
}