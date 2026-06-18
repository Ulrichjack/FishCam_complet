import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebtorPillComponent } from './debtor-pill.component';

describe('DebtorPillComponent', () => {
  let component: DebtorPillComponent;
  let fixture: ComponentFixture<DebtorPillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DebtorPillComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DebtorPillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
