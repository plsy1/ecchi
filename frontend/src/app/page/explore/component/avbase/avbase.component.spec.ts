import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvbaseComponent } from './avbase.component';

describe('AvbaseComponent', () => {
  let component: AvbaseComponent;
  let fixture: ComponentFixture<AvbaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvbaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvbaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
