import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApplicationEnvironmentService } from 'app/services/application-environment/application-environment.service';
import { ICourtMaster } from '../models/court-master';
import { ICCOrderType } from '../models/court-case-order';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourtCaseService {
  listOrderType:ICCOrderType[]=[
  {"id": 1,"description": "Legal Document"},
  {"id": 2,"description": "Court case Order"}
]

  constructor(private httpClient: HttpClient,private appEnvService: ApplicationEnvironmentService) { }
  private urlCourtMaster = this.appEnvService.configParam.courtCaseServiceUrl + '/Court';
  private urlLawyerMaster = this.appEnvService.configParam.courtCaseServiceUrl + '/Lawyer';
  private urlAddress = this.appEnvService.configParam.configServiceUrl + '/Address';
  private urlLawyerPanel = this.appEnvService.configParam.courtCaseServiceUrl + '/LawyerPanel';
  private urlCourtCase = this.appEnvService.configParam.courtCaseServiceUrl + '/CourtCase';
  private urlCourtCaseOrder = this.appEnvService.configParam.courtCaseServiceUrl + '/CourtCaseOrder';
  createCourtMaster(resource) {
    //return this.http.post(this.url,JSON.stringify(resource))
    return this.httpClient.post(this.urlCourtMaster, resource);
      // .pipe(
      //   map(response => response.json()),
      //   catchError(this.HandleError)
      // );
  }
  saveAddress(resource) {
    //return this.http.post(this.url,JSON.stringify(resource))
    return this.httpClient.post(this.urlAddress, resource);
      // .pipe(
      //   map(response => response.json()),
      //   catchError(this.HandleError)
      // );
  } 
  getCourtMasterList(){
    return this.httpClient.get(this.urlCourtMaster+'/Courts?includeInActives=true');
  }
  getCourtMasterById(id?:string){
    return this.httpClient.get(this.urlCourtMaster+'/'+id);
  }
  getCourtAddressById(id?:string){
    return this.httpClient.get(this.urlAddress+'/'+id);
  }
  updateCourtMaster(resource) {
    //return this.http.post(this.url,JSON.stringify(resource))
    return this.httpClient.put(this.urlCourtMaster+'/'+resource.id, resource);
      // .pipe(
      //   map(response => response.json()),
      //   catchError(this.HandleError)
      // );
  }

  createLawyerMaster(resource) {
    //return this.http.post(this.url,JSON.stringify(resource))
    return this.httpClient.post(this.urlLawyerMaster, resource);
      // .pipe(
      //   map(response => response.json()),
      //   catchError(this.HandleError)
      // );
  }
  getLawyerMasterList(){
    return this.httpClient.get(this.urlLawyerMaster+'/Lawyers?includeInActives=true');
  }
  getLawyerMasterById(id?:string){
    return this.httpClient.get(this.urlLawyerMaster+'/'+id);
  }
  updateLawyerMaster(resource) {
    //return this.http.post(this.url,JSON.stringify(resource))
    return this.httpClient.put(this.urlLawyerMaster+'/'+resource.id, resource);
      // .pipe(
      //   map(response => response.json()),
      //   catchError(this.HandleError)
      // );
  }
  updateLawyerPanel(resource) {
    //return this.http.post(this.url,JSON.stringify(resource))
    return this.httpClient.post(this.urlLawyerPanel, resource);
      // .pipe(
      //   map(response => response.json()),
      //   catchError(this.HandleError)
      // );
  }
  getLawyerPanelByEffectiveDate(effectiveFromDate:string){
    return this.httpClient.get(this.urlLawyerPanel+'/'+effectiveFromDate);
  }
  createCourtCaseMaster(resource) {
    //return this.http.post(this.url,JSON.stringify(resource))
    return this.httpClient.post(this.urlCourtCase, resource);
      // .pipe(
      //   map(response => response.json()),
      //   catchError(this.HandleError)
      // );
  }
  getCourtCaseMasterList(){
    return this.httpClient.get(this.urlCourtCase+'/CourtCases?includeInActives=true');
  }
  getCourtCaseMasterById(id:string){
    return this.httpClient.get(this.urlCourtCase+'/'+id);
  }
  updateCourtCaseMaster(resource) {
    //return this.http.post(this.url,JSON.stringify(resource))
    return this.httpClient.put(this.urlCourtCase+'/'+resource.id, resource);
      // .pipe(
      //   map(response => response.json()),
      //   catchError(this.HandleError)
      // );
  }
  createCourtCaseOrder(resource) {
    //return this.http.post(this.url,JSON.stringify(resource))
    return this.httpClient.post(this.urlCourtCaseOrder, resource);
      // .pipe(
      //   map(response => response.json()),
      //   catchError(this.HandleError)
      // );
  }
  getCourtCaseOrderList(isIncoming){
    return this.httpClient.get(this.urlCourtCaseOrder+'/CourtCaseOrders?includeInActives=true&OnlyIncomingOrders='+isIncoming);
  }
  updateCourtCaseOrder(resource) {
    //return this.http.post(this.url,JSON.stringify(resource))
    return this.httpClient.put(this.urlCourtCaseOrder+'/'+resource.id, resource);
      // .pipe(
      //   map(response => response.json()),
      //   catchError(this.HandleError)
      // );
  }
  getCourtCaseOrderById(id:string){
    return this.httpClient.get(this.urlCourtCaseOrder+'/'+id);
  }
  getCourtCaseOrderType(){
    return of(this.listOrderType);
  }
}
