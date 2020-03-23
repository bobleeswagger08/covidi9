import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CourtCaseService } from '../services/court-case.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { IListLawyer, IListLawyerPanel } from '../models/lawyer-panel';
import { AppError } from 'app/shared/commonerror/app-error';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-lawyer-panel-selection',
  templateUrl: './lawyer-panel-selection.component.html',
  styleUrls: ['./lawyer-panel-selection.component.scss']
})
export class LawyerPanelSelectionComponent implements OnInit {
  listLawyer: IListLawyer[] = [];
  //selectedLawyer:IListLawyer;
  selectionMode:string="Add"
  selectedLPanel: IListLawyerPanel = {
    lawyer:{},
    panelExclusionDate: '',
    panelInclusionDate: '',
    isActive: true,
    isInternal: false,
    mode:0
  };
  minDate: string;
  constructor(public dialogRef: MatDialogRef<LawyerPanelSelectionComponent>, private datepipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: IListLawyerPanel, private ccPanel: CourtCaseService, private SpinnerService: NgxSpinnerService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    let date = new Date();
    let formatedDate = this.datepipe.transform(date, 'yyyy-MM-dd');
    this.minDate = formatedDate;
    console.log(this.data);
    this.getLawyerList();
    if (this.data) {
      this.selectedLPanel.panelExclusionDate = this.data.panelExclusionDate;
      this.selectedLPanel.panelInclusionDate = this.data.panelInclusionDate;
      // this.getLawyerById(this.data['lawyerId']);
      this.selectionMode="Update";
      this.selectedLPanel.mode=this.data.mode;
    }
  }
  getLawyerList() {
    this.ccPanel.getLawyerMasterList()
      .subscribe((lawyerList: IListLawyer[]) => {
        this.listLawyer = lawyerList;
        this.cdr.detectChanges();
        if (this.data && this.data['lawyerId']) {
          this.selectedLPanel.lawyer = this.listLawyer.find(l => l.id == this.data['lawyerId']);
        }
        this.SpinnerService.hide();
      }, (error: AppError) => {
        this.SpinnerService.hide();
      });
  }
  applyFilter(filterValue: string) {
    //this.getUserList();
    if (filterValue) {
      this.listLawyer = this.listLawyer.filter((data) => JSON.stringify(data.description).toLowerCase().indexOf(filterValue.toLowerCase()) !== -1)
    }
    else {
      this.getLawyerList();
    }
  }
  closeButtonClicked(result: boolean) {
    if (result) {
      if (!this.selectedLPanel) {
        alert('Please select a lawyer');
        return;
      }
      this.data = this.selectedLPanel;

    }
    else {
      this.data = null;
    }
    this.dialogRef.close(this.data);
  }
  panelExclusionDateCahnge(eventData){
    if(this.selectedLPanel.panelInclusionDate > eventData.value)
    {
      alert('Exlusion date can not be greater than Inclusion date')
      this.selectedLPanel.panelInclusionDate="";
    }
  }
}

