import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActressCollectListComponent } from './actress-collect-list.component';

describe('ActressCollectListComponent', () => {
  let component: ActressCollectListComponent;
  let fixture: ComponentFixture<ActressCollectListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActressCollectListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActressCollectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
