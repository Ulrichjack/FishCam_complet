import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnregistreurDashboardComponent } from './enregistreur-dashboard.component';

describe('EnregistreurDashboardComponent', () => {
  let component: EnregistreurDashboardComponent;
  let fixture: ComponentFixture<EnregistreurDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnregistreurDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnregistreurDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
