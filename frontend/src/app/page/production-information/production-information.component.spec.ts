import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionInformationComponent } from './production-information.component';

describe('ProductionInformationComponent', () => {
  let component: ProductionInformationComponent;
  let fixture: ComponentFixture<ProductionInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductionInformationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
