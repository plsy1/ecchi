import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardEmbyTotalCountComponent } from './card-emby-total-count.component';

describe('CardEmbyTotalCountComponent', () => {
  let component: CardEmbyTotalCountComponent;
  let fixture: ComponentFixture<CardEmbyTotalCountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardEmbyTotalCountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardEmbyTotalCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
