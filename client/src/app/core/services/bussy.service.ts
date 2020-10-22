import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class BussyService {
  bussyRequestCount = 0;

  constructor(private spinnerService: NgxSpinnerService) { }

  bussy() {
    this.bussyRequestCount++;
    this.spinnerService.show(undefined, {
      type: 'ball-spin-clockwise-fade',
      bdColor: 'rgba(255, 255, 255,0.7)',
      color: '#e95420'
    });
  }

  idle() {
    this.bussyRequestCount--;
    if (this.bussyRequestCount <= 0) {
      this.bussyRequestCount = 0;
      this.spinnerService.hide();
    }
    
  }
}
