import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { DataService } from '../data.service';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService extends DataService{

  constructor(http:Http) { 
    super("http://192.168.1.20/UserAuthorization/ApplicationModule/Get/2",http);
  }
}
