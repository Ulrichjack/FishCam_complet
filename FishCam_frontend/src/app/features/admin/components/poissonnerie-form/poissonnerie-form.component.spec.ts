import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoissonnerieFormComponent } from './poissonnerie-form.component';

describe('PoissonnerieFormComponent', () => {
  let component: PoissonnerieFormComponent;
  let fixture: ComponentFixture<PoissonnerieFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoissonnerieFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoissonnerieFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
