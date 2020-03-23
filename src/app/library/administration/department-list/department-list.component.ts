import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ConfigurationlistService } from 'app/services/config/configurationlist.service';
import { IDepatmentListParent } from 'app/model/department';
import { Router } from '@angular/router';
import { BaseComponent } from '../../shared-controls/base-component/base-component.component';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppError } from 'app/shared/commonerror/app-error';

@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.scss']
})
export class DepartmentListComponent extends BaseComponent implements OnInit {

  constructor(private service : ConfigurationlistService,private router:Router,cdr: ChangeDetectorRef,private SpinnerService: NgxSpinnerService) {
    super(cdr);
    this.SpinnerService.show(); 
    let requestId = this.registerDataRequest();
    this.service.getDepartmentList()
    .subscribe((officeList:any[]) =>{
     // this.listOffice = officeList;
      this.dataSource=new MatTableDataSource(officeList);
      this.signalDataRequestCompletion(requestId);
      this.dataSource.paginator = this.paginator; 
      this.dataSource.sort = this.sort; 
      this.SpinnerService.hide();
     },(error: AppError) => {
    this.SpinnerService.hide();
    });
   }
  listOffice:IDepatmentListParent[];
  dataSource:MatTableDataSource<IDepatmentListParent>;
  displayedColumns: string[] = ['code', 'description','modifyButton'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  ngOnInit() {
   // this.getParentList();
  }

  goToAddPage() {
    this.router.navigate(['administration/department','null']);
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  gotoUpdatePage(id){
    this.router.navigate(['administration/department',id])
  }
}
