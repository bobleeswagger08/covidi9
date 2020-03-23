import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { RtpsService } from '../services/rtps/rtps.service';
import { IServiceRequest, IServiceMaster, IRequestStatus, IOrderBy } from 'app/library/rtps/model/rtps';
import { Router } from '@angular/router';
import { BaseComponent } from '../../shared-controls/base-component/base-component.component';
import { NgxSpinnerService } from "ngx-spinner";
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { FormIServiceReportComponent } from '../form-i-service-report/form-i-service-report.component';
import { MatDialog } from '@angular/material/dialog';
import { MasterListItem } from 'app/model/master-list-item';
import { UserAuthorization } from 'app/services/application-user/application-user.service';
import { ApplicationEnvironmentService } from 'app/services/application-environment/application-environment.service';
import { ConfigurationlistService } from 'app/services/config/configurationlist.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-service-request-list',
  templateUrl: './service-request-list.component.html',
  styleUrls: ['./service-request-list.component.scss']
})
export class ServiceRequestListComponent extends BaseComponent implements OnInit {
  displayedColumns: string[] = ['referenceNo', 'hmcApplicationReferenceNo', 'applicantName', 'serviceCode','officeCode', 'status', 'serviceRequestDate', 'dueDate', 'updatebutton', 'updateStatus', 'reportButton'];
  listServiceRequest: IServiceRequest[];
  dataSource: MatTableDataSource<IServiceRequest>;
  officeList: MasterListItem[] = [];
  userAuthorization: UserAuthorization;
  serviceList: IServiceMaster[];
  statusList:IRequestStatus[];
  orderList:IOrderBy[];
  

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(private rtps: RtpsService, private router: Router, cdr: ChangeDetectorRef, private SpinnerService: NgxSpinnerService, public dialog: MatDialog,
    private configListService: ConfigurationlistService,
    systemEnvironment: ApplicationEnvironmentService
  ) {
    super(cdr);
    this.userAuthorization = new UserAuthorization(1231, systemEnvironment.userSession);
    this.SpinnerService.show();
    let requestId = this.registerDataRequest();
    let aaurlValue: any = {};
    aaurlValue.OrderById =1;
    let aaServiceValue: any = {};
      aaServiceValue.selectedServices=[]
      aaServiceValue.selectedOffices=[]
      aaServiceValue.selectedStatuses=[]
      aaServiceValue.selectedDepartments=[]
    this.rtps.getServiceRequestList(aaurlValue,aaServiceValue)
      .subscribe(srList => {
        //this.listServiceRequest = srList;
        this.dataSource = new MatTableDataSource(srList);
        this.signalDataRequestCompletion(requestId);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.SpinnerService.hide();
      }, () => {
        this.SpinnerService.hide();
      });
  }

  ngOnInit() {
    // this.getServiceRequestList();
    this.getOfficeList();
    this.getServiceMasterList();
    this.getRStatus();
    this.getOrderBy();
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  getServiceRequestList() {

  }
  gotoUpdatePage(id) {
    this.router.navigate(['rtps/servicerequestform', id], { queryParams: { tabIndex: '0' } })
  }
  gotoStatusUpdatePage(id) {
    this.router.navigate(['rtps/servicerequestform', id], { queryParams: { tabIndex: '1' } })
  }
  gotoFormIReportPage(id) {
    const dialogRef = this.dialog.open(FormIServiceReportComponent,
      { height: '95%',width:'65%', autoFocus: false, data: { Id: id } });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
    // this.router.navigate(['roleservice/formiservicereport',id])
  }
  goToAddPage() {
    this.router.navigate(['rtps/servicerequestform', 'null']);
  }
  getOfficeList() {
    this.configListService.getOrganizationUnitList(false).subscribe(ul => {
      this.officeList = this.userAuthorization.filterOfficeListByAccess(1,ul); 
    })
  }
  seachRerquestData(event){
     // console.log(event);
      let aaUrlValue: any = {};
      if(event.orderList.length==0){
        alert('Please select order by')
        return false;
      }
      else{
        //console.log(event.orderList);
        aaUrlValue.OrderById=event.orderList;
      }
      if(event.ApplicationDateFrom)
      {
        aaUrlValue.ApplicationDateFrom = formatDate(event.ApplicationDateFrom,'yyyy-MM-dd', 'en-US')
      }
      if(event.ApplicationDateTo)
      {
        aaUrlValue.ApplicationDateTo = formatDate(event.ApplicationDateTo,'yyyy-MM-dd', 'en-US')
      }
      if(event.ApplicationDateFrom && event.ApplicationDateTo && ( event.ApplicationDateFrom > event.ApplicationDateTo)){
        alert('Application from date can not be greater than application to date');
        return false;
      }
      if(event.DueDateFrom)
      {
        aaUrlValue.DueDateFrom = formatDate(event.DueDateFrom,'yyyy-MM-dd', 'en-US')
      }
      if(event.DueDateTo)
      {
        aaUrlValue.DueDateTo = formatDate(event.DueDateTo,'yyyy-MM-dd', 'en-US');
        
      }
      if(event.DueDateFrom && event.DueDateTo && (event.DueDateFrom > event.DueDateTo))
      {
        alert('Due from date can not be greater than due to date');
        return false;
      }
      let aaServiceValue: any = {};
      
      aaServiceValue.selectedServices=event.serviceList.reduce(function(s, a){
        s.push({serviceId: a});
        return s;
        }, [])
        aaServiceValue.selectedOffices=event.officeList.reduce(function(s, a){
          s.push({officeId: a});
          return s;
        }, [])
        aaServiceValue.selectedStatuses=event.statusList.reduce(function(s, a){
          s.push({statusId: a});
          return s;
        }, [])
        aaServiceValue.selectedDepartments=[]
        let requestId = this.registerDataRequest();
      this.rtps.getServiceRequestList(aaUrlValue,aaServiceValue).subscribe(srList =>{
       
        this.dataSource = new MatTableDataSource(srList);
        this.signalDataRequestCompletion(requestId);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })
  }
  getServiceMasterList() {
    this.SpinnerService.show();
    let requestId = this.registerDataRequest();
    this.rtps.getAllDesignatedService()
      .subscribe(parentList => {
        this.serviceList = parentList
        // console.log(this.serviceList);
        this.signalDataRequestCompletion(requestId);
        this.SpinnerService.hide();
      });
  }
  getRStatus() {
    this.SpinnerService.show();
    let requestId = this.registerDataRequest();
    this.rtps.getRequestStatus()
      .subscribe(listRStatus => {
        this.statusList = listRStatus;
        this.signalDataRequestCompletion(requestId);
        this.SpinnerService.hide();
      });
  }
  getOrderBy() {
    this.SpinnerService.show();
    let requestId = this.registerDataRequest();
    this.rtps.getOrderBy()
      .subscribe(oBy => {
        this.orderList = oBy;
        this.signalDataRequestCompletion(requestId);
        this.SpinnerService.hide();
      });
  }

}
