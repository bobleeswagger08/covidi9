import { ConfigParamService } from '../config-param/config-param.service';
import { ApplicationUserService } from '../application-user/application-user.service';
import { Injectable } from '@angular/core';
import { AlertManagementService } from '../alert-management/alert-management.service';

@Injectable({
  providedIn: 'root'
})
export class ApplicationEnvironmentService {

  constructor(public configParam: ConfigParamService
    , public userSession: ApplicationUserService
    , public alertManager: AlertManagementService   
  ) {
    
  }

}
