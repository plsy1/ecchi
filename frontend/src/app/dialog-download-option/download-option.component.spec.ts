import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadOptionComponent } from './download-option.component';

describe('DownloadOptionComponent', () => {
  let component: DownloadOptionComponent;
  let fixture: ComponentFixture<DownloadOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DownloadOptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloadOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
