import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';
import { LucideAngularModule } from 'lucide-angular';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [LucideAngularModule, NgClass],
  template: `
    <div class="fixed top-4 right-4 z-100 flex flex-col gap-3 pointer-events-none">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="pointer-events-auto w-80 overflow-hidden rounded-lg border shadow-lg bg-white animate-in slide-in-from-right-8 fade-in duration-300"
             [ngClass]="{
               'border-fc-green': toast.type === 'SUCCESS',
               'border-fc-red': toast.type === 'ERROR',
               'border-fc-yellow': toast.type === 'WARNING',
               'border-blue-200': toast.type === 'INFO'
             }">
          
          <div class="flex items-start p-4"
               [ngClass]="{
                 'bg-fc-green-light': toast.type === 'SUCCESS',
                 'bg-fc-red-light': toast.type === 'ERROR',
                 'bg-fc-yellow-light': toast.type === 'WARNING',
                 'bg-blue-50': toast.type === 'INFO'
               }">
            
            <!-- Icon -->
            <div class="shrink-0 mt-0.5">
              @if (toast.type === 'SUCCESS') { <lucide-icon name="circle-check" class="h-5 w-5 text-fc-green"></lucide-icon> }
              @if (toast.type === 'ERROR') { <lucide-icon name="x-circle" class="h-5 w-5 text-fc-red"></lucide-icon> }
              @if (toast.type === 'WARNING') { <lucide-icon name="triangle-alert" class="h-5 w-5 text-fc-yellow-dark"></lucide-icon> }
              @if (toast.type === 'INFO') { <lucide-icon name="info" class="h-5 w-5 text-blue-500"></lucide-icon> }
            </div>

            <!-- Message -->
            <div class="ml-3 w-0 flex-1 pt-0.5">
              <p class="text-sm font-medium"
                 [ngClass]="{
                   'text-fc-green': toast.type === 'SUCCESS',
                   'text-fc-red': toast.type === 'ERROR',
                   'text-fc-yellow-dark': toast.type === 'WARNING',
                   'text-blue-800': toast.type === 'INFO'
                 }">
                {{ toast.message }}
              </p>
            </div>

            <!-- Close Button -->
            <div class="ml-4 flex shrink-0">
              <button (click)="toastService.remove(toast.id)" class="inline-flex rounded-md text-gray-400 hover:text-gray-500 focus:outline-none">
                <lucide-icon name="x" class="h-4 w-4"></lucide-icon>
              </button>
            </div>
          </div>

          <!-- Progress Bar (4 seconds) -->
          <div class="h-1 w-full bg-white/50">
            <div class="h-full animate-[shrink_4s_linear_forwards]"
                 [ngClass]="{
                   'bg-fc-green': toast.type === 'SUCCESS',
                   'bg-fc-red': toast.type === 'ERROR',
                   'bg-fc-yellow': toast.type === 'WARNING',
                   'bg-blue-400': toast.type === 'INFO'
                 }">
            </div>
          </div>

        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes shrink {
      from { width: 100%; }
      to { width: 0%; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToastComponent {
  readonly toastService = inject(ToastService);
}