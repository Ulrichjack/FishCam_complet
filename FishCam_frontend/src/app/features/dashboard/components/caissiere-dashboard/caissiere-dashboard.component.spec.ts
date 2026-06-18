import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaissiereDashboardComponent } from './caissiere-dashboard.component';

describe('CaissiereDashboardComponent', () => {
  let component: CaissiereDashboardComponent;
  let fixture: ComponentFixture<CaissiereDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaissiereDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaissiereDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
