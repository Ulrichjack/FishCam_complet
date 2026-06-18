import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FactureFormComponent } from '../../components/facture-form/facture-form.component';

@Component({
  selector: 'app-facture-create',
  standalone: true,
  imports: [FactureFormComponent],
  template: `<app-facture-form></app-facture-form>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FactureCreateComponent {}