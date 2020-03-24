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

  
  public progress: number;
  public message: string;
  public result: CandidateData[] = [];
  dataSource = new MatTableDataSource(this.result);
  public get rowCount(): number
  {
    if(this.result)
    {
      return this.result.length;
    }
    else
    {
      return 0;
    }
  }

  dataLoaded : boolean = false;

  get canSubmit():boolean
  {
    if(this.dataLoaded && this.rowCount > 0)
    {
      return true;
    }
    else
    {
      return false;
    }
  }

  @Output() public onUploadFinished = new EventEmitter();

  // dataSource: CandidateData[];
  displayedColumns: string[] = ['serialNo', 'name', 'mobileNo','arivalDate', 'address', 'countryVisited' ];

  constructor(private http: HttpClient, private applicationEnvironment: ApplicationEnvironmentService, private cdr :ChangeDetectorRef) { }

  ngOnInit() {
  }

  public uploadFile = (files) => {
    if (files.length === 0) {
      return;
    }

    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
this.dataLoaded=false;
   this.dataSource = new MatTableDataSource([]);
    this.submitFile(formData)
    .subscribe(
      r => {
        console.log(r);
      this.result = r;
        this.dataSource = new MatTableDataSource(this.result);
        this.dataLoaded = true;
        this.cdr.detectChanges();
        alert("Data loaded");
     // this.table.renderRows();
      },
      e => alert("An error occurred in uploading the file")
      );
  }

  private submitFile(formData: FormData): Observable<CandidateData[]> {
    let serviceUrl = this.applicationEnvironment.configParam.configServiceUrl + '/ExcelUploader';

    return this.http.post<CandidateData[]>(serviceUrl, formData);
  }



}

export interface CandidateData {
  id?: string;
  source?: string | undefined;
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
  isActive?: boolean;
  // fieldData?: CandidateFieldDataDefiinition[] | undefined;
}

