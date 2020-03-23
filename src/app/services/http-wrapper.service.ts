import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Http } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class HttpWrapperService {

  constructor(private httpService: Http) { }

  executeAction(actionType, url: string, dataObject): Observable<Response> {
   
    let action:IHTTPAction;

    // switch (actionType) {
    //   case  ActionType.Get: 
    //   action =(url:string) => this.httpService.get(url);
    //   break;
    //   case ActionType.Post:
    //     action = this.httpService.post;
    //     break;
    // }
    console.log(action);
    console.log(url);

   return action(url);   
  }
}

export enum ActionType {
  None = 0,
  Get = 1,
  Post = 2,
  Put = 3
}

interface IHTTPAction{
  (x:string) : Observable<Response>; 
}