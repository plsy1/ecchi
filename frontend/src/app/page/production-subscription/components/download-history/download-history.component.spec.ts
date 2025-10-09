import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadHistoryComponent } from './download-history.component';

describe('DownloadHistoryComponent', () => {
  let component: DownloadHistoryComponent;
  let fixture: ComponentFixture<DownloadHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DownloadHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloadHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
