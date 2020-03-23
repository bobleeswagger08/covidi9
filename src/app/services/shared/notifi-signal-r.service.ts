import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { catchError,map, retry } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AppError } from '../../shared/commonerror/app-error';
import { NotFoundError } from '../../shared/commonerror/not-found-error';
import { BadInput } from '../../shared/commonerror/bad-input';

@Injectable({
  providedIn: 'root'
})
export class NotifiSignalRService {
  private url = 'https://localhost:5001/api/Notification';
  constructor(private http:Http) { }

  getAll(code?:string){
        return this.http.get(this.url)
        .pipe(
             map(response=>response.json()),
             catchError(this.HandleError)
        );
  }
    create(resource){
      //return this.http.post(this.url,JSON.stringify(resource))
      return this.http.post(this.url,resource)
      .pipe(
          map(response=>response.json()),
          catchError(this.HandleError)
          );
    }
    update(resource){
     // return this.http.patch(this.url+'/'+resource.id,JSON.stringify({isRead:true}))
     //return this.http.patch(this.url+'/Id/'+resource.code,JSON.stringify(resource))
      return this.http.patch(this.url+'/Id/'+resource.code,resource)
      .pipe( 
          map(response=>response.json()),
          catchError(this.HandleError)
          );
    }
    updatePut(resource){
      // return this.http.patch(this.url+'/'+resource.id,JSON.stringify({isRead:true}))
       return this.http.put(this.url+'/Id/'+resource.code,resource)
       .pipe( 
           map(response=>response.json()),
           catchError(this.HandleError)
           );
     }
    delete(id){
      return  this.http.delete(this.url+'/'+id)
      .pipe( 
          map(response=>response.json()),
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
