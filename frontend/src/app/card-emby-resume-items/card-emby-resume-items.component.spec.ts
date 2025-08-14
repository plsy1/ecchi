import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardEmbyResumeItemsComponent } from './card-emby-resume-items.component';

describe('CardEmbyResumeItemsComponent', () => {
  let component: CardEmbyResumeItemsComponent;
  let fixture: ComponentFixture<CardEmbyResumeItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardEmbyResumeItemsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardEmbyResumeItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
