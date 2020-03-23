import { Component, OnInit } from '@angular/core';
import { GoogleChartService } from '../../../services/google-chart/service/google-chart.service';
import { ConfigurationlistService } from 'app/services/config/configurationlist.service';
import { MasterListItem } from 'app/model/master-list-item';
import { UserAuthorization } from 'app/services/application-user/application-user.service';
import { IServiceMaster } from 'app/library/rtps/model/rtps';
import { RtpsService } from '../services/rtps/rtps.service';
import { ApplicationEnvironmentService } from 'app/services/application-environment/application-environment.service';
@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit {
  private gLib: any;
  officeList: MasterListItem[] = [];
  userAuthorization: UserAuthorization;
  serviceList: IServiceMaster[];

  constructor(private rtps: RtpsService, private configListService: ConfigurationlistService, private gChartService: GoogleChartService, systemEnvironment: ApplicationEnvironmentService) {
    //alert("Hi!");
    this.userAuthorization =new UserAuthorization(1231, systemEnvironment.userSession);
    this.gLib = this.gChartService.getGoogle();
    this.gLib.charts.load('current', { 'packages': ['corechart', 'table'] });
    this.gLib.charts.setOnLoadCallback(this.drawChart.bind(this));
    // this.gLib.charts.load('current', { packages: ['piechart', 'table'] });
    // this.gLib.charts.setOnLoadCallback(this.showPieChart.bind(this));
    this.gLib.charts.setOnLoadCallback(this.drawPieChart.bind(this));
    //  this.gLib.charts.load('current', {'packages':['corechart','table']});
    // this.gLib.charts.setOnLoadCallback(this.drawCalenderChart.bind(this));
    this.getOfficeList();
    this.getServiceMasterList();
  }

  private drawCalenderChart() {
    this.gLib.charts.load('current', { packages: ['calendar', 'table'] });
    this.gLib.charts.setOnLoadCallback(this.showCalendarChart.bind(this));
  }
 

  private drawChart() {
    let data = this.gLib.visualization.arrayToDataTable([
      ['Month', 'Submitted', 'Disposed', 'Pending'],
      ['Nov 2019', 2000, 1850, 3000],
      ['Dec 2019', 1700, 2100, 2650],
      ['Jan 2020', 1800, 1900, 2550],
      ['Feb 2020', 2100, 1700, 2950]
    ]);

    let options = {
      title: "Service Request Trend",
       height: 300,
       width:600,
       is3D: true

    };

    let chart = new this.gLib.visualization.LineChart(document.getElementById('divLineChart'));
    //let chart1 = new this.gLib.visualization.LineChart(document.getElementById('divLineChart1'));
    chart.draw(data, options);
    //chart1.draw(data, options);
  }

  dueDateData: any[][] = [];
  private showCalendarChart() {
    // let data = this.gLib.visualization.arrayToDataTable([
    //     ['Due Date',  'Application Count'],
    //      [ new Date(2020, 1, 27), 1203 ],
    //      [ new Date(2020, 2, 14), 3802 ],
    //      [ new Date(2020, 2, 15), 2502 ],
    //      [ new Date(2020, 2, 16), 3810 ],
    //      [ new Date(2020, 2, 17), 3822 ],
    //      // Many rows omitted for brevity.
    //      [ new Date(2020, 2, 19), 3817 ],
    //      [ new Date(2020, 2, 20), 1870 ],
    //      [ new Date(2020, 2, 21), 3821 ],
    //      [ new Date(2020, 3, 22), 3802 ],
    //      [ new Date(2020, 3, 23), 3882 ],
    //      [ new Date(2020, 3, 25), 3834 ],
    //      [ new Date(2020, 3, 26), 1800 ],
    //      [ new Date(2020, 3, 27), 3844 ]
    //    ]);

    let data = this.gLib.visualization.arrayToDataTable(this.dueDateData);

    let chart = new this.gLib.visualization.Calendar(document.getElementById('divCalendarChart'));

    let options = {
      title: "Due date wise pending applications",
      height: 300,
      
      calendar: {
        cellColor: {
          stroke: '#76a7fa',
          strokeOpacity: 0.5,
          strokeWidth: 1,
        }
      }

    };

    chart.draw(data, options);
  }

  ngOnInit() {
 //  this.getInitialDueDateDistribution();
  }
  getInitialDueDateDistribution(){
    let aaUrlValue: any = {};
    aaUrlValue.OrderById =1;
    let aaServiceValue: any = {};
      aaServiceValue.selectedServices= this.serviceList.reduce(function (s, a) {
        s.push({ serviceId: a.id });
        return s;
      }, [])
      aaServiceValue.selectedOffices=this.officeList.reduce(function (s, a) {
        s.push({ officeId: a.Id });
        return s;
      }, [])
      aaServiceValue.selectedStatuses=[]
      aaServiceValue.selectedDepartments=[]
    this.rtps.getDueDateDistribution(aaUrlValue, aaServiceValue).subscribe(srList => {

      // this.dataSource = new MatTableDataSource(srList);
      this.dueDateData = [];
      let tempArry = [];
      tempArry.push('Due Date');
      tempArry.push('Count');
      this.dueDateData.push(tempArry);

      // tempArry.push('Due Date');
      // tempArry.push('Count');
      // this.dueDateData.push(tempArry);
      if (srList && srList.length > 0) {
        for (let applicationData of srList) {
          if (applicationData.dueDate) {
            tempArry = [];
            let dueDate = applicationData.dueDate;
            let year: number = Number(dueDate.substring(0, 4));
            let month: number = Number(dueDate.substring(5, 7));
            let day: number = Number(dueDate.substring(8, 10));
            //TODO: need to find an way to extract year from a date
            let newDate: Date = new Date(year, month - 1, day);
            tempArry.push(newDate);
            tempArry.push(applicationData.count);
            this.dueDateData.push(tempArry);
          }
          // this.dueDateData.push([ applicationData.dueDate,applicationData.count]);
        }

        this.drawCalenderChart();
      }
    })
  }
  getOfficeList() {
    this.configListService.getOrganizationUnitList(false).subscribe(ul => {
      this.officeList = this.userAuthorization.filterOfficeListByAccess(1,ul); 
    })
  //  this.officeList = this.userAuthorization.getOffices(1);
    // this.adminLService.getOrganizationUnitList(false).subscribe(ul => {
    //   // this.officeList = ul;
    //   this.officeList = this.userAuthorization.filterOfficeListByAccess(1,ul); 
    // })
  }
  

  getServiceMasterList() {

    this.rtps.getAllDesignatedService()
      .subscribe(parentList => {
        this.serviceList = parentList
        // console.log(this.serviceList);
        this.getInitialDueDateDistribution();
      });
  }

  seachRerquestData(event) {
    // console.log(event);
    let aaUrlValue: any = {};
    aaUrlValue.OrderById =1;


    //  if(event.DueDateFrom)
    //  {
    //    aaUrlValue.DueDateFrom = formatDate(event.DueDateFrom,'yyyy-MM-dd', 'en-US')
    //  }
    //  if(event.DueDateTo)
    //  {
    //    aaUrlValue.DueDateTo = formatDate(event.DueDateTo,'yyyy-MM-dd', 'en-US');

    //  }
    //  if(event.DueDateFrom && event.DueDateTo && (event.DueDateFrom > event.DueDateTo))
    //  {
    //    alert('Due from date can not be greater than due to date');
    //    return false;
    //  }
    let aaServiceValue: any = {};

    aaServiceValue.selectedServices = event.serviceList.reduce(function (s, a) {
      s.push({ serviceId: a });
      return s;
    }, [])
    aaServiceValue.selectedOffices = event.officeList.reduce(function (s, a) {
      s.push({ officeId: a });
      return s;
    }, [])
    //  aaServiceValue.selectedStatuses=event.statusList.reduce(function(s, a){
    //    s.push({statusId: a});
    //    return s;
    //  }, [])
    aaServiceValue.selectedDepartments = []

    this.rtps.getDueDateDistribution(aaUrlValue, aaServiceValue).subscribe(srList => {

      // this.dataSource = new MatTableDataSource(srList);
      this.dueDateData = [];
      let tempArry = [];
      tempArry.push('Due Date');
      tempArry.push('Count');
      this.dueDateData.push(tempArry);

      // tempArry.push('Due Date');
      // tempArry.push('Count');
      // this.dueDateData.push(tempArry);
      if (srList && srList.length > 0) {
        for (let applicationData of srList) {
          if (applicationData.dueDate) {
            tempArry = [];
            let dueDate = applicationData.dueDate;
            let year: number = Number(dueDate.substring(0, 4));
            let month: number = Number(dueDate.substring(5, 7));
            let day: number = Number(dueDate.substring(8, 10));
            //TODO: need to find an way to extract year from a date
            let newDate: Date = new Date(year, month - 1, day);
            tempArry.push(newDate);
            tempArry.push(applicationData.count);
            this.dueDateData.push(tempArry);
          }
          // this.dueDateData.push([ applicationData.dueDate,applicationData.count]);
        }

        this.drawCalenderChart();
      }
    })
  }
  drawPieChart() {

    let data = this.gLib.visualization.arrayToDataTable([
      ['Status', 'Count'],
      ['Rejected',      2],
      ['Overdue', 5],
      ['WIP',  3],
      ['Disposed',     11]
    ]);

    var options = {
      title: 'Application Processing Efficiency',
      height: 400,
      width : 400,
      is3D: true
    };

    var chart = new this.gLib.visualization.PieChart(document.getElementById('divPieChart'));

    chart.draw(data, options);
  }
}
