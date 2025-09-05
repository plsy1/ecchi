import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JavtrailersComponent } from './javtrailers.component';

describe('JavtrailersComponent', () => {
  let component: JavtrailersComponent;
  let fixture: ComponentFixture<JavtrailersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JavtrailersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JavtrailersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
