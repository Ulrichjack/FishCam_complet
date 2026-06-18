import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductAutocompleteComponent } from './product-autocomplete.component';

describe('ProductAutocompleteComponent', () => {
  let component: ProductAutocompleteComponent;
  let fixture: ComponentFixture<ProductAutocompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductAutocompleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
