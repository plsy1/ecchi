import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardEmbyLatestItemsComponent } from './card-emby-latest-items.component';

describe('CardEmbyLatestItemsComponent', () => {
  let component: CardEmbyLatestItemsComponent;
  let fixture: ComponentFixture<CardEmbyLatestItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardEmbyLatestItemsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardEmbyLatestItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
