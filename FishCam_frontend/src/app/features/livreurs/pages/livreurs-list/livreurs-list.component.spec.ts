import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LivreursListComponent } from './livreurs-list.component';

describe('LivreursListComponent', () => {
  let component: LivreursListComponent;
  let fixture: ComponentFixture<LivreursListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LivreursListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LivreursListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
