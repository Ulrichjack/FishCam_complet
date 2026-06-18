import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgClass } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [NgClass, LucideAngularModule],
  templateUrl: './stat-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatCardComponent {
  // --- SIGNAL INPUTS ---
  // This is how we receive data in Angular 20!
  label = input.required<string>();
  value = input.required<string>();
  icon = input.required<string>();
  colorVariant = input.required<'green' | 'red' | 'orange' | 'yellow'>();

  // --- COMPUTED ---
  // This signal automatically calculates the correct Tailwind classes based on the color!
  colorClasses = computed(() => {
    switch (this.colorVariant()) {
      case 'green':
        return 'bg-fc-green-light text-fc-green';
      case 'red':
        return 'bg-fc-red-light text-fc-red';
      case 'orange':
        return 'bg-orange-100 text-fc-orange';
      case 'yellow':
        return 'bg-fc-yellow-light text-fc-yellow-dark';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  });
}
