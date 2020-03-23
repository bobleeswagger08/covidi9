import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { BaseComponent } from 'app/library/shared-controls/base-component/base-component.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { CourtCaseService } from '../services/court-case.service';
import { MatTableDataSource } from '@angular/material/table';
import { AppError } from 'app/shared/commonerror/app-error';
import { ICourtMaster } from '../models/court-master';
import { MatPaginator, MatSort } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-court-master-list',
  templateUrl: './court-master-list.component.html',
  styleUrls: ['./court-master-list.component.scss']
})
export class CourtMasterListComponent extends BaseComponent implements OnInit {

  constructor(private courtService:CourtCaseService,private router:Router,cdr: ChangeDetectorRef,private SpinnerService: NgxSpinnerService) {
    super(cdr);
    this.SpinnerService.show(); 
    let requestId = this.registerDataRequest();
    this.courtService.getCourtMasterList()
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
   listCourt:ICourtMaster[];
   dataSource:MatTableDataSource<ICourtMaster>;
   displayedColumns: string[] = ['code', 'description','modifyButton'];
   @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
   @ViewChild(MatSort, {static: true}) sort: MatSort;

  ngOnInit() {
  }
  goToAddPage() {
    this.router.navigate(['courtcase/courtmaster','null']);
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  gotoUpdatePage(id){
    this.router.navigate(['courtcase/courtmaster',id])
  }

}
