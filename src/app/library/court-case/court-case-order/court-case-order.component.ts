import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { v4 as uuid } from 'uuid';
import { DatePipe, formatDate } from '@angular/common';
import { CourtCaseService } from '../services/court-case.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent } from 'app/library/shared-controls/base-component/base-component.component';
import { ICourtCaseMasterList } from '../models/court-case-master';
import { AppError } from 'app/shared/commonerror/app-error';
import { BadInput } from 'app/shared/commonerror/bad-input';
import { ICourtCaseOrder, ICCOrderType, IInOutDependentValue } from '../models/court-case-order';
@Component({
  selector: 'app-court-case-order',
  templateUrl: './court-case-order.component.html',
  styleUrls: ['./court-case-order.component.scss']
})
export class CourtCaseOrderComponent extends BaseComponent implements OnInit {
  courtCaseOrderForm: FormGroup;
  id:string;
  isIncoming:boolean;
  minDate:string;
  courtCaseList:ICourtCaseMasterList;
  courtCaseOrderValue:ICourtCaseOrder;
  listCCOrderType:ICCOrderType[];
  inOutValue:IInOutDependentValue;
  constructor(private route: ActivatedRoute,private router:Router,private formBuilder: FormBuilder,
    private datepipe: DatePipe,private ccoService:CourtCaseService,private SpinnerService: NgxSpinnerService,cdr: ChangeDetectorRef) 
    { 
      super(cdr);
    }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.isIncoming = JSON.parse(this.route.snapshot.paramMap.get('isIncoming'));
    if(this.isIncoming)
    {
      this.inOutValue={orderRcvSntDate:"Receiving",rcvSntName:"Received From"}
    }
    else{
      this.inOutValue={orderRcvSntDate:"Sent",rcvSntName:"Sent To"}
    }

    this.courtCaseOrderForm = this.formBuilder.group({
      id: [uuid()],
      orderReferenceNo:['', Validators.required],
      courtCaseId:[],
      sendReceiverName:[],
      orderDate:[],
      orderReceiveDate:[],
      orderDetails:[],
      isIncoming: [this.isIncoming],
      orderTypeId:[],
      note: [],
      isActive: [true]
    });
    let date = new Date();
    let formatedDate = this.datepipe.transform(date, 'yyyy-MM-dd');
    this.minDate = formatedDate;

    this.getCourtCaseMasterList();
    this.getCourtCaseOrderType();

    if(this.id){
      if (this.id && this.id != 'null') {
        this.ccoService.getCourtCaseOrderById(this.id)
          .subscribe((ccoItem:ICourtCaseOrder) => {
            // this.petitionerValue=ccItem.petitioners.map(ao => ao.petitionerName).join();
            // this.respondentValue=ccItem.respondents.map(ao => ao.respondentName).join();
            // this.petitionArray = this.petitionerValue.split(',');
            // this.respondentArray = this.respondentValue.split(',');
            this.courtCaseOrderForm.setValue({
              id:ccoItem.id,
              orderReferenceNo:ccoItem.orderReferenceNo,
              courtCaseId:ccoItem.courtCaseId,
              orderDate:this.datepipe.transform(ccoItem.orderDate, 'yyyy-MM-dd'),
              orderReceiveDate:this.datepipe.transform(ccoItem.orderReceiveDate, 'yyyy-MM-dd'),
              orderDetails:ccoItem.orderDetails,
              sendReceiverName:ccoItem.sendReceiverName,
              isIncoming:ccoItem.isIncoming,
              orderTypeId:ccoItem.orderTypeId,
              note:{richTextEditor:ccoItem.note},
              isActive:ccoItem.isActive
            })
        });
      }
      
    }
  }

  getCourtCaseMasterList(){
    this.SpinnerService.show(); 
    let requestId = this.registerDataRequest();
    this.ccoService.getCourtCaseMasterList()
    .subscribe((cCaseList:ICourtCaseMasterList) =>{
     // this.listOffice = officeList;
      this.courtCaseList =cCaseList;
      this.signalDataRequestCompletion(requestId);
      this.SpinnerService.hide();
     },(error: AppError) => {
    this.SpinnerService.hide();
    });
  }
  submitCourtCaseOrderData(courtCaseOrderFormValue){
    // console.log(courtMasterFormValue);
     this.courtCaseOrderValue={
       id:courtCaseOrderFormValue.id,
       courtCaseId:courtCaseOrderFormValue.courtCaseId,
       orderReferenceNo:courtCaseOrderFormValue.orderReferenceNo,
       orderDate:formatDate(courtCaseOrderFormValue.orderDate,'yyyy-MM-dd', 'en-US'),
       orderReceiveDate:formatDate(courtCaseOrderFormValue.orderReceiveDate,'yyyy-MM-dd', 'en-US'),
       orderDetails:courtCaseOrderFormValue.orderDetails,
       isIncoming:courtCaseOrderFormValue.isIncoming,
       sendReceiverName:courtCaseOrderFormValue.sendReceiverName,
       orderTypeId:1,
       note:courtCaseOrderFormValue.note.richTextEditor,
       isActive:courtCaseOrderFormValue.isActive
     }
     
    // console.log(this.courtMasterValue);
 
     this.ccoService.createCourtCaseOrder(this.courtCaseOrderValue)
       .subscribe(court => {
         alert('Court Case Order Create  sucessfully')
         this.router.navigate(['courtcase/courtcaseorderlist',this.isIncoming]);
       }, (error: AppError) => {
         if (error instanceof BadInput) {
           alert('invalid data');
         }
         else throw error;
       });
   }

   updateCourtCaseOrderData(courtCaseOrderFormValue){
    this.courtCaseOrderValue={
      id:courtCaseOrderFormValue.id,
      courtCaseId:courtCaseOrderFormValue.courtCaseId,
      orderReferenceNo:courtCaseOrderFormValue.orderReferenceNo,
      orderDate:formatDate(courtCaseOrderFormValue.orderDate,'yyyy-MM-dd', 'en-US'),
      orderReceiveDate:formatDate(courtCaseOrderFormValue.orderReceiveDate,'yyyy-MM-dd', 'en-US'),
      orderDetails:courtCaseOrderFormValue.orderDetails,
      sendReceiverName:courtCaseOrderFormValue.sendReceiverName,
      isIncoming:courtCaseOrderFormValue.isIncoming,
      orderTypeId:1,
      note:courtCaseOrderFormValue.note.richTextEditor,
      isActive:courtCaseOrderFormValue.isActive
    }
    
   // console.log(this.courtMasterValue);

    this.ccoService.updateCourtCaseOrder(this.courtCaseOrderValue)
      .subscribe(court => {
        alert('Court Case Order Created  sucessfully')
        this.router.navigate(['administration/userlist',this.isIncoming]);
      }, (error: AppError) => {
        if (error instanceof BadInput) {
          alert('invalid data');
        }
        else throw error;
      });
   }
   getCourtCaseOrderType(){
    this.ccoService.getCourtCaseOrderType()
    .subscribe((ccoType:ICCOrderType[]) => this.listCCOrderType = ccoType);
   }

}
