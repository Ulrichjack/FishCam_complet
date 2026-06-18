import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-daily-report-card',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './daily-report-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DailyReportCardComponent {

  // This receives the message from the Smart Component
  reportMessage = input.required<string>();

}
