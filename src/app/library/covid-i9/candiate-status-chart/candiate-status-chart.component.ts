import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
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
    let chartData = this.prepareChartData(cList);
    this.drawChart(chartData);
    let timelineData = this.prepareTimelineData(cList);
    this.drawTimelineChart(timelineData);
  }

  prepareChartData(statusData: CandidateDateWiseReport[]): any[] {
    let chartData = [];
    let tempArry = [];
    tempArry.push('Status');
    tempArry.push('Count');
    chartData.push(tempArry);

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

  prepareTimelineData(statusData: CandidateDateWiseReport[]): any[] {
    let chartData = [];
    let tempArry = [];
    tempArry.push('Date');
    tempArry.push('No Date');
    tempArry.push('Incorrect Date');
    tempArry.push('Valid Date');
    chartData.push(tempArry);

    let noArrivalDateCount: number = 0;
    let incorrectArrivalDateCount: number = 0;
    let validArrivalDateCount: number = 0;
    let releaseDateCount: { closureDate: Date, count: number }[] = [];
    let thresholDate: Date = new Date("2020-01-01");
    let tempToday = new Date();
    let today: Date = new Date(tempToday.getFullYear(), tempToday.getMonth(), tempToday.getDate(),0,0,0);
    let endDate: Date = this.applicationConfig.configParam.addDays(today, this.covidService.surveillancePeriod);
    if (statusData && statusData.length > 0) {
      for (let candidateDetail of statusData) {
        if (candidateDetail.category === "Active") {
          if (candidateDetail.arivalDate) {
            let arrDate = new Date(candidateDetail.arivalDate);
            if (arrDate >= thresholDate && arrDate <= today) {
              if (this.setRealeaseDateStatus(candidateDetail, arrDate, today, releaseDateCount)) {
                validArrivalDateCount = validArrivalDateCount + 1;
              }
            }
            else {
              incorrectArrivalDateCount++;
            }
          }
          else {
            noArrivalDateCount++;
          }
        }
      }

      // prepare date wise data
      // let chartData: { date: Date, noArrivalDate: number, incorrectArrivalDate: number, ValidData: number }[] = [];
     // console.log(releaseDateCount);
      for (let index: number = 0; index < this.covidService.surveillancePeriod; index++) {
        let currentDate = this.applicationConfig.configParam.addDays(today, index);
        let currentDaysRelease = releaseDateCount.find(d => d.closureDate.getTime() === currentDate.getTime());
        if (currentDaysRelease) {
          validArrivalDateCount = validArrivalDateCount - currentDaysRelease.count;
        }
       
        chartData.push([currentDate, noArrivalDateCount, incorrectArrivalDateCount, validArrivalDateCount]);


      }
    }
    return chartData;

  }


  private setRealeaseDateStatus(applicationData: CandidateDateWiseReport, arrivalDate: Date, today: Date, releaseDateCount: { closureDate: Date; count: number; }[]): boolean {
    let releaseDate = this.applicationConfig.configParam.addDays(arrivalDate, this.covidService.surveillancePeriod);
    if (releaseDate >= today) {
      let entry = releaseDateCount.find(c => c.closureDate.getTime() === releaseDate.getTime());
      if (!entry) {
        entry = { closureDate: releaseDate, count: 0 };
        releaseDateCount.push(entry);
      }
      entry.count++;
      return true;
    }
    else {
      return false;
    }
  }





  drawChart(data: any[]) {
    if (data) {
      let chartData = this.gLib.visualization.arrayToDataTable(data);

      let options = {
        is3D: true,
        legend: { position: 'bottom', textStyle: { color: 'blue', fontSize: 12 } }
      };

      let chart = new this.gLib.visualization.PieChart(document.getElementById('main-chart'));

      chart.draw(chartData, options);

    }
  }

  drawTimelineChart(data: any[]) {
    if (data) {
      let chartData = this.gLib.visualization.arrayToDataTable(data);

      let options = {
        legend: { position: 'bottom', textStyle: { color: 'blue', fontSize: 12 } },
        isStacked: true

      };

      let chart = new this.gLib.visualization.AreaChart(document.getElementById('main-chart2'));

      chart.draw(chartData, options);

    }
  }
}
