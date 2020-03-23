import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { BaseComponent } from 'app/library/shared-controls/base-component/base-component.component';
import { CourtCaseService } from '../services/court-case.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ICourtCaseMasterList } from '../models/court-case-master';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { AppError } from 'app/shared/commonerror/app-error';

@Component({
  selector: 'app-court-case-master-list',
  templateUrl: './court-case-master-list.component.html',
  styleUrls: ['./court-case-master-list.component.scss']
})
export class CourtCaseMasterListComponent extends BaseComponent implements OnInit {

  constructor(private ccService:CourtCaseService,private router:Router,cdr: ChangeDetectorRef,private SpinnerService: NgxSpinnerService) {
    super(cdr);
    this.SpinnerService.show(); 
    let requestId = this.registerDataRequest();
    this.ccService.getCourtCaseMasterList()
    .subscribe((courtList:any[]) =>{
     // this.listOffice = officeList;
      this.dataSource=new MatTableDataSource(courtList);
      this.signalDataRequestCompletion(requestId);
      this.dataSource.paginator = this.paginator; 
      this.dataSource.sort = this.sort; 
      this.SpinnerService.hide();
     },(error: AppError) => {
    this.SpinnerService.hide();
    });
   }
   listCourtCase:ICourtCaseMasterList[];
   dataSource:MatTableDataSource<ICourtCaseMasterList>;
   displayedColumns: string[] = ['caseNo', 'initiationDate','courtCode','court','holdingNo','arNo','modifyButton'];
   @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
   @ViewChild(MatSort, {static: true}) sort: MatSort;
  ngOnInit() {
  }
  goToAddPage() {
    this.router.navigate(['courtcase/courtcasemaster','']);
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  gotoUpdatePage(id){
    this.router.navigate(['courtcase/courtcasemaster',id])
  }

}
