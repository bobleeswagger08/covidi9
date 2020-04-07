import { Component, OnInit, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
import { IListCandidate, IListUPHC, IListWard, CandidateReportFilter, CandidateDateWiseReport } from '../model/candidate-input';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CovidI9Service } from '../services/covid-i9.service';
import * as XLSX from "xlsx";
import { ApplicationEnvironmentService } from 'app/services/application-environment/application-environment.service';

@Component({
  selector: 'app-daily-report',
  templateUrl: './daily-report.component.html',
  styleUrls: ['./daily-report.component.scss']
})
export class DailyReportComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('summaryTable', { static: false }) reportTable: ElementRef;
  // displayedColumns: string[] = ['source', 'serialNo', 'dateOfArival', 'name', 'mobileNo', 'uphc','isEverContacted', 'dateOfContacted'];
  displayedColumns: string[] = ['source', 'serialNo','name', 'flightNumber', 'countryVisited','dob','sex','flightNo','arivalDate',
  'mobileNo','address','finalDestination','block','state','isEverContacted','isContactedOnCurrentDate',
  'isSymptomatic','isReferredForMedicalCare','reasonForUnableToTrace','isReleasedFromSurveillance',
  'wardNo','uphc','commentByMOIC'];

  selectedDate : Date = new Date();

  listCandidate: CandidateDateWiseReport[];
  listOfUpHC: IListUPHC[] = [];
  listOfWards: IListWard[] = [];
  selectedUphcs : string[]=[];
  dataLoadStatus : number =0;

  reportFilter: CandidateReportFilter = {};
  dataSource: MatTableDataSource<CandidateDateWiseReport>;
  constructor(private applicationConfig: ApplicationEnvironmentService, private router: Router, private cdr: ChangeDetectorRef
    , private SpinnerService: NgxSpinnerService, private covidService: CovidI9Service) {
     
  }

  ngOnInit() {
   // this.getReportData();
  }

  uphcDataLoaded()
  {
    this.getReportData();
  }

  getReportData() {
    this.reportFilter.reportStartDate=this.applicationConfig.configParam.presentAsUTC(this.selectedDate);
    this.reportFilter.reportEndDate=this.applicationConfig.configParam.presentAsUTC(this.selectedDate);
    this.reportFilter.uphcs=this.selectedUphcs? this.selectedUphcs.reduce(function(s, a){
      s.push({uphc: a});
      return s;}, []):[];
    this.dataLoadStatus = 1; // loading started
    this.SpinnerService.show();
    this.covidService.getDailyReportData(this.reportFilter)
      .subscribe((cList: CandidateDateWiseReport[]) => {
        //this.listServiceRequest = srList;
        this.dataSource = new MatTableDataSource(cList);
       // console.log(cList);
        this.cdr.detectChanges();
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.SpinnerService.hide();
        this.dataLoadStatus = 2; // data loaded
      }, (e) => {
        alert("An unexpected error occurred")
        this.SpinnerService.hide();
        this.dataLoadStatus = 0; // error
      })
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  exportToExcel() {

    //const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.reportTable.nativeElement);
    // const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.reportTable.nativeElement);
    // const wb: XLSX.WorkBook = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // /* save to file */
    // XLSX.writeFile(wb, 'Daily Summary.xlsx');
   this.exportToExcelWithId("reportTable","Daily Status " + this.selectedDate.toDateString());

  }

  dateChanged(eventType: string, eventData: any) {
    console.log(eventData);
    let newDate: Date = eventData.value;
    if (this.selectedDate != newDate) {
      // alert("Date selection changed to " + newDate);
      this.selectedDate = newDate;
      //this.masterSelectionChanged();
    }
  }

  // downloadaspdf() {

  //   // const documentDefinition = { content: 'This is an sample PDF printed with pdfMake' };
  //   const documentDefinition = this.getDocumentDefinition();
  //   pdfMake.createPdf(documentDefinition).open();
  //   // pdfMake.createPdf(documentDefinition).download();
  //   // pdfMake.createPdf(documentDefinition).print();
  // }

   exportToExcelWithId(tableId: string, name?: string) {
    let timeSpan = new Date().toISOString();
    let prefix = name || "ExportResult";
    let fileName = `${prefix}-${timeSpan}`;
    let targetTableElm = document.getElementById(tableId);
    let wb = XLSX.utils.table_to_book(targetTableElm, <XLSX.Table2SheetOpts>{ sheet: prefix });
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }

}
