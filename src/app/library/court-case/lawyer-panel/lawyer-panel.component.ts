import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { DatePipe, formatDate } from '@angular/common';
import { MatTable, MatPaginator, MatSort, MatDialogConfig, MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
import { LawyerPanelSelectionComponent } from '../lawyer-panel-selection/lawyer-panel-selection.component';
import { CourtCaseService } from '../services/court-case.service';
import { AppError } from 'app/shared/commonerror/app-error';
import { BadInput } from 'app/shared/commonerror/bad-input';
import { NgxSpinnerService } from 'ngx-spinner';
export interface ILawyerPanelFormValues {
  effectiveFrom:string;
  panel:ILPanelValues;
}
export interface ILPanelValues {
  lawyerId: string,
  panelInclusionDate: string,
  panelExclusionDate: string,
  isActive: boolean,
  isInternal: boolean
}
export interface IUser {
  userId: string,
  userName: string,
  serviceCode: string,
  serviceName: string,
  officeCode: string,
  officeName: string
}
export interface IListAssignedItem {
  effectiveFrom: string,
  panel: IListLawyerPanel;
}
export interface IListLawyerPanel{
  lawyerId: string,
  lawyerCode: string,
  lawyerDescription: string,
  panelInclusionDate: string,
  panelExclusionDate: string,
  mode:number
}

@Component({
  selector: 'app-lawyer-panel',
  templateUrl: './lawyer-panel.component.html',
  styleUrls: ['./lawyer-panel.component.scss']
})
export class LawyerPanelComponent implements OnInit {
  minDate:string;
  @ViewChild(MatTable, { static: false }) myTable: MatTable<IListAssignedItem>;
  displayedColumns: string[] = ['lawyerCode', 'lawyerDescription', 'panelInclusionDate', 'panelExclusionDate', 'updatebutton'];
  lpFormValues: ILawyerPanelFormValues={
    effectiveFrom:'',
    panel:{
      lawyerId: '',
      panelInclusionDate: '',
      panelExclusionDate: '',
      isActive: true,
      isInternal: false
    }
  }; 
  assignedLawyer: IListLawyerPanel[] = [];
 
  //@ViewChild('TABLE',{static: false}) table: ElementRef;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  
  constructor(private datepipe: DatePipe,private dialog: MatDialog,private lpService:CourtCaseService,
    private SpinnerService: NgxSpinnerService, private cdr: ChangeDetectorRef) { }



  ngOnInit() {
    let date = new Date();
    let formatedDate = this.datepipe.transform(date, 'yyyy-MM-dd');
    this.minDate = formatedDate;
  }
  public showLawyerSelectionDialog(lawyerSelectionInput?): Observable<IListLawyerPanel> {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    //const dialogRef = this.dialog.open(LawyerPanelSelectionComponent);
    //return dialogRef.afterClosed();
    if (lawyerSelectionInput) {
      if(lawyerSelectionInput.lawyerId)
                      lawyerSelectionInput.mode=1;
      dialogConfig.data = lawyerSelectionInput;
      const dialogRef = this.dialog.open(LawyerPanelSelectionComponent, dialogConfig);

      return dialogRef.afterClosed();
    }
    const dialogRef = this.dialog.open(LawyerPanelSelectionComponent);
    return dialogRef.afterClosed();
    // }
  }
  public onAddLawyer() {
    let assigningLawyer:IListLawyerPanel={
      panelInclusionDate:this.lpFormValues.effectiveFrom,
      panelExclusionDate:'',
      lawyerCode:'',
      lawyerDescription:'',
      lawyerId:'',
      mode:0
    }
      this.showLawyerSelectionDialog(assigningLawyer).subscribe
        (
          lawyer => {
            if (lawyer) {
              console.log(lawyer);
              this.updateLawyer(lawyer);
            }
          }
        );
  }
  private updateLawyer(assignmentItem) {
    if (assignmentItem) {
      let index: number;
      if (assignmentItem.mode == 1) {
        index = this.assignedLawyer.findIndex(r => r.lawyerCode === assignmentItem.lawyer.code);
        this.assignedLawyer.splice(index, 1);
      }
      // if (assignmentItem.mode == 2) {
      index = this.assignedLawyer.findIndex(r => r.lawyerCode === assignmentItem.lawyer.code);
      if (index < 0) {
        index = this.assignedLawyer.length;
      }
      else if (index <= this.assignedLawyer.length - 1) {
        alert('Lawyer already exists.')
        return false;
      }
      let aItem:any ={};
      aItem.lawyerId = assignmentItem.lawyer.id;
      aItem.lawyerCode = assignmentItem.lawyer.code;
      aItem.lawyerDescription = assignmentItem.lawyer.description;
      aItem.panelInclusionDate =  formatDate(assignmentItem.panelInclusionDate,'yyyy-MM-dd', 'en-US');
      aItem.panelExclusionDate = assignmentItem.panelExclusionDate?formatDate(assignmentItem.panelExclusionDate,'yyyy-MM-dd', 'en-US'):'';
      aItem.isActive = assignmentItem.lawyer.isActive,
      aItem.isInternal= assignmentItem.lawyer.isInternal
      this.assignedLawyer.splice(index, 1, aItem);

      this.myTable.renderRows();
      //this.dataSource=new MatTableDataSource(assignmentItem);
    }   
  }
  onDeleteLawyer(deletedItem) {
    if (deletedItem && deletedItem.lawyerCode) {
      let index = this.assignedLawyer.findIndex(r => r.lawyerCode == deletedItem.lawyerCode);
      if (index >= 0) {
        this.assignedLawyer.splice(index, 1);
        this.myTable.renderRows();
      }
    }
  }
  onSaveData(item) {
    //delete item.panel.lawyerCode;
    this.lpFormValues.panel=item;
    
    this.lpService.updateLawyerPanel(this.lpFormValues)
      .subscribe(lawyer => {
        alert('Lawyer Panel Updated  sucessfully')
        //this.router.navigate(['administration/userlist']);
      }, (error: AppError) => {
        if (error instanceof BadInput) {
          alert('invalid data');
        }
        else throw error;
      });
  }
  onUpdateLawyer(eventData: IListLawyerPanel) {
    if (eventData && eventData.lawyerCode) {
      let index = this.assignedLawyer.findIndex(r => r.lawyerCode == eventData.lawyerCode);
      if (index >= 0) {
        this.showLawyerSelectionDialog(eventData).subscribe
          (
            lawyer => {
              if (lawyer) {
                this.updateLawyer(lawyer);
              }
            }
          )
      }
    }
  }

  onResetData(){
    this.assignedLawyer = [];
    this.lpFormValues={
      effectiveFrom:'',
      panel:{
        lawyerId: '',
        panelInclusionDate: '',
        panelExclusionDate: '',
        isActive: true,
        isInternal: false
      }
    }; 
  }
  onEffectiveFromDateCahnge(evenetData){
    this.onResetData()
    console.log('called',evenetData.value);
    this.lpService.getLawyerPanelByEffectiveDate(formatDate(evenetData.value,'yyyy-MM-dd', 'en-US'))
    .subscribe((lawyerPanelList: ILawyerPanelFormValues) => {
      this.lpFormValues = lawyerPanelList;
      this.setPanelItem(this.lpFormValues.panel)
      this.cdr.detectChanges();
      this.lpFormValues.effectiveFrom=formatDate(evenetData.value,'yyyy-MM-dd', 'en-US');
      this.SpinnerService.hide();
    }, (error: AppError) => {
      this.SpinnerService.hide();
    });
  }
  setPanelItem(panelValue){
    for(let i=0;i<panelValue.length;i++){
      let aItem:any ={};
      aItem.lawyerId = panelValue[i].lawyerId;
      aItem.lawyerCode = panelValue[i].code;
      aItem.lawyerDescription = panelValue[i].name;
      aItem.panelInclusionDate =  formatDate( panelValue[i].panelInclusionDate,'yyyy-MM-dd', 'en-US');
      aItem.panelExclusionDate = formatDate( panelValue[i].panelExclusionDate,'yyyy-MM-dd', 'en-US');
      aItem.isActive = panelValue[i].isActive,
      aItem.isInternal= panelValue[i].isInternal
      this.assignedLawyer.splice(i, 1, aItem);
    }
    this.myTable.renderRows();
  }

}
