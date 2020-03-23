import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { IRoleMaster } from 'app/model/rolemaster';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { BaseComponent } from '../../shared-controls/base-component/base-component.component';
import { ConfigurationlistService } from 'app/services/config/configurationlist.service';
import { AppError } from 'app/shared/commonerror/app-error';

@Component({
  selector: 'app-role-master-list',
  templateUrl: './role-master-list.component.html',
  styleUrls: ['./role-master-list.component.scss']
})
export class RoleMasterListComponent extends BaseComponent implements OnInit {
  displayedColumns: string[] = ['code','description','updatebutton'];
  listRoleeMaster: IRoleMaster[];
  dataSource:MatTableDataSource<IRoleMaster>;
  
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(public configlist: ConfigurationlistService,private router:Router, cdr: ChangeDetectorRef,private SpinnerService: NgxSpinnerService) {
    super(cdr);
    this.SpinnerService.show();  
    let requestId = this.registerDataRequest();
    this.configlist.getRoleMasters()
      .subscribe(rmList => {
        this.dataSource=new MatTableDataSource(rmList);
        this.signalDataRequestCompletion(requestId);
        this.dataSource.paginator = this.paginator; 
        this.dataSource.sort = this.sort; 
        this.SpinnerService.hide();
      },(error: AppError) => {
        this.SpinnerService.hide();
        });
   }

  ngOnInit() {
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  gotoUpdatePage(id){
    this.router.navigate(['administration/rolemaster',id])
  }
  goToAddPage() {
    this.router.navigate(['administration/rolemaster','null']);
  }

}
