import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { ApplicationEnvironmentService } from 'app/services/application-environment/application-environment.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-file-upload-screen',
  templateUrl: './file-upload-screen.component.html',
  styleUrls: ['./file-upload-screen.component.scss']
})
export class FileUploadScreenComponent implements OnInit {


  candidateList: CandidateInfo[] = [];
  listSourceName: string = "District";
  ignoreDataError: boolean = false;

  dataSource = new MatTableDataSource(this.candidateList);
  public get rowCount(): number {
    if (this.candidateList) {
      return this.candidateList.length;
    }
    else {
      return 0;
    }
  }

  dataLoaded: boolean = false;
  isSaving: boolean = false;

  get canSubmit(): boolean {
    if (!this.isSaving && this.dataLoaded && this.rowCount > 0 && (!this.hasDataError || this.ignoreDataError)) {
      return true;
    }
    else {
      return false;
    }
  }

  get incorrectArrivalDateCount(): number {
    let count: number = 0;
    if (this.candidateList) {
      let result = this.candidateList.filter(c => !c.arivalDate);
      if (result) {
        count = result.length;
      }
    }

    return count;
  }

  get hasDataError(): boolean {
    return (this.incorrectArrivalDateCount > 0) ? true : false;
  }

  @Output() public onUploadFinished = new EventEmitter();

  // dataSource: CandidateData[];
  displayedColumns: string[] = ['serialNo', 'name', 'mobileNo', 'arivalDate', 'address', 'countryVisited'];

  constructor(private http: HttpClient, private applicationEnvironment: ApplicationEnvironmentService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
  }

  public uploadFile = (files) => {
    if (files.length === 0) {
      return;
    }

    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    this.dataLoaded = false;
    this.dataSource = new MatTableDataSource([]);
    this.submitFile(formData)
      .subscribe(
        r => {
          console.log(r);
          this.candidateList = r;
          this.dataSource = new MatTableDataSource(this.candidateList);
          this.dataLoaded = true;
          this.cdr.detectChanges();
          alert("Data loaded");
          // this.table.renderRows();
        },
        e => alert("An error occurred in uploading the file")
      );
  }

  private submitFile(formData: FormData): Observable<CandidateInfo[]> {
    let serviceUrl = this.applicationEnvironment.configParam.configServiceUrl + '/ExcelUploader';

    return this.http.post<CandidateInfo[]>(serviceUrl, formData);
  }

  saveCandidateList() {
    this.isSaving = true;
    const candidateFileInfo: CandidateFileInfo = {};
    candidateFileInfo.id = this.applicationEnvironment.configParam.getUuid();
    candidateFileInfo.fileName = "abc";
    candidateFileInfo.candidates = this.candidateList;
    for (let candidate of candidateFileInfo.candidates) {
      candidate.source = this.listSourceName;
    }

    this.submitCandidateList(candidateFileInfo).subscribe
      (
        r => {
          if (r) {
            alert("Data saved");
            this.candidateList = [];
            this.dataLoaded = false;

          }
          else {
            alert("Data could not be saved");
          }
          this.isSaving = false;
        },
        e => {
          console.log(e);
          alert("Failed to save data");
        }
      )

  }

  private submitCandidateList(fileData: CandidateFileInfo): Observable<any> {
    let serviceUrl = this.applicationEnvironment.configParam.configServiceUrl + '/Covid19Candidate/BulkSave';
    return this.http.post(serviceUrl, fileData);
  }


}

// export interface CandidateData {
//   id?: string;
//   source?: string | undefined;
//   serialNo?: string | undefined;
//   name?: string | undefined;
//   flightNo?: string | undefined;
//   countryVisited?: string | undefined;
//   dob?: string | undefined;
//   age?: string | undefined;
//   sex?: string | undefined;
//   flightNumber?: string | undefined;
//   arivalDate?: string | undefined;
//   mobileNo?: string | undefined;
//   address?: string | undefined;
//   finalDestination?: string | undefined;
//   block?: string | undefined;
//   state?: string | undefined;
//   note?: string | undefined;
//   wardNo?: string | undefined;
//   uphc?: string | undefined;
//   isActive?: boolean;
//   // fieldData?: CandidateFieldDataDefiinition[] | undefined;
// }

interface CandidateFileInfo {
  id?: string;
  fileName?: string | undefined;
  dateOfUpload?: Date;
  uploadedBy?: string | undefined;
  totalNoOfRecords?: number;
  errorCount?: number;
  fileSource?: string | undefined;
  candidates?: CandidateInfo[] | undefined;
}

interface CandidateInfo {
  serialNo?: string | undefined;
  name?: string | undefined;
  flightNo?: string | undefined;
  countryVisited?: string | undefined;
  dob?: string | undefined;
  age?: string | undefined;
  sex?: string | undefined;
  flightNumber?: string | undefined;
  arivalDate?: string | undefined;
  mobileNo?: string | undefined;
  address?: string | undefined;
  finalDestination?: string | undefined;
  block?: string | undefined;
  state?: string | undefined;
  note?: string | undefined;
  wardNo?: string | undefined;
  uphc?: string | undefined;
  source?: string | undefined;
}

