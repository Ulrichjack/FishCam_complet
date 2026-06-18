import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BilansPageComponent } from './bilans-page.component';

describe('BilansPageComponent', () => {
  let component: BilansPageComponent;
  let fixture: ComponentFixture<BilansPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BilansPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BilansPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
