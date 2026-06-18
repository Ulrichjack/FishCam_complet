import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoissonneriesListComponent } from './poissonneries-list.component';

describe('PoissonneriesListComponent', () => {
  let component: PoissonneriesListComponent;
  let fixture: ComponentFixture<PoissonneriesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoissonneriesListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoissonneriesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
