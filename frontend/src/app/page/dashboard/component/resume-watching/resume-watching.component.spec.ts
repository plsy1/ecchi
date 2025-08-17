import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeWatchingComponent } from './resume-watching.component';

describe('ResumeWatchingComponent', () => {
  let component: ResumeWatchingComponent;
  let fixture: ComponentFixture<ResumeWatchingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumeWatchingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumeWatchingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
