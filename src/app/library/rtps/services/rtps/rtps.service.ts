import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { catchError, map, retry } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AppError } from '../../../../shared/commonerror/app-error';
import { NotFoundError } from '../../../../shared/commonerror/not-found-error';
import { BadInput } from '../../../../shared/commonerror/bad-input';
import { IWorkingDayUnit, IRequestStatus, IOrderBy } from '../../model/rtps';
import { of } from 'rxjs';
import { ApplicationEnvironmentService } from 'app/services/application-environment/application-environment.service';
@Injectable({
  providedIn: 'root'
})
export class RtpsService {
  listWDUnit: IWorkingDayUnit[] = [
    { "id": 1, "name": "Calendar Days" },
    { "id": 2, "name": "Working Days" },
    { "id": 3, "name": "Week(s)" },
    { "id": 4, "name": "Hours" }
  ];
  listRStatus: IRequestStatus[] = [
    { "id": 1, "name": "Open" },
    { "id": 2, "name": "Re-Open" },
    { "id": 3, "name": "On Hold" },
    { "id": 4, "name": "Disposed" },
    { "id": 5, "name": "Rejected" },
    { "id": 6, "name": "Waiting for Applicant Input" },
    { "id": 7, "name": "Cancel" }
  ];
  listOrderBy: IOrderBy[] = [
    { "id": 1, "name": "Due Date" },
    { "id": 2, "name": "Application Request Date" },
    { "id": 3, "name": "Service" }
  ];


  //private urlFormIVRegister = new ApplicationURL()._rtpsURL+'/DesignatedOfficerConfig';
  constructor(private http: Http, private appEnvService: ApplicationEnvironmentService) { }

  private urlMaster = this.appEnvService.configParam.rtpsServiceUrl + '/RtpsService';
  private urlRequest = this.appEnvService.configParam.rtpsServiceUrl + '/RTPSServiceRequest';
  private urlDesgnOfc = this.appEnvService.configParam.rtpsServiceUrl + '/DesignatedOfficerConfig';
  private urlServiceDeligation = this.appEnvService.configParam.rtpsServiceUrl+'/ServiceDeligation';
  getWorkingDayUnit() {
    return of(this.listWDUnit);
  }
  getRequestStatus() {
    return of(this.listRStatus);
  }
  getOrderBy() {
    return of(this.listOrderBy);
  }
  getServiceMaster() {
    return this.http.get(this.urlMaster + '?includeInActives=true')
      .pipe(
        map(response => response.json()),
        catchError(this.HandleError)
      );
  }
  getServiceRequestList(requestData, requestDataBody) {
    let RequestURL = this.urlRequest + '/List?includeInActives=true&OrderById=' + requestData.OrderById;
    if (requestData.ApplicationDateFrom) {
      RequestURL = RequestURL + '&ApplicationDateFrom=' + requestData.ApplicationDateFrom;
    }
    if (requestData.ApplicationDateTo) {
      RequestURL = RequestURL + '&ApplicationDateTo=' + requestData.ApplicationDateTo;
    }
    if (requestData.DueDateFrom) {
      RequestURL = RequestURL + '&DueDateFrom=' + requestData.DueDateFrom;
    }
    if (requestData.DueDateTo) {
      RequestURL = RequestURL + '&DueDateTo=' + requestData.DueDateTo;
    }
    return this.http.post(RequestURL, requestDataBody)
      .pipe(
        map(response => response.json()),
        catchError(this.HandleError)
      );
  }

  getDueDateDistribution(requestData, requestDataBody): Observable<IApplicationDueDateSummary[]>
  {
    let RequestURL = this.urlRequest + '/DueDateDistribution';
    return this.http.post(RequestURL, requestDataBody)
      .pipe(
        map(response => response.json()),
        catchError(this.HandleError)
      );
  }

  getServiceMasterById(id) {
    return this.http.get(this.urlMaster + '/' + id)
      .pipe(
        map(response => response.json()),
        catchError(this.HandleError)
      );
  }
  getServiceRequestById(id) {
    return this.http.get(this.urlRequest + '/' + id)
      .pipe(
        map(response => response.json()),
        catchError(this.HandleError)
      );
  }
  getAll(code?: string) {
    return this.http.get(this.urlMaster)
      .pipe(
        map(response => response.json()),
        catchError(this.HandleError)
      );
  }
  createServiceMaster(resource) {
    //return this.http.post(this.url,JSON.stringify(resource))
    return this.http.post(this.urlMaster, resource)
      .pipe(
        map(response => response.json()),
        catchError(this.HandleError)
      );
  }
  createServiceRequest(resource) {
    //return this.http.post(this.url,JSON.stringify(resource))
    return this.http.post(this.urlRequest + '/CreateServiceRequest', resource)
      .pipe(
        map(response => response.json()),
        catchError(this.HandleError)
      );
  }
  update(resource) {
    // return this.http.patch(this.url+'/'+resource.id,JSON.stringify({isRead:true}))
    //return this.http.patch(this.url+'/Id/'+resource.code,JSON.stringify(resource))
    return this.http.patch(this.urlMaster + '/Id/' + resource.code, resource)
      .pipe(
        map(response => response.json()),
        catchError(this.HandleError)
      );
  }
  updateServiceMasterPut(resource) {
    // return this.http.patch(this.url+'/'+resource.id,JSON.stringify({isRead:true}))
    return this.http.put(this.urlMaster, resource)
      .pipe(
        map(response => response.json()),
        catchError(this.HandleError)
      );
  }
  updateRequestStatusPost(resource) {
    // return this.http.patch(this.url+'/'+resource.id,JSON.stringify({isRead:true}))
    return this.http.post(this.urlRequest + '/UpdateStatus', resource)
      .pipe(
        map(response => response.json()),
        catchError(this.HandleError)
      );
  }
  delete(id) {
    return this.http.delete(this.urlMaster + '/' + id)
      .pipe(
        map(response => response.json()),
        catchError(this.HandleError)
      );
  }
  getDesignatedOfficerList() {
    return this.http.get(this.urlDesgnOfc + '?includeInActives=true&FunctionalityId=1')
      .pipe(
        map(response => response.json()),
        catchError(this.HandleError)
      );
  }

  getFormIVRegisterData(requestURLData, requestBodyData): Observable<FormIvRegister[]> {
    let RequestURL = this.urlRequest + '/FormIVRegister?OrderById=' + requestURLData.OrderById;
    if (requestURLData.ApplicationDateFrom) {
      RequestURL = RequestURL + '&ApplicationDateFrom=' + requestURLData.ApplicationDateFrom;
    }
    if (requestURLData.ApplicationDateTo) {
      RequestURL = RequestURL + '&ApplicationDateTo=' + requestURLData.ApplicationDateTo;
    }
    if (requestURLData.DueDateFrom) {
      RequestURL = RequestURL + '&DueDateFrom=' + requestURLData.DueDateFrom;
    }
    if (requestURLData.DueDateTo) {
      RequestURL = RequestURL + '&DueDateTo=' + requestURLData.DueDateTo;
    }
    console.log(RequestURL);
    return this.http.post(RequestURL, requestBodyData)
      .pipe(
        map(response => response.json()),
        catchError(this.HandleError)
      );
  }
  createServiceDlegation(resource){
    return this.http.post(this.urlServiceDeligation,resource)
    .pipe(
        map(response=>response.json()),
        catchError(this.HandleError)
        );
  }
  getAllDesignatedService(userId?:string){
    return this.http.get(this.urlServiceDeligation+'/Services')
    .pipe(
         map(response=>response.json()),
         catchError(this.HandleError)
    );
}
getAllDesignatedOffice(userId?:string){
    return this.http.get(this.urlServiceDeligation+'/Offices')
    .pipe(
         map(response=>response.json()),
         catchError(this.HandleError)
    );
}
getAllAssignedUser(officeId,serviceId){
    return this.http.get(this.urlServiceDeligation+'/AuthorizeUsers?ServiceUid='+serviceId+
    '&OfficeUid='+officeId+'&includeInActives=false')
    .pipe(
         map(response=>response.json()),
         catchError(this.HandleError)
    );
}

  private HandleError(err: Response) {
    if (err.status === 404) {
      return Observable.throw(new NotFoundError());
    }
    if (err.status === 400) {
      return Observable.throw(new BadInput(err.json()));
    }
    return Observable.throw(new AppError(err));
  }
}


// models

export interface ServiceRequest {
  id: string;
  serviceId: string;
  serviceRequestDate: Date;
  hmcApplicationReferenceNo?: string | undefined;
  applicantName: string;
  buildingName?: string | undefined;
  houseNo?: string | undefined;
  flatNo?: string | undefined;
  streetName?: string | undefined;
  pinCode?: string | undefined;
  contactNo?: string | undefined;
  eMailId?: string | undefined;
  isAutoPosted?: boolean;
  isProvisional?: boolean;
  isActive?: boolean;
  officeId: string;
  note?: string | undefined;
  actualUserId: string;
  dueDate?: Date;
}

export interface ServiceRequestDetails extends ServiceRequest {
  referenceNo?: string | undefined;
}

export interface FormIvRegister extends ServiceRequestDetails {
  srlNo?: number;
  serviceName?: string | undefined;
  department?: string | undefined;
  office?: string | undefined;
  status?: string | undefined;
  serviceProvided?: string | undefined;
  rejectedReason?: string | undefined;
  statusDate?: Date|undefined;
}

export interface IApplicationDueDateSummary {
  serviceId: string;
  serviceName: string;
  officeId: string;
  officeName: string;
  dueDate: string | undefined;
  count: number;
}

