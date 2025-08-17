import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeywordsSearchComponent } from './keywords-search.component';

describe('KeywordsSearchComponent', () => {
  let component: KeywordsSearchComponent;
  let fixture: ComponentFixture<KeywordsSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KeywordsSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KeywordsSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
