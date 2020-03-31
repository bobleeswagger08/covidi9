import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { WebDataRocksPivot } from 'app/library/rtps/webdatarocks/webdatarocks.angular4';
import { IListCandidate, CandidateListItem, CandidateDateWiseReport, CandidateReportFilter } from '../model/candidate-input';
import { CovidI9Service } from '../services/covid-i9.service';

@Component({
  selector: 'app-candidate-analysis',
  templateUrl: './candidate-analysis.component.html',
  styleUrls: ['./candidate-analysis.component.scss']
})
export class CandidateAnalysisComponent implements OnInit {
  @ViewChild('pivot1', { static: false }) child: WebDataRocksPivot;
  dataSource: any;
  constructor(private covidService: CovidI9Service, private cdr: ChangeDetectorRef) {


  }
reportDate : Date =new Date();

dateChanged(eventType: string, eventData: any) {
  console.log(eventData);
  let newDate: Date = eventData.value;
  if (this.reportDate != newDate) {
    // alert("Date selection changed to " + newDate);
    this.reportDate = newDate;
    //this.masterSelectionChanged();
  }
}
  ngOnInit() {
    this.getReportData();
  }
  getReportData() {
    let candidateFilterP: CandidateReportFilter = {};
    //candidateFilterP.isEverContacted=""
    candidateFilterP.reportStartDate = this.reportDate;
    candidateFilterP.reportEndDate = this.reportDate;
    this.covidService.getDailyReportData(candidateFilterP).subscribe((cList: CandidateDateWiseReport[]) => {
      this.dataSource = cList;
      alert("Data loaded");
      this.child.webDataRocks.setReport({
        dataSource: {
          data: this.dataSource // this.filterReportData(this.dataSource)
        }
        ,
        slice: {
          rows: [{
            uniqueName: "source"
          }],
          columns: [{
            uniqueName: "uphc"
          }],

          measures: [{
            uniqueName: "name",
            aggregation: "count"
          }
          ]
        }
      });
      // this.cdr.detectChanges();
      // update table
    });
  }
  onPivotReady(pivot: WebDataRocks.Pivot): void {
    //  console.log("[ready] WebDataRocksPivot", this.child);
    // this.child.webDataRocks.setReport({
    //   dataSource: {
    //     data: this.dataSource
    //   }
    // ,
    // slice: {
    //   rows: [{
    //     uniqueName: "source"
    //   }],
    //   columns: [{
    //     uniqueName: "uphc"
    //   }],

    //   measures: [{
    //     uniqueName: "name",
    //     aggregation: "count"
    //   }
    // ]
    // }
    // });
  }

  onCustomizeCell(cell: WebDataRocks.CellBuilder, data: WebDataRocks.CellData): void {
    //console.log("[customizeCell] WebDataRocksPivot");
    if (data.isClassicTotalRow) cell.addClass("fm-total-classic-r");
    if (data.isGrandTotalRow) cell.addClass("fm-grand-total-r");
    if (data.isGrandTotalColumn) cell.addClass("fm-grand-total-c");
  }

  filterReportData(serviceData: CandidateDateWiseReport[]): ReportData[] {
    let reportData: ReportData[] = [];
    if (serviceData) {
      for (let reportItem of serviceData) {
        let reportDataItem: ReportData = { 
          statusDate: reportItem.statusDate,
          uphc: reportItem.uphc, name: reportItem.name, source: reportItem.source 
          , age: reportItem.age, countryVisited: reportItem.countryVisited
          , dateOfArival : reportItem.dateOfArival
         // , isContactedOnCurrentDate : reportItem.isContactedOnCurrentDate
        };
        reportData.push(reportDataItem);
      }
    }

    return reportData;
  }

  onReportComplete(): void {
    this.child.webDataRocks.off("reportcomplete", () => { });
    // this.child.webDataRocks.setReport({
    //   dataSource: {
    //     data: this.dataSource
    //   }
    //   // ,
    //   // slice: {
    //   //   rows: [{
    //   //     uniqueName: "source"
    //   //   }],
    //   //   columns: [{
    //   //     uniqueName: "uphc"
    //   //   }],

    //   //   measures: [{
    //   //     uniqueName: "name",
    //   //     aggregation: "count"
    //   //   }
    //   // ]
    //   // }
    // });
  }


}

export class ReportData {
  id?: string;
  serialNo?: string | undefined;
  isEverContacted?: string | undefined;
  isContactedOnCurrentDate?: string | undefined;
  dateOfContacted?: Date | undefined;
  isSymptomatic?: string | undefined;
  isReferredForMedicalCare?: string | undefined;
  reasonForUnableToTrace?: string | undefined;
  isReleasedFromSurveillance?: string | undefined;
  wardNo?: string | undefined;
  uphc?: string | undefined;
  commentByMOIC?: string | undefined;
  statusDate?: Date | undefined;
  candidateReason?: string | undefined;
  dateOfArival?: Date | undefined;
  note?: string | undefined;
  isActive?: boolean;
  candidateStatusId?: number | undefined;
  referenceNo?: number;
  source?: string | undefined;
  name?: string | undefined;
  flightNo?: string | undefined;
  countryVisited?: string | undefined;
  dob?: string | undefined;
  age?: string | undefined;
  sex?: string | undefined;
  flightNumber?: string | undefined;
  arivalDate?: string | undefined;
  mobileNo?: string | undefined;
  address?: string | undefined;
  finalDestination?: string | undefined;
  block?: string | undefined;
  state?: string | undefined;
}
