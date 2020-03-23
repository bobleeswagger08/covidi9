import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MasterListItem } from 'app/model/master-list-item';
import { IServiceMaster, IRequestStatus, IOrderBy } from 'app/library/rtps/model/rtps';

@Component({
  selector: 'app-service-filter',
  templateUrl: './service-filter.component.html',
  styleUrls: ['./service-filter.component.scss']
})
export class ServiceFilterComponent implements OnInit {
  @Input('office-list') set officeList(value: MasterListItem[]) {
    this.filterParameter.officeList = [];
    this.listOfOffices = value;
    this.copyMasterId(this.listOfOffices, this.filterParameter.officeList);
  };
  @Input('service-list') set serviceList(value: IServiceMaster[]){
    this.filterParameter.serviceList = [];
    this.listOfServices = value;
    this.copyMasterIdService(this.listOfServices, this.filterParameter.serviceList);
  };
  @Input('status-list') set statusList(value: IRequestStatus[]){
    this.filterParameter.statusList = [];
    this.listOfStatus = value;
    this.copyMasterIdStatus(this.listOfStatus, this.filterParameter.statusList);
  }
  @Input('order-list') set orderList(value: IOrderBy[]){
    this.filterParameter.orderList = [];
    this.listOfOrderBy = value;
    this.copyMasterIdStatus(this.listOfOrderBy, this.filterParameter.orderList);
  }

  get officeList(): MasterListItem[] {
    return this.listOfOffices;
  }
  get serviceList(): IServiceMaster[] {
    return this.listOfServices;
  }
  get statusList(): IRequestStatus[] {
    return this.listOfStatus;
  }
  get orderList(): IOrderBy[] {
    return this.listOfOrderBy;
  }

  @Output ('on-filter') whenFilterRequested: EventEmitter<ServiceRequestFilterParameter> = new EventEmitter();

  private listOfOffices: MasterListItem[];
  private listOfServices: IServiceMaster[];
  private listOfStatus:IRequestStatus[];
  private listOfOrderBy:IOrderBy[];
  panelOpenState:boolean = false;
  
  filterParameter : ServiceRequestFilterParameter;

  selectedOffices: string[] = [];
  constructor() { 
    this.filterParameter = new ServiceRequestFilterParameter();
  }

  ngOnInit() {

  }

  private copyMasterId(sourceList:any[], targetList:string[])
  {
   // this.filterParameter.officeList = [];
    
    if (sourceList) {
      for (let office of sourceList) {
        this.filterParameter.officeList.push(office.Id);
      }
    }
  }
  private copyMasterIdService(sourceList:any[], targetList:string[])
  {
   // this.filterParameter.officeList = [];
    
    if (sourceList) {
      for (let service of sourceList) {
        this.filterParameter.serviceList.push(service.id);
      }
    }
  }
  private copyMasterIdStatus(sourceList:any[], targetList:string[])
  {
   // this.filterParameter.officeList = [];
    
    if (sourceList) {
      for (let status of sourceList) {
        this.filterParameter.statusList.push(status.id);
      }
    }
  }
  onSearchClicked()
  {
    this.panelOpenState = !this.panelOpenState;
    this.whenFilterRequested.emit(this.filterParameter);
  }

}

export class DateRange
{
  start : Date|undefined;
  end : Date|undefined;
}

export class ServiceRequestFilterParameter
{
  officeList : string[];
  serviceList : string[];
  statusList : string[];
  orderList : string[];
 // applicationDateRange : DateRange|undefined;
 // dueDateRang : DateRange|undefined;
  ApplicationDateFrom:Date;
  ApplicationDateTo:Date;
  DueDateFrom:Date;
  DueDateTo:Date;

}
