import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { IListCandidate, IListUPHC, IListWard, CandidateReportFilter, CandidateDateWiseReport } from '../model/candidate-input';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CovidI9Service } from '../services/covid-i9.service';

@Component({
  selector: 'app-daily-report',
  templateUrl: './daily-report.component.html',
  styleUrls: ['./daily-report.component.scss']
})
export class DailyReportComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  displayedColumns: string[] = ['source', 'serialNo', 'dateOfArival', 'name', 'mobileNo', 'uphc', 'dateOfContacted'];
  listCandidate: CandidateDateWiseReport[];
  listOfUpHC: IListUPHC[] = [];
  listOfWards: IListWard[] = [];

  reportFilter: CandidateReportFilter = {};
  dataSource: MatTableDataSource<CandidateDateWiseReport>;
  constructor(private router: Router, private cdr: ChangeDetectorRef
    , private SpinnerService: NgxSpinnerService, private covidService: CovidI9Service) {
      this.reportFilter.reportStartDate=new Date();
      this.reportFilter.reportEndDate=new Date('2020-03-10T00:00:00');
  }

  ngOnInit() {
    this.getReportData();
  }

  getReportData() {
    this.covidService.getDailyReportData(this.reportFilter)
      .subscribe((cList: CandidateDateWiseReport[]) => {
        //this.listServiceRequest = srList;
        this.dataSource = new MatTableDataSource(cList);
       // console.log(cList);
        this.cdr.detectChanges();
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.SpinnerService.hide();
      }, (e) => {
        alert("An unexpected error occurred")
        this.SpinnerService.hide();
      })
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
