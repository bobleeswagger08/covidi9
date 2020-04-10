import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { CandidateDateWiseReport, IListUPHC, IListWard, CandidateReportFilter } from '../model/candidate-input';
import { MatTableDataSource } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApplicationEnvironmentService } from 'app/services/application-environment/application-environment.service';
import { Router } from '@angular/router';
import { CovidI9Service } from '../services/covid-i9.service';
import { constructor } from 'uuid';

@Component({
  selector: 'app-data-tracker-dashboard',
  templateUrl: './data-tracker-dashboard.component.html',
  styleUrls: ['./data-tracker-dashboard.component.scss']
})
export class DataTrackerDashboardComponent implements OnInit {
  @Output('data-load-completed') dataLoadCompleted = new EventEmitter<number>();
  selectedDate: Date = new Date();

  listCandidate: CandidateDateWiseReport[] = [];
  listOfUpHC: IListUPHC[] = [];
  selectedUphcs: string[] = [];
  dataLoadStatus: number = 0;

  reportFilter: CandidateReportFilter = {};

  constructor(private applicationConfig: ApplicationEnvironmentService, private router: Router, private cdr: ChangeDetectorRef
    , private SpinnerService: NgxSpinnerService, private covidService: CovidI9Service) {

  }

  ngOnInit() {
    this.SpinnerService.show();
  }


  uphcDataLoaded() {
    this.getReportData();
  }

  getReportData() {
    this.reportFilter.reportStartDate = this.applicationConfig.configParam.presentAsUTC(this.selectedDate);
    this.reportFilter.reportEndDate = this.applicationConfig.configParam.presentAsUTC(this.selectedDate);
    this.reportFilter.uphcs = this.selectedUphcs ? this.selectedUphcs.reduce(function (s, a) {
      s.push({ uphc: a });
      return s;
    }, []) : [];
    this.dataLoadStatus = 1; // loading started
    this.SpinnerService.show();
    this.covidService.getDailyReportData(this.reportFilter)
      .subscribe((cList: CandidateDateWiseReport[]) => {
        this.listCandidate = cList;
        this.SpinnerService.hide();
        this.dataLoadStatus = 2; // data loaded
        this.dataLoadCompleted.emit(this.dataLoadStatus);
      }, (e) => {
        alert("An unexpected error occurred")
        this.SpinnerService.hide();
        this.dataLoadStatus = 0; // error
        this.dataLoadCompleted.emit(this.dataLoadStatus);
      })
  }

}
