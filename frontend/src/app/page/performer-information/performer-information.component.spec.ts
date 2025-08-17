import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformerInformationComponent } from './performer-information.component';

describe('PerformerInformationComponent', () => {
  let component: PerformerInformationComponent;
  let fixture: ComponentFixture<PerformerInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerformerInformationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerformerInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
