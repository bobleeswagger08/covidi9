import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CourtCaseService } from '../services/court-case.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent } from 'app/library/shared-controls/base-component/base-component.component';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { ILawyerMaster } from '../models/lawyer-master';
import { AppError } from 'app/shared/commonerror/app-error';

@Component({
  selector: 'app-lawyer-master-list',
  templateUrl: './lawyer-master-list.component.html',
  styleUrls: ['./lawyer-master-list.component.scss']
})
export class LawyerMasterListComponent extends BaseComponent implements OnInit {

  constructor(private courtService:CourtCaseService,private router:Router,cdr: ChangeDetectorRef,private SpinnerService: NgxSpinnerService) {
    super(cdr);
    this.SpinnerService.show(); 
    let requestId = this.registerDataRequest();
    this.courtService.getLawyerMasterList()
    .subscribe((lawyerList:any[]) =>{
     // this.listOffice = officeList;
      this.dataSource=new MatTableDataSource(lawyerList);
      this.signalDataRequestCompletion(requestId);
      this.dataSource.paginator = this.paginator; 
      this.dataSource.sort = this.sort; 
      this.SpinnerService.hide();
     },(error: AppError) => {
    this.SpinnerService.hide();
    });
   }
   listLawyer:ILawyerMaster[];
   dataSource:MatTableDataSource<ILawyerMaster>;
   displayedColumns: string[] = ['code', 'description','modifyButton'];
   @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
   @ViewChild(MatSort, {static: true}) sort: MatSort;

  ngOnInit() {
  }
  goToAddPage() {
    this.router.navigate(['courtcase/lawyermaster','null']);
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  gotoUpdatePage(id){
    this.router.navigate(['courtcase/lawyermaster',id])
  }

}
