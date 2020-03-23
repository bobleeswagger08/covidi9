import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { BaseComponent } from 'app/library/shared-controls/base-component/base-component.component';
import { CourtCaseService } from '../services/court-case.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { AppError } from 'app/shared/commonerror/app-error';
import { ICourtCaseOrderList } from '../models/court-case-order';

@Component({
  selector: 'app-court-case-order-list',
  templateUrl: './court-case-order-list.component.html',
  styleUrls: ['./court-case-order-list.component.scss']
})
export class CourtCaseOrderListComponent extends BaseComponent implements OnInit {

  isIncoming:boolean;
  constructor(private route: ActivatedRoute,private ccoService:CourtCaseService,private router:Router,cdr: ChangeDetectorRef,private SpinnerService: NgxSpinnerService) {
    super(cdr);
    this.isIncoming = JSON.parse(this.route.snapshot.paramMap.get('isIncoming'));
    this.SpinnerService.show(); 
    let requestId = this.registerDataRequest();
    this.ccoService.getCourtCaseOrderList(this.isIncoming)
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
   listCourtCaseOrder:ICourtCaseOrderList[];
   dataSource:MatTableDataSource<ICourtCaseOrderList>;
   displayedColumns: string[] = ['orderReferenceNo','orderDate','courtCaseCode', 'courtCase','courtCode','court','modifyButton'];
   @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
   @ViewChild(MatSort, {static: true}) sort: MatSort;


  ngOnInit() {
    
  }
  goToAddPage() {
    this.router.navigate(['courtcase/courtcaseorder',this.isIncoming,'']);
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  gotoUpdatePage(id){
    this.router.navigate(['courtcase/courtcaseorder',this.isIncoming,id])
  }

}
