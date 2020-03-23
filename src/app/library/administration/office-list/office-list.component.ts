import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ConfigurationlistService } from '../../../services/config/configurationlist.service';
import { Router } from '@angular/router';
import { IOfficeListParent } from '../../../model/office'
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { BaseComponent } from '../../shared-controls/base-component/base-component.component';
import { AppError } from 'app/shared/commonerror/app-error';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-office-list',
  templateUrl: './office-list.component.html',
  styleUrls: ['./office-list.component.scss']
})
export class OfficeListComponent extends BaseComponent implements OnInit{
  listParent:IOfficeListParent[];
  dataSource:MatTableDataSource<IOfficeListParent>;
  displayedColumns: string[] = ['code', 'description','modifyButton'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  constructor(private service : ConfigurationlistService,private router:Router,cdr: ChangeDetectorRef,private SpinnerService: NgxSpinnerService) {
    super(cdr);
    this.SpinnerService.show();
    let requestId = this.registerDataRequest();
    this.service.getOrganisationalList()
    .subscribe(parentList =>{
     // this.listParent = parentList;
      this.dataSource=new MatTableDataSource(parentList);
      this.signalDataRequestCompletion(requestId);
      this.dataSource.paginator = this.paginator; 
      this.dataSource.sort = this.sort; 
     // console.log(this.listParent);
     this.SpinnerService.hide();
    },(error: AppError) => {
      this.SpinnerService.hide();
    });
   }
  getParentList(){
    
}
  ngOnInit() {
   // this.dataSource.paginator = this.paginator;  
   // this.dataSource.sort = this.sort; 
   // this.getParentList();
   // this.dataSource.paginator = this.paginator;
  }
  goToAddPage() {
    this.router.navigate(['administration/office','null']);
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  gotoUpdatePage(Id){
    this.router.navigate(['administration/office',Id])
  }

}

