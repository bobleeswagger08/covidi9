import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApplicationEnvironmentService } from 'app/services/application-environment/application-environment.service';

@Injectable({
  providedIn: 'root'
})
export class CovidI9Service {

  constructor(private httpClient: HttpClient,private appEnvService: ApplicationEnvironmentService) { }
  private urlCovidI9 = this.appEnvService.configParam.covidi9Url;
  saveCandidateInput(resource) {
    //return this.http.post(this.url,JSON.stringify(resource))
    return this.httpClient.post(this.urlCovidI9, resource);
      // .pipe(
      //   map(response => response.json()),
      //   catchError(this.HandleError)
      // );
  }
}
