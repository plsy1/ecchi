import { Injectable } from '@angular/core';
import { CommonService } from '../../../common.service';

@Injectable({ providedIn: 'root' })
export class HomeService {
  private _isSidebarOpen = true;

  constructor(private common: CommonService) {}

  get isSidebarOpen() {
    return this._isSidebarOpen;
  }

  setSidebarOpen(state: boolean) {
    this._isSidebarOpen = state;
  }

  set isSidebarOpen(state: boolean) {
    this._isSidebarOpen = state;
  }
}
