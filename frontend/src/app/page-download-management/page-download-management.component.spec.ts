import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageDownloadManagementComponent } from './page-download-management.component';

describe('PageDownloadManagementComponent', () => {
  let component: PageDownloadManagementComponent;
  let fixture: ComponentFixture<PageDownloadManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageDownloadManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageDownloadManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
