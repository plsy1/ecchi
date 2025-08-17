import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryViewComponent } from './library-view.component';

describe('LibraryViewComponent', () => {
  let component: LibraryViewComponent;
  let fixture: ComponentFixture<LibraryViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibraryViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibraryViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
