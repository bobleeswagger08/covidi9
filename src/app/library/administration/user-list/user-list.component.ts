import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { IListUser } from 'app/model/user';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { ConfigurationlistService } from 'app/services/config/configurationlist.service';
import { BaseComponent } from '../../shared-controls/base-component/base-component.component';
import { AppError } from 'app/shared/commonerror/app-error';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent extends BaseComponent implements OnInit {
  displayedColumns: string[] = ['code','userId','userFirstName','updatebutton'];
  listUser: IListUser[];
  dataSource:MatTableDataSource<IListUser>;
  
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  constructor(public configlist: ConfigurationlistService,private router:Router, cdr: ChangeDetectorRef,private SpinnerService: NgxSpinnerService) { 
    super(cdr);
    this.SpinnerService.show();  
    let requestId = this.registerDataRequest();
    this.configlist.getUserList()
      .subscribe(userList => {
        this.dataSource=new MatTableDataSource(userList);
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
  gotoUpdatePage(id){
    this.router.navigate(['administration/user',id])
  }
  goToAddPage() {
    console.log(document.getElementById('btnAdd').getBoundingClientRect())
    this.router.navigate(['administration/user','null']);
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
