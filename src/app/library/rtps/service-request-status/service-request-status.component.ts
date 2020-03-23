import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RtpsService } from '../services/rtps/rtps.service';
import { IServiceRequest, IRequestStatus } from 'app/library/rtps/model/rtps';
import { BaseComponent } from '../../shared-controls/base-component/base-component.component';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AppError } from 'app/shared/commonerror/app-error';
import { BadInput } from 'app/shared/commonerror/bad-input';
import { MatButton, DateAdapter } from '@angular/material';

@Component({
  selector: 'app-service-request-status',
  templateUrl: './service-request-status.component.html',
  styleUrls: ['./service-request-status.component.scss']
})
export class ServiceRequestStatusComponent extends BaseComponent implements OnInit {
  @ViewChild(MatButton, {static: false}) updateButton: MatButton;
  listServiceRequest: IServiceRequest[];
  serviceRequestStatusForm: FormGroup;
  listRequestStatus:IRequestStatus[];
  id:string;
  displayReason:boolean=false;
  constructor(private rtps:RtpsService, private router:Router, private route: ActivatedRoute,
     cdr: ChangeDetectorRef,private datepipe: DatePipe, private dateAdapter: DateAdapter<Date>) {
    super(cdr);
    this.dateAdapter.setLocale('in');
   }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');

    this.serviceRequestStatusForm = new FormGroup({
      functionalityTypeId:new FormControl(1),
      referenceId: new FormControl('',[
        Validators.required,
      ]),
      statusId: new FormControl('', [
        Validators.required
      ]),
      statusDate: new FormControl('', [
        Validators.required
      ]),
      reason: new FormControl('', [
        Validators.required
      ]),
      note: new FormControl('', [
       // Validators.required
      ]),
      isActive: new FormControl(true)
    });

    let date = new Date();
    var formatedDate = this.datepipe.transform(date, 'yyyy-MM-dd');
    this.serviceRequestStatusForm.controls['statusDate'].setValue(formatedDate);
    if (this.id && this.id != 'null') {
      this.serviceRequestStatusForm.controls['referenceId'].setValue(this.id);
      this.serviceRequestStatusForm.controls['referenceId'].disable();
    }
    else{
      this.serviceRequestStatusForm.controls['referenceId'].setValue('');
      this.serviceRequestStatusForm.controls['referenceId'].enable();
    }

    this.getServiceRequestList();
    this.getRStatus();
    this.formControlValueChanged();
  }
  formControlValueChanged() {
    const reasonControl = this.serviceRequestStatusForm.get('reason');
    this.serviceRequestStatusForm.get('statusId').valueChanges.subscribe(
        (mode: number) => {
           // console.log(mode);
            if (mode === 5||mode === 3||mode === 6||mode === 7) {
              reasonControl.setValidators([Validators.required]);
              this.displayReason=true;
          }
          else {
            reasonControl.clearValidators();
            this.displayReason=false;
          }
          reasonControl.updateValueAndValidity();
        });
 }
  getServiceRequestList() {
    let requestId = this.registerDataRequest();
    let aaurlValue: any = {};
    aaurlValue.OrderById =1;
    let aaServiceValue: any = {};
      aaServiceValue.selectedServices=[]
      aaServiceValue.selectedOffices=[]
      aaServiceValue.selectedStatuses=[]
      aaServiceValue.selectedDepartments=[]
    this.rtps.getServiceRequestList(aaurlValue,aaServiceValue)
      .subscribe(srList => {
        this.listServiceRequest = srList
        // console.log(this.listParent);
        this.signalDataRequestCompletion(requestId);
      });
  }
  getRStatus() {
    this.rtps.getRequestStatus()
      .subscribe(listRStatus => {
        this.listRequestStatus = listRStatus
      });
  }
  onContentChanged() { }

  onSelectionChanged() { }

  UpdateServiceRequestStatus(){
    let requestStatusValue = this.serviceRequestStatusForm.getRawValue()
    this.rtps.updateRequestStatusPost(requestStatusValue)
    .subscribe(updateRequestStatus => {
      alert('Request status updated successfully');
      this.router.navigate(['rtps/svcrequestlist'])
    }, (error: AppError) => {
      if (error instanceof BadInput) {
      }
      else throw error;
    });
  }

}
