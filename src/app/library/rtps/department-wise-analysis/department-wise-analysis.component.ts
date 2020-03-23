import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { WebDataRocksPivot } from '../webdatarocks/webdatarocks.angular4';
import { RtpsService, FormIvRegister } from '../services/rtps/rtps.service';
import { BaseComponent } from '../../shared-controls/base-component/base-component.component';

@Component({
  selector: 'app-department-wise-analysis',
  templateUrl: './department-wise-analysis.component.html',
  styleUrls: ['./department-wise-analysis.component.scss']
})
export class DepartmentWiseAnalysisComponent extends BaseComponent implements OnInit {
  @ViewChild('pivot1', { static: false }) child: WebDataRocksPivot;
  dataSource: FormIvRegister[] = [];
  constructor(private rtpsService: RtpsService,cdr: ChangeDetectorRef) {
    super(cdr);
    this.getReportData();
   }

  ngOnInit() {
    
  }
  getReportData() {
    let aaurlValue: any = {};
    aaurlValue.OrderById = 1;
    let aaServiceValue: any = {};
    aaServiceValue.selectedServices = [];
    aaServiceValue.selectedOffices = [];
    aaServiceValue.selectedStatuses = [];
    aaServiceValue.selectedDepartments = [];
    let requestId = this.registerDataRequest();
    this.rtpsService.getFormIVRegisterData(aaurlValue, aaServiceValue).subscribe(reportData => {
      this.dataSource =reportData;
      this.signalDataRequestCompletion(requestId);
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
            uniqueName: "serviceName"
          }],
          columns: [{
            uniqueName: "office"
          },
          {
            uniqueName: "department"
          }],
          
          measures: [{
            uniqueName: "applicantName",
            aggregation: "count"
          }]
        }
      });
    }

}
