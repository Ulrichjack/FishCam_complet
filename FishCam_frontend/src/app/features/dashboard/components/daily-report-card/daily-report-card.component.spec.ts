import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyReportCardComponent } from './daily-report-card.component';

describe('DailyReportCardComponent', () => {
  let component: DailyReportCardComponent;
  let fixture: ComponentFixture<DailyReportCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyReportCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyReportCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
