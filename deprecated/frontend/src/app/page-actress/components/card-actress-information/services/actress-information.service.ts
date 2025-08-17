import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ActressInformationService {
  public actressData: any;

  saveState(actressData: any) {
    this.actressData = actressData;
  }
}
