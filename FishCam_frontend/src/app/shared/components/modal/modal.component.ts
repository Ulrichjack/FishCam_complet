import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalComponent {
  
  // Controls if the modal is visible
  isOpen = input.required<boolean>();
  
  // The title of the modal
  title = input.required<string>();

  // Emits when the user clicks the X or the background
  closed = output<void>();

}