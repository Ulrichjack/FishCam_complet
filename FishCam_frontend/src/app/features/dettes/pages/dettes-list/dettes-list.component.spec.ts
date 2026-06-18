import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DettesListComponent } from './dettes-list.component';

describe('DettesListComponent', () => {
  let component: DettesListComponent;
  let fixture: ComponentFixture<DettesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DettesListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DettesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
