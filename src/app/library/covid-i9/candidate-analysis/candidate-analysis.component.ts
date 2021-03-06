import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { WebDataRocksPivot } from 'app/library/rtps/webdatarocks/webdatarocks.angular4';
import { IListCandidate, CandidateListItem, CandidateDateWiseReport, CandidateReportFilter } from '../model/candidate-input';
import { CovidI9Service } from '../services/covid-i9.service';
import { ApplicationEnvironmentService } from 'app/services/application-environment/application-environment.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-candidate-analysis',
  templateUrl: './candidate-analysis.component.html',
  styleUrls: ['./candidate-analysis.component.scss']
})
export class CandidateAnalysisComponent implements OnInit {
  @ViewChild('pivot1', { static: false }) child: WebDataRocksPivot;
  dataSource: any;
  constructor(private applicationConfig: ApplicationEnvironmentService, private covidService: CovidI9Service, private SpinnerService: NgxSpinnerService, private cdr: ChangeDetectorRef) {


  }
  reportDate: Date = new Date();
  selectedUphcs: string[] = [];
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
  }

  uphcDataLoaded() {
    this.getReportData();
  }
  getReportData() {
    let candidateFilterP: CandidateReportFilter = {};
    //candidateFilterP.isEverContacted=""
    candidateFilterP.reportStartDate = this.applicationConfig.configParam.presentAsUTC(this.reportDate);
    candidateFilterP.reportEndDate = this.applicationConfig.configParam.presentAsUTC(this.reportDate);
    candidateFilterP.uphcs = this.selectedUphcs ? this.selectedUphcs.reduce(function (s, a) {
      s.push({ uphc: a });
      return s;
    }, []) : [];
    this.SpinnerService.show();
    this.covidService.getDailyReportData(candidateFilterP).subscribe((cList: CandidateDateWiseReport[]) => {
      this.dataSource = cList;

      // alert("Data loaded");
      this.child.webDataRocks.setReport({
        dataSource: {
          data: this.filterReportData(this.dataSource)
        }
        ,
        slice: {
          rows: [
            {
              uniqueName: "surviellanceStatus"
            },
            {
              uniqueName: "candidateStatus"
            },
            {
            uniqueName: "isContactedToday"
          }
          ],
          reportFilters: [{
            uniqueName: "source"
          }],
          columns: [{
            uniqueName: "uphc"
          },
          {
            uniqueName: "isSymptomatic"
          }],

          measures: [{
            uniqueName: "internalReferenceNumber",
            aggregation: "count"
          }

          ]
        }
      });
      this.SpinnerService.hide();
      // this.cdr.detectChanges();
      // update table
    },
      (e) => {
        this.SpinnerService.hide();
        alert("An unexpected error occurred, please try after sometime");
      }
    );
  }
  onPivotReady(pivot: WebDataRocks.Pivot): void {


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
          internalReferenceNumber: reportItem.referenceNo,
          source: reportItem.source,
          surviellanceStatus : reportItem.category,
          candidateStatus : reportItem.status,
          uphc: reportItem.uphc,
          wardNo: reportItem.wardNo,
          name: reportItem.name,
          age: reportItem.age,
          sex : reportItem.sex,
          countryVisited: reportItem.countryVisited,
          dateOfArrival: reportItem.arivalDate,
          sourceSerialNumber: reportItem.serialNo, 
          isEverContacted: reportItem.serialNo,
          isContactedToday: reportItem.isContactedOnCurrentDate,
          isSymptomatic: reportItem.isSymptomatic,
          isReferredForMedicalCare: reportItem.isReferredForMedicalCare,
          noContactReason: reportItem.reasonForUnableToTrace,
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

interface ReportData {
  sourceSerialNumber?: string | undefined;
  isEverContacted?: string | undefined;
  isContactedToday?: string | undefined;
  dateOfContacted?: Date | undefined;
  isSymptomatic?: string | undefined;
  isReferredForMedicalCare?: string | undefined;
  noContactReason?: string | undefined;
  isReleasedFromSurveillance?: string | undefined;
  wardNo?: string | undefined;
  uphc?: string | undefined;
  commentByMOIC?: string | undefined;
  statusDate?: Date | undefined;
  candidateReason?: string | undefined;
  surviellanceStatus? : string | undefined;
  candidateStatus? : string | undefined;
  //dateOfArrival?: Date | undefined;
  // note?: string | undefined;
  // isActive?: boolean;
  // candidateStatusId?: number | undefined;
  internalReferenceNumber: number;
  source?: string | undefined;
  name?: string | undefined;
 // flightNo?: string | undefined;
  countryVisited?: string | undefined;
  dob?: string | undefined;
  age?: string | undefined;
  sex?: string | undefined;
 // flightNumber?: string | undefined;
  dateOfArrival?: string | undefined;
  mobileNo?: string | undefined;
  address?: string | undefined;
  finalDestination?: string | undefined;
  block?: string | undefined;
  state?: string | undefined;
}
