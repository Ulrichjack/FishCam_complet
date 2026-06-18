import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GreetingHeaderComponent } from './greeting-header.component';

describe('GreetingHeaderComponent', () => {
  let component: GreetingHeaderComponent;
  let fixture: ComponentFixture<GreetingHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GreetingHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GreetingHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
