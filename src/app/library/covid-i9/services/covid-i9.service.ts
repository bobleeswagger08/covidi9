import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApplicationEnvironmentService } from 'app/services/application-environment/application-environment.service';
import { ICandidateFilter, ICandidateInput } from '../model/candidate-input';

@Injectable({
  providedIn: 'root'
})
export class CovidI9Service {

  constructor(private httpClient: HttpClient,private appEnvService: ApplicationEnvironmentService) { }
  private urlCovidI9 = this.appEnvService.configParam.covidi9Url;
  saveCandidateInput(resourceCandidate:ICandidateInput) {
    //return this.http.post(this.url,JSON.stringify(resource))
    return this.httpClient.post(this.urlCovidI9+'/Covid19Candidate', resourceCandidate);
      // .pipe(
      //   map(response => response.json()),
      //   catchError(this.HandleError)
      // );
  }
  getWardList(){
    return this.httpClient.get(this.urlCovidI9+'/Wards');
  }
  getUPHCList(){
    return this.httpClient.get(this.urlCovidI9+'/UPHC');
  }
  getCandidateList(filterParam:ICandidateFilter){
    return this.httpClient.post(this.urlCovidI9+'/Covid19Candidate/List',filterParam);
  }
  getCandidateById(id:string){
    return this.httpClient.get(this.urlCovidI9+'/Covid19Candidate/'+id);
  }
}
