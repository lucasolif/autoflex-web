import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionSuggestionComponent } from './production-suggestion.component';

describe('ProductionSuggestionComponent', () => {
  let component: ProductionSuggestionComponent;
  let fixture: ComponentFixture<ProductionSuggestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductionSuggestionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionSuggestionComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
