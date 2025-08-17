import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformerCollectionListComponent } from './collect.component';

describe('ActressCollectListComponent', () => {
  let component: PerformerCollectionListComponent;
  let fixture: ComponentFixture<PerformerCollectionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerformerCollectionListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerformerCollectionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
