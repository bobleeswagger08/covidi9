import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { CandidateDateWiseReport } from '../model/candidate-input';
import { ApplicationEnvironmentService } from 'app/services/application-environment/application-environment.service';
import { CovidI9Service } from '../services/covid-i9.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { GoogleChartService } from 'app/services/google-chart/service/google-chart.service';

@Component({
  selector: 'app-daily-input-status-chart',
  templateUrl: './daily-input-status-chart.component.html',
  styleUrls: ['./daily-input-status-chart.component.scss']
})
export class DailyInputStatusChartComponent implements OnInit {

  @Input("candidate-status") set candidateStatus(status: CandidateDateWiseReport[]) {
    this.candidateStatusData = status;
    if (status && status.length > 0) {
      this.drawChartFromData(this.candidateStatusData);
    }
  }

  private candidateStatusData: CandidateDateWiseReport[];
  private gLib: any;
  reportDate: Date = new Date();
  selectedUphcs: string[] = [];
  dataSource: CandidateDateWiseReport[];
  noDataMessage: string;
  constructor(private applicationConfig: ApplicationEnvironmentService, private covidService: CovidI9Service
    , private SpinnerService: NgxSpinnerService, private gChartService: GoogleChartService, private cdr: ChangeDetectorRef) {
    this.gLib = this.gChartService.getGoogle();
    this.gLib.charts.load('current', { 'packages': ['corechart', 'table'] });
    this.gLib.charts.setOnLoadCallback(this.drawChart.bind(this));
  }

  ngOnInit() {
  }

  private drawChartFromData(cList: CandidateDateWiseReport[]) {
    if (cList && cList.length == 0)
      this.noDataMessage = "Filter criteria did not match any record";
    var chartData = this.prepareChartData(cList);
    this.drawChart(chartData);
  }

  prepareChartData(statusData: CandidateDateWiseReport[]): any[] {
    let chartData = [];
    let tempArry = [];
    tempArry.push('Status');
    tempArry.push('Count');
    chartData.push(tempArry);

    // tempArry.push('Due Date');
    // tempArry.push('Count');
    // this.dueDateData.push(tempArry);
    let statusCount: { category: string, count: number }[] = [];
    if (statusData && statusData.length > 0) {
      for (let applicationData of statusData) {


        let candidateCategory = applicationData.status;
        let currentStatus = statusCount.find(s => s.category === candidateCategory)
        if (!currentStatus) {
          currentStatus = { category: candidateCategory, count: 0 };
          statusCount.push(currentStatus);
        }

        currentStatus.count = currentStatus.count + 1;
      }

      for (let category of statusCount) {
        chartData.push([category.category, category.count]);

      }
      // this.dueDateData.push([ applicationData.dueDate,applicationData.count]);
    }

    return chartData;
  }

  drawChart(data: any[]) {

    let chartData = data ? this.gLib.visualization.arrayToDataTable(data): null;

    let options = {
      title: 'Candidate Status',
      is3D: true
    };

    var chart = new this.gLib.visualization.PieChart(document.getElementById('daily-status'));

    chart.draw(chartData, options);
  }


}
