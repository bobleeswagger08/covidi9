import { Component, OnInit, ViewChild, ChangeDetectorRef, Input } from '@angular/core';
import { WebDataRocksPivot } from 'app/library/rtps/webdatarocks/webdatarocks.angular4';
import { ApplicationEnvironmentService } from 'app/services/application-environment/application-environment.service';
import { CovidI9Service } from '../services/covid-i9.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CandidateReportFilter, CandidateDateWiseReport } from '../model/candidate-input';

@Component({
  selector: 'app-candidate-summary-report',
  templateUrl: './candidate-summary-report.component.html',
  styleUrls: ['./candidate-summary-report.component.scss']
})
export class CandidateSummaryReportComponent implements OnInit {

  @ViewChild('pivot1', { static: false }) child: WebDataRocksPivot;
  viewInitialized: boolean;
  @Input("candidate-list") set candidateList(reportData :CandidateDateWiseReport[])
  {
    this.candidateData = reportData;
    if(this.candidateData && this.viewInitialized )
    {
      this.showReport();
    }
  }
  candidateData : CandidateDateWiseReport[];
  constructor(private applicationConfig: ApplicationEnvironmentService, private covidService: CovidI9Service, private SpinnerService: NgxSpinnerService, private cdr: ChangeDetectorRef) {
  this.viewInitialized = false;
  }

  ngOnInit() {
  }

  ngAfterViewInit()
  {
    this.viewInitialized = true;
    if(this.candidateList)
    {
      this.showReport();
    }
  }

  
  private showReport() {
    this.child.webDataRocks.setReport({
      dataSource: {
        data: this.filterReportData(this.candidateData)
      },
      slice: {
        rows: [
        {
          uniqueName: "category"
        },{
          uniqueName: "status"
        },
        ],
        reportFilters: [{
          uniqueName: "source"
        }, 
        {
          uniqueName: "uphc"
        }],
        columns: [],
        measures: [{
          uniqueName: "name",
          aggregation: "count"
        }
        ]
      }
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

  filterReportData(serviceData: CandidateDateWiseReport[]): any[] {
    let reportData: any[] = [];
    if (serviceData) {
      for (let reportItem of serviceData) {
        let reportDataItem = { 
        
          uphc: reportItem.uphc, name: reportItem.name, source: reportItem.source 
          , age: reportItem.age, countryVisited: reportItem.countryVisited
          , dateOfArival : reportItem.dateOfArival,
          ward : reportItem.wardNo,
          category : reportItem.category, status : reportItem.status
         // , isContactedOnCurrentDate : reportItem.isContactedOnCurrentDate
        };
        reportData.push(reportDataItem);
      }
    }

    return reportData;
  }

  onReportComplete(): void {
    this.child.webDataRocks.off("reportcomplete", () => { });    
  }

}
