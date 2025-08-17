import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FanzaComponent } from './fanza.component';

describe('FanzaComponent', () => {
  let component: FanzaComponent;
  let fixture: ComponentFixture<FanzaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FanzaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FanzaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
