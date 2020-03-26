import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { WebDataRocksPivot } from 'app/library/rtps/webdatarocks/webdatarocks.angular4';
import { IListCandidate } from '../model/candidate-input';
import { CovidI9Service } from '../services/covid-i9.service';

@Component({
  selector: 'app-candidate-analysis',
  templateUrl: './candidate-analysis.component.html',
  styleUrls: ['./candidate-analysis.component.scss']
})
export class CandidateAnalysisComponent implements OnInit {
  @ViewChild('pivot1', { static: false }) child: WebDataRocksPivot;
  dataSource: IListCandidate[] = [];
  constructor(private covidService:CovidI9Service,private cdr: ChangeDetectorRef) {
    this.getReportData();
   }

  ngOnInit() {
  }
  getReportData() {
    let candidateFilterP: any = {};
    candidateFilterP.isEverContacted=""
    candidateFilterP.words=[]
    candidateFilterP.upscs=[]
    candidateFilterP.names=[]
    candidateFilterP.selectedStatuses=[]
    this.covidService.getCandidateList(candidateFilterP).subscribe((cList:IListCandidate[]) => {
      this.dataSource =cList;
      this.cdr.detectChanges();
      // update table
    });
  }
  onPivotReady(pivot: WebDataRocks.Pivot): void {
    //  console.log("[ready] WebDataRocksPivot", this.child);
    }
  
    onCustomizeCell(cell: WebDataRocks.CellBuilder, data: WebDataRocks.CellData): void {
      //console.log("[customizeCell] WebDataRocksPivot");
      if (data.isClassicTotalRow) cell.addClass("fm-total-classic-r");
      if (data.isGrandTotalRow) cell.addClass("fm-grand-total-r");
      if (data.isGrandTotalColumn) cell.addClass("fm-grand-total-c");
    }
  
    onReportComplete(): void {
      this.child.webDataRocks.off("reportcomplete");
      this.child.webDataRocks.setReport({
        dataSource: {
          data: this.dataSource
        },
        slice: {
          rows: [{
            uniqueName: "name"
          }],
          columns: [{
            uniqueName: "flightNo"
          }],
          
          measures: [{
            uniqueName: "countryVisited",
            aggregation: "count"
          }]
        }
      });
    }
}
