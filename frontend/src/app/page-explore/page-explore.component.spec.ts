import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageExploreComponent } from './page-explore.component';

describe('PageExploreComponent', () => {
  let component: PageExploreComponent;
  let fixture: ComponentFixture<PageExploreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageExploreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageExploreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
