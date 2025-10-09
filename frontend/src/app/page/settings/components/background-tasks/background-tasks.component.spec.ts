import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackgroundTasksComponent } from './background-tasks.component';

describe('BackgroundTasksComponent', () => {
  let component: BackgroundTasksComponent;
  let fixture: ComponentFixture<BackgroundTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackgroundTasksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BackgroundTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
