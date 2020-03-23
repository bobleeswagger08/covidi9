import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { catchError,map, retry } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AppError } from '../../shared/commonerror/app-error';
import { NotFoundError } from '../../shared/commonerror/not-found-error';
import { BadInput } from '../../shared/commonerror/bad-input';
import { ApplicationURL} from '../../model/appurl'
import { MasterListItem } from 'app/model/master-list-item';
import { ConfigParamService } from '../config-param/config-param.service';
import { ApplicationEnvironmentService } from '../application-environment/application-environment.service';
import { HttpWrapperService, ActionType } from '../http-wrapper.service';
import { IListUser } from 'app/model/user';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationlistService {
  private url :string
  private urlFunctionalModule :string;
  private urlFunctionalAccessConfig :string;
  private urlUser :string;
  private urlUserRole :string;
  private urlDepartment :string;
  private urlSystemMessage :string;
  constructor(private http:Http,private httpClient:HttpClient,
    private appEnvService: ApplicationEnvironmentService,
    private customHttpService : HttpWrapperService
    ) { 
     this.url = appEnvService.configParam.configServiceUrl +'/OrganizationUnit';
     this.urlFunctionalModule = appEnvService.configParam.configServiceUrl+'/FunctionalModule/2';
     this.urlFunctionalAccessConfig = appEnvService.configParam.configServiceUrl+'/FunctionalModule/2/AccessConfiguration';
     this.urlDepartment =appEnvService.configParam.configServiceUrl+'/Department';
     this.urlUser =appEnvService.configParam.configServiceUrl+'/User';
     this.urlUserRole = appEnvService.configParam.configServiceUrl+'/UserRole';
     this.urlSystemMessage = appEnvService.configParam.configServiceUrl+'/SystemMessage';
  }
  getFunctionalModule(code?:string){
    if(code){
     return this.http.get(this.urlFunctionalModule+'/'+code)
     .pipe(
          map(response=>response.json()),
          catchError(this.HandleError)
     );
    }
    else{
        return this.http.get(this.urlFunctionalModule)
        .pipe(
             map(response=>response.json()),
             catchError(this.HandleError)
        );
    }
  }
  getFunctionalAccessConfig(code?:string){
    if(code){
     return this.http.get(this.urlFunctionalAccessConfig+'/'+code)
     .pipe(
          map(response=>response.json()),
          catchError(this.HandleError)
     );
    }
    else{
        return this.http.get(this.urlFunctionalAccessConfig)
        .pipe(
             map(response=>response.json()),
             catchError(this.HandleError)
        );
    }
  }
  getOrganisationalList(code?:string){
    if(code){
     return this.http.get(this.url+'/'+code)
     .pipe(
          map(response=>response.json()),
          catchError(this.HandleError)
     );
    }
    else{
        return this.http.get(this.url+"/00000000-0000-0000-0000-000000000000/list")
        .pipe(
             map(response=>response.json()),
             catchError(this.HandleError)
        );
    }
  }
  getUserById(id?:string){
     return this.http.get(this.urlUser+'/'+id)
     .pipe(
          map(response=>response.json()),
          catchError(this.HandleError)
     );
  }
  getUserList(id?:string){
    return this.http.get(this.urlUser+'/List?includeInactive=false&IncludeInternal=false')
    .pipe(
         map(response=>response.json()),
         catchError(this.HandleError)
    );
    // const url = this.urlUser+'/List?includeInactive=false&IncludeInternal=false';
    // return this.customHttpService.executeAction(ActionType.Get, url, null)
    // .pipe(
    //      map(response=>response.json()),
    //      catchError(this.HandleError)
    // );
 }
  getDepartmentList(){
    return this.httpClient.get(this.urlDepartment+'?includeInActives='+true);
    // .pipe(
    //      map(response=>response),
    //      catchError(this.HandleError)
    // );
 }
 getDepartmentById(id){
     return this.http.get(this.urlDepartment+'/'+id)
     .pipe(
          map(response=>response.json()),
          catchError(this.HandleError)
     );
  }
 getAuthorisedOfficerList(){
  return this.http.get(this.urlUserRole+'?includeSystemRoles='+false+'&includeInActives='+false)
  .pipe(
       map(response=>response.json()),
       catchError(this.HandleError)
  );
}
getRoleCategories(){
  return this.http.get(this.urlUserRole+'/Categories?includeInActives='+true)
  .pipe(
       map(response=>response.json()),
       catchError(this.HandleError)
  );
}
getRoleMasters(){
  return this.http.get(this.urlUserRole+'?includeSystemRoles=true&includeInActives='+true)
  .pipe(
       map(response=>response.json()),
       catchError(this.HandleError)
  );
}
getRoleMasterById(id?:string){
  return this.http.get(this.urlUserRole+'/'+id)
  .pipe(
       map(response=>response.json()),
       catchError(this.HandleError)
  );
}
getAllNotication(userId?:string){
     return this.http.get(this.urlSystemMessage+'/'+userId)
     .pipe(
          map(response=>response.json()),
          catchError(this.HandleError)
     );
}
getOrganizationUnitList(includeInActives: boolean): Observable<MasterListItem[]> {
     var requestUrl: string = this.appEnvService.configParam.configServiceUrl + '/OrganizationUnit/' + this.appEnvService.configParam.emptyUUID + "/list";
     if (includeInActives) {
       requestUrl = requestUrl + "?includeInActives=true";
     }
     return this.getMasterList(requestUrl);
   }
 
 ///migration
   getUserRoles(includeInActives: boolean, includeSystemRoles: boolean): Observable<MasterListItem[]> {
     // https://localhost:5001/UserRole?includeSystemRoles=true&includeInActives=true
     var requestUrl: string = this.appEnvService.configParam.configServiceUrl + '/UserRole';
     if (includeInActives || includeSystemRoles) {
       requestUrl = requestUrl + "?includeSystemRoles=" + includeSystemRoles + "&includeInActives=" + includeInActives;
     }
     return this.getMasterList(requestUrl);
   }
 
   getMasterList(url: string): Observable<MasterListItem[]> {
     return this.http.get(url)
       .pipe(
         map(response => response.json().map(m => new MasterListItem(m.id, m.code, m.description, m.isActive))),
         catchError(this.HandleError)
       );
   }
 
  private HandleError(err:Response){
    if(err.status===404){
      return Observable.throw(new NotFoundError());
    }
    if(err.status===400){
      return Observable.throw(new BadInput(err.json()));
    }
     return Observable.throw(new AppError(err));
  }
}