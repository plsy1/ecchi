import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardEmbyViewsComponent } from './card-emby-views.component';

describe('CardEmbyViewsComponent', () => {
  let component: CardEmbyViewsComponent;
  let fixture: ComponentFixture<CardEmbyViewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardEmbyViewsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardEmbyViewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
