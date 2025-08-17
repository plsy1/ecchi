import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryStatisticComponent } from './library-statistic.component';

describe('LibraryStatisticComponent', () => {
  let component: LibraryStatisticComponent;
  let fixture: ComponentFixture<LibraryStatisticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibraryStatisticComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibraryStatisticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
