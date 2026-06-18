import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideOverPanelComponent } from './slide-over-panel.component';

describe('SlideOverPanelComponent', () => {
  let component: SlideOverPanelComponent;
  let fixture: ComponentFixture<SlideOverPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlideOverPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlideOverPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
