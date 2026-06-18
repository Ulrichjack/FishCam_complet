import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-greeting-header',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './greeting-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GreetingHeaderComponent {
  
  // DIRECTIVE: We receive the user's name from the parent component
  userName = input.required<string>();
  
  today = new Date();

  // DIRECTIVE: Computed signal to determine Bonjour or Bonsoir
  greeting = computed(() => {
    const currentHour = this.today.getHours();
    return (currentHour >= 5 && currentHour < 18) ? 'Bonjour' : 'Bonsoir';
  });
}