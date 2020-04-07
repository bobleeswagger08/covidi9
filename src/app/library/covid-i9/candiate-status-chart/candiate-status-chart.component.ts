import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CandidateReportFilter, CandidateDateWiseReport, IListCandidate } from '../model/candidate-input';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApplicationEnvironmentService } from 'app/services/application-environment/application-environment.service';
import { CovidI9Service } from '../services/covid-i9.service';
import { GoogleChartService } from 'app/services/google-chart/service/google-chart.service';

@Component({
  selector: 'app-candiate-status-chart',
  templateUrl: './candiate-status-chart.component.html',
  styleUrls: ['./candiate-status-chart.component.scss']
})
export class CandiateStatusChartComponent implements OnInit {
  private gLib: any;
  reportDate: Date = new Date();
  selectedUphcs: string[] = [];
  dataSource: CandidateDateWiseReport[];
  noDataMessage: string;
  constructor(private applicationConfig: ApplicationEnvironmentService, private covidService: CovidI9Service
    , private SpinnerService: NgxSpinnerService, private gChartService: GoogleChartService,private cdr: ChangeDetectorRef) {
    this.gLib = this.gChartService.getGoogle();
    this.gLib.charts.load('current', { 'packages': ['corechart', 'table'] });
    //this.gLib.charts.setOnLoadCallback(this.drawChart.bind(this));
    // this.gLib.charts.load('current', { packages: ['piechart', 'table'] });
    // this.gLib.charts.setOnLoadCallback(this.showPieChart.bind(this));
    this.gLib.charts.setOnLoadCallback(this.drawChart.bind(this));
    //  this.gLib.charts.load('current', {'packages':['corechart','table']});
    // this.gLib.charts.setOnLoadCallback(this.drawCalenderChart.bind(this));
     }

  ngOnInit() {
  }

  uphcDataLoaded() {
    this.getReportData();
  }

  getReportData() {
    // this.setUPHCList();
    // console.log(this.filterParameter.uphcSelectedValues);
    let candidateFilter = {
      isEverContacted: "",
      wards: [],
      uphcs: this.selectedUphcs ? this.selectedUphcs.reduce(function (s, a) {
        s.push({ uphc: a });
        return s;
      }, []) : [],
      selectedStatuses: [],
      //  inputDate:formatDate(this.filterParameter.inputDate, 'yyyy-MM-dd', 'en-US')
      // inputDate:this.filterParameter.inputDate
    }
    this.SpinnerService.show();
    this.covidService.getCandidateList(candidateFilter)
      .subscribe((cList: IListCandidate[]) => {
        //this.listServiceRequest = srList;
        if (cList.length == 0)
          this.noDataMessage = "Filter criteria did not match any record"
        var chartData = this.prepareChartData(cList);
        this.drawChart(chartData);
        this.SpinnerService.hide();
      }, (e) => {
        alert("An unexpected error occurred")
        this.SpinnerService.hide();
      });
  }

  prepareChartData(statusData: IListCandidate[]): any[] {
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

  drawChart(data : any[]) {

    let chartData =  this.gLib.visualization.arrayToDataTable(data);

    let options = {
      title: 'Candidate Status',
      is3D: true
    };

    var chart = new  this.gLib.visualization.PieChart(document.getElementById('main-chart'));

    chart.draw(chartData, options);
  }


}
