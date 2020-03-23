import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { catchError, map, retry } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AppError } from '../../shared/commonerror/app-error';
import { NotFoundError } from '../../shared/commonerror/not-found-error';
import { BadInput } from '../../shared/commonerror/bad-input';
import { ConfigParamService } from '../config-param/config-param.service';
import { LoginResponse } from 'app/model/user';
import { ApplicationEnvironmentService } from '../application-environment/application-environment.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  private urluserrole :string;
  private urlorgunit :string;
  private urlusersignup :string;
  private urluser :string;
  private urluserrolemaster :string;
  private urldepartment :string;
  
  constructor(private http:Http,public appEnvService: ApplicationEnvironmentService ) { 
    this.urluserrole = appEnvService.configParam.configServiceUrl + '/UserRole/Post/2';
    this.urlorgunit = appEnvService.configParam.configServiceUrl +'/OrganizationUnit';
    this.urlusersignup = appEnvService.configParam.configServiceUrl +'/Login';
    this.urluser = appEnvService.configParam.configServiceUrl +'/User';
     this.urluserrolemaster = appEnvService.configParam.configServiceUrl+'/UserRole';
     this.urldepartment = appEnvService.configParam.configServiceUrl+'/Department';
  }
  createUserRole(resource) {
    //return this.http.post(this.url,JSON.stringify(resource))
    return this.http.post(this.urluserrole, resource)
      .pipe(
        map(response => response.json()),
        catchError(this.HandleError)
      );
  }
  updateOrganisationUnit(resource) {
    // return this.http.patch(this.url+'/'+resource.id,JSON.stringify({isRead:true}))
    return this.http.put(this.urlorgunit + '/' + resource.id, resource)
      .pipe(
        map(response => response.json()),
        catchError(this.HandleError)
      );
  }

  createOrganisationUnit(resource) {
    //return this.http.post(this.url,JSON.stringify(resource))
    return this.http.post(this.urlorgunit, resource)
      .pipe(
        map(response => response.json()),
        catchError(this.HandleError)
      );
  }
  createUser(resource) {
    //return this.http.post(this.url,JSON.stringify(resource))
    return this.http.post(this.urluser, resource)
      .pipe(
        map(response => response.json()),
        catchError(this.HandleError)
      );
  }
  getIPAddress()
  {
    return this.http.get("https://cors-anywhere.herokuapp.com/http://api.ipify.org/?format=json")
    .pipe(
          map(response =>response.json()),
          catchError(this.HandleError)
    );
  }

  signInUser(signInUser):Observable<any> {
    //return this.http.post(this.url,JSON.stringify(resource))
    //let loginCrdential = { userId: SignInUser.username, password: SignInUser.password };
    //loginCrdential.userId = SignInUser.username;

    //return this.http.get(this.urlusersignup+'?UserId='+SignInUser.username+'&Password='+SignInUser.password)
    return this.http.post(this.urlusersignup, signInUser)
      .pipe(
        map(response =>response.json()
          ),
        catchError(this.HandleError)
      );
  }
  updateUser(resource) {
    // return this.http.patch(this.url+'/'+resource.id,JSON.stringify({isRead:true}))
    return this.http.post(this.urluser + '/' + resource.id + '?UpdateUserId=' + resource.id, resource)
      .pipe(
        map(response => response.json()),
        catchError(this.HandleError)
      );
  }
  changePassword(resource) {
    // return this.http.patch(this.url+'/'+resource.id,JSON.stringify({isRead:true}))
    return this.http.post(this.urluser + '/ResetPassword', resource)
      .pipe(
        map(response => response.json()),
        catchError(this.HandleError)
      );
  }
  createUserRoleMaster(resource) {
    //return this.http.post(this.url,JSON.stringify(resource))
    return this.http.post(this.urluserrolemaster, resource)
      .pipe(
        map(response => response.json()),
        catchError(this.HandleError)
      );
  }
  updateUserRoleMaster(resource) {
    //return this.http.post(this.url,JSON.stringify(resource))
    return this.http.put(this.urluserrolemaster + '/' + resource.id, resource)
      .pipe(
        map(response => response.json()),
        catchError(this.HandleError)
      );
  }
  createDepartment(resource) {
    return this.http.post(this.urldepartment, resource)
      .pipe(
        map(response => response.json()),
        catchError(this.HandleError)
      );
  }
  UpdateDepartment(resource) {
    return this.http.put(this.urldepartment + '/' + resource.id, resource)
      .pipe(
        map(response => response.json()),
        catchError(this.HandleError)
      );
  }
  
  private HandleError(err:Response){
    if(err.status===404){
      alert('Network not available.Please contact system admin')
      return Observable.throw(new NotFoundError());
    }
    if (err.status === 400) {
      return Observable.throw(new BadInput(err.json()));
    }
    return Observable.throw(new AppError(err));
  }
}


interface ILoginCredential {
  userId: string;
  password: string;
}