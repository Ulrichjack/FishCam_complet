import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-slide-over-panel',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './slide-over-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SlideOverPanelComponent {
  
  // Controls if the panel is visible or hidden
  isOpen = input.required<boolean>();
  
  // The title at the top of the panel
  title = input.required<string>();

  // Emits an event when the user clicks the close (X) button or the background overlay
  closed = output<void>();


  


}