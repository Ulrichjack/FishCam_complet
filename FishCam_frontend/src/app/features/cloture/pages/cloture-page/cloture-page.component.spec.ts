import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloturePageComponent } from './cloture-page.component';

describe('CloturePageComponent', () => {
  let component: CloturePageComponent;
  let fixture: ComponentFixture<CloturePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CloturePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CloturePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
