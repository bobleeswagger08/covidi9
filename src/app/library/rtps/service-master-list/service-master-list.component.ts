import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { RtpsService } from '../services/rtps/rtps.service';
import { IServiceMaster } from 'app/library/rtps/model/rtps';
import { Router } from '@angular/router';
import { BaseComponent } from '../../shared-controls/base-component/base-component.component';
import { NgxSpinnerService } from "ngx-spinner"; 
import * as XLSX from "xlsx";
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { AppError } from 'app/shared/commonerror/app-error';


@Component({
  selector: 'app-service-master-list',
  templateUrl: './service-master-list.component.html',
  styleUrls: ['./service-master-list.component.scss']
})
export class ServiceMasterListComponent extends BaseComponent implements OnInit {
  displayedColumns: string[] = ['code','description','department','updatebutton'];
  listServicemaster: IServiceMaster[];
 // dataSource:  IServiceMaster[];
  dataSource:MatTableDataSource<IServiceMaster>;
  //@ViewChild('TABLE',{static: false}) table: ElementRef;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(public rtps: RtpsService,private router:Router, cdr: ChangeDetectorRef,private SpinnerService: NgxSpinnerService) {
    super(cdr);
    this.SpinnerService.show();  
    let requestId = this.registerDataRequest();
    this.rtps.getServiceMaster()
      .subscribe(parentList => {
        //this.listServicemaster = parentList;
       // this.dataSource = parentList;
        this.dataSource=new MatTableDataSource(parentList);
        this.signalDataRequestCompletion(requestId);
        this.dataSource.paginator = this.paginator; 
        this.dataSource.sort = this.sort; 
        this.SpinnerService.hide();
        // console.log(this.listParent);
       // this.cdr.detectChanges();
        //alert('dataloaded')
      },(error: AppError) => {
        this.SpinnerService.hide();
        });
   }

  ngOnInit() {
    //this.getServiceMasterList();
   
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  getServiceMasterList() {
    
  }
  gotoUpdatePage(id){
    this.router.navigate(['rtps/servicemaster',id])
  }
  goToAddPage() {
    this.router.navigate(['rtps/servicemaster','null']);
  }
 
//   ExportTOExcel()
// {
//   const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(this.table.nativeElement);
//   const wb: XLSX.WorkBook = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  
//   /* save to file */
//   XLSX.writeFile(wb, 'SheetJS.xlsx');
  
// }



}
