import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActressInformationComponent } from './actress-information.component';

describe('ActressInformationComponent', () => {
  let component: ActressInformationComponent;
  let fixture: ComponentFixture<ActressInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActressInformationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActressInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
