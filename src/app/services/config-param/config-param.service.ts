import { Injectable } from '@angular/core';
import { AlertManagementService } from '../alert-management/alert-management.service';
import { v4 as uuid } from 'uuid';
import { ApplicationUserService } from '../application-user/application-user.service';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigParamService {

  constructor() { 
   // this.sessionJwtToken= null;
  }
  //prod http://13.232.154.36/
  public configServiceUrl: string  = environment.configServiceUrl; // "http://192.168.1.200/applicationconfiguration"; //"http://localhost:5000"; //"http://192.168.1.200/applicationconfiguration"; //"http://localhost/applicationconfiguration"; // "http://192.168.1.200/applicationconfiguration"; // "http://13.234.214.18/applicationconfiguration";
  public rtpsServiceUrl: string  = environment.rtpsServiceUrl;
  public courtCaseServiceUrl: string  = environment.courtCaseServiceUrl;  // "http://192.168.1.200/Rtps"; //"http://localhost:5000"; // "http://13.232.154.36/Rtps"; 
  public covidi9Url: string  = "http://13.232.154.36/CovidCandiateTracker/Covid19Candidate";
  public emptyUUID: string = "00000000-0000-0000-0000-000000000000";

    //public setJwtSession(token:string)
    // {
    //   this.sessionJwtToken= token;
    // }

  // public sessionJwtToken:string;

  // public getSessionJwtToken():string
  // {
  //  let token:string = localStorage.getItem('securityToken');
  //  return token;
  // }

 
  

  public getUuid():string
  {
    return uuid();
  }

}
