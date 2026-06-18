import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecapitulatifPageComponent } from './recapitulatif-page.component';

describe('RecapitulatifPageComponent', () => {
  let component: RecapitulatifPageComponent;
  let fixture: ComponentFixture<RecapitulatifPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecapitulatifPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecapitulatifPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
