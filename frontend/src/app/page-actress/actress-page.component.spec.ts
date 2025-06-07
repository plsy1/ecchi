import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActressPageComponent } from './actress-page.component';

describe('ActressPageComponent', () => {
  let component: ActressPageComponent;
  let fixture: ComponentFixture<ActressPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActressPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ActressPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
