import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApplicationEnvironmentService } from 'app/services/application-environment/application-environment.service';
import { ICandidateFilter,  IFieldInput, ColsedReason, CandidateDateWiseReport, CandidateReportFilter } from '../model/candidate-input';
import { ICandidateInput, CandidateSearchFilter, CandidateListItem } from '../model/candidate-input';
import { Observable } from 'rxjs';


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
  getCandidateList(filterParam:CandidateSearchFilter):Observable<CandidateListItem[]>
  {
    return this.httpClient.post<CandidateListItem[]>(this.urlCovidI9+'/Covid19Candidate/List',filterParam);
  }
  getCandidateById(id:string){
    return this.httpClient.get(this.urlCovidI9+'/Covid19Candidate/'+id);
  }
  saveFieldInput(resourceInput:IFieldInput) { 
    return this.httpClient.post(this.urlCovidI9+'/Covid19Candidate/'+ resourceInput.candidateId,resourceInput);
      
  }
  getNotPickedUpReason(){
    return this.httpClient.get(this.urlCovidI9+'/NotContactedReason');
  }
  updateCandidateInput(resourceCandidate:ICandidateInput) {
    //return this.http.post(this.url,JSON.stringify(resource))
    return this.httpClient.post(this.urlCovidI9+'/Covid19Candidate/Update/'+ resourceCandidate.id, resourceCandidate);
      // .pipe(
      //   map(response => response.json()),
      //   catchError(this.HandleError)
      // );
  }
  getCandidateClosedReason()
  {
    return this.httpClient.get(this.urlCovidI9+'/CosedReason');
  }

  getDailyReportData(reportFilter : CandidateReportFilter):Observable<CandidateDateWiseReport[]>
  {
    return this.httpClient.post<CandidateDateWiseReport[]>(this.urlCovidI9+'/Covid19Candidate/DateWiseReport',reportFilter);
  }
}
