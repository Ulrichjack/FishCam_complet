import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertRibbonComponent } from './alert-ribbon.component';

describe('AlertRibbonComponent', () => {
  let component: AlertRibbonComponent;
  let fixture: ComponentFixture<AlertRibbonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertRibbonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertRibbonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
