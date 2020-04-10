import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { WebDataRocksPivot } from 'app/library/rtps/webdatarocks/webdatarocks.angular4';
import { IListCandidate } from 'app/library/covid-i9/model/candidate-input';
import { CovidI9Service } from 'app/library/covid-i9/services/covid-i9.service';
import { DataTrackerDashboardComponent } from 'app/library/covid-i9/data-tracker-dashboard/data-tracker-dashboard.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-blank',
  templateUrl: './app-blank.component.html',
  styleUrls: ['./app-blank.component.css']
})
export class AppBlankComponent implements OnInit {
  isInitializing: boolean;
  constructor(private SpinnerService: NgxSpinnerService) {
    this.isInitializing = true;
  }

  ngOnInit() {
    if (this.isInitializing) {
      this.SpinnerService.show();
    }
  }

  dataLoadComplete(event: any) {
    if (event && event > 1) {
      this.isInitializing = false;
    }
    this.SpinnerService.hide();

  }

}
