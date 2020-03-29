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

  ngOnInit() {
    this.getReportData();
  }
  getReportData() {
    let candidateFilterP: CandidateReportFilter = {};
    //candidateFilterP.isEverContacted=""
    candidateFilterP.reportStartDate = new Date();
    candidateFilterP.reportEndDate = new Date('2020-03-10T00:00:00');
    this.covidService.getDailyReportData(candidateFilterP).subscribe((cList: CandidateDateWiseReport[]) => {
      this.dataSource = cList;
      alert("Data loaded");
      this.child.webDataRocks.setReport({
        dataSource: {
          data: this.dataSource
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

  onReportComplete(): void {
    this.child.webDataRocks.off("reportcomplete", ()=> {});
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
