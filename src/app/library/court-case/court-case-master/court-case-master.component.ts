import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { v4 as uuid } from 'uuid';
import { DatePipe, formatDate } from '@angular/common';
import { CourtCaseService } from '../services/court-case.service';
import { ICourtMasterList, ICourtCaseMaster } from '../models/court-case-master';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppError } from 'app/shared/commonerror/app-error';
import { BaseComponent } from 'app/library/shared-controls/base-component/base-component.component';
import { BadInput } from 'app/shared/commonerror/bad-input';
import { ActivatedRoute, Router } from '@angular/router';
import { ICourtCaseOrderList } from '../models/court-case-order';
import { CCMasterValidators } from './courtcase.validators';

@Component({
  selector: 'app-court-case-master',
  templateUrl: './court-case-master.component.html',
  styleUrls: ['./court-case-master.component.scss']
})
export class CourtCaseMasterComponent extends BaseComponent implements OnInit {
  courtCaseMasterForm: FormGroup;
  courtCaseMasterValue:ICourtCaseMaster;
  petitionArray:string[]=[];
  respondentArray:string[]=[];
  petitionerValue:string;
  respondentValue:string;
  minDate:string;
  courtMasterList:ICourtMasterList;
  id:string;
  listCourtCaseOrder:ICourtCaseOrderList[];
  get petitionersControl() {
    return this.courtCaseMasterForm.controls.petitioners;
  }
  get respondentControl() {
    return this.courtCaseMasterForm.controls.respondents;
  }
  constructor(private route: ActivatedRoute,private router:Router,private formBuilder: FormBuilder,private datepipe: DatePipe,private ccService:CourtCaseService,
    private SpinnerService: NgxSpinnerService,cdr: ChangeDetectorRef,) {
      super(cdr);
     }

  ngOnInit() {

    this.id = this.route.snapshot.paramMap.get('id');

    this.courtCaseMasterForm = this.formBuilder.group({
      id: [uuid()],
      caseNo:['', Validators.required],
      referenceNo:['', Validators.required],
      courtId:['', Validators.required],
      courtOrderId:[''],
      initiationDate:[],
      petitioners:[''],
      respondents:[''],
      holdingNo:[],
      arNo:[],
      note: [],
      //address:[],
     // description:[],
      //remarks:[],
      isActive: [true],
      caseType:['00000000-0000-0000-0000-000000000000']
      // parentUnitId: new FormControl('', [
      //   Validators.required
      // ])
    });
    let date = new Date();
    let formatedDate = this.datepipe.transform(date, 'yyyy-MM-dd');
    this.minDate = formatedDate;

    this.getCourtMasterList();
    this.getCourtOrderList();
    
    if(this.id){
      if (this.id && this.id != 'null') {
        this.ccService.getCourtCaseMasterById(this.id)
          .subscribe((ccItem:ICourtCaseMaster) => {
            this.petitionerValue=ccItem.petitioners.map(ao => ao.petitionerName).join();
            this.respondentValue=ccItem.respondents.map(ao => ao.respondentName).join();
            this.petitionArray = this.petitionerValue.split(',');
            this.respondentArray = this.respondentValue.split(',');
            this.courtCaseMasterForm.setValue({
              id:ccItem.id,
              courtId:ccItem.courtId,
              holdingNo:ccItem.holdingNo,
              arNo:ccItem.arNo,
              caseNo:ccItem.caseNo,
              courtOrderId:ccItem.courtOrderId,
              initiationDate:this.datepipe.transform(ccItem.initiationDate, 'yyyy-MM-dd'),
              referenceNo:ccItem.referenceNo,
              petitioners:'',
              respondents:'',
              caseType:ccItem.caseType,
              note:{richTextEditor:ccItem.note},
              isActive:ccItem.isActive
            })
        });
      }
      
    }
  }
  addPetitioner(){
    if((!this.petitionersControl || this.petitionersControl.value=='') && this.petitionerValue)
    {
    this.petitionersControl.setValidators(CCMasterValidators.cannotContainSpace);
    return false;
   }
    this.petitionArray.push(this.petitionersControl.value)
    this.petitionersControl.setValue('')
    this.petitionerValue = this.petitionerValue +','+this.petitionArray.join();
    this.petitionArray=[]
  }
  addRespondent(){
    if((!this.respondentControl || this.respondentControl.value=='') && this.respondentValue)
    {
    this.respondentControl.setValidators(CCMasterValidators.cannotContainSpace);
    return false;
    }
    this.respondentArray.push(this.respondentControl.value)
    this.respondentControl.setValue('')
    this.respondentValue = this.respondentValue +','+this.respondentArray.join();
    this.respondentArray=[]
  }
  getCourtMasterList(){
    
    this.SpinnerService.show(); 
    let requestId = this.registerDataRequest();
    this.ccService.getCourtMasterList()
    .subscribe((courtList:ICourtMasterList) =>{
     // this.listOffice = officeList;
      this.courtMasterList =courtList;
      this.signalDataRequestCompletion(requestId);
      this.SpinnerService.hide();
     },(error: AppError) => {
    this.SpinnerService.hide();
    });
  }
  submitCourtCaseMasterData(courtCaseMasterFormValue){
    var resP = this.respondentArray.reduce(function(s, a){
      s.push({petitionerName: a});
      return s;
      }, [])
      var resR = this.respondentArray.reduce(function(s, a){
        s.push({respondentName: a});
        return s;
        }, [])
        this.petitionersControl.setValue(resP);
        this.respondentControl.setValue(resR);
        this.courtCaseMasterValue={
          id:courtCaseMasterFormValue.id,
          courtId:courtCaseMasterFormValue.courtId,
          holdingNo:courtCaseMasterFormValue.holdingNo,
          arNo:courtCaseMasterFormValue.arNo,
          caseNo:courtCaseMasterFormValue.caseNo,
          courtOrderId:courtCaseMasterFormValue.courtOrderId,
          initiationDate:this.datepipe.transform(courtCaseMasterFormValue.initiationDate, 'yyyy-MM-dd'),
          referenceNo:courtCaseMasterFormValue.referenceNo,
          petitioners: this.petitionersControl.value,
          respondents:this.respondentControl.value,
          caseType:courtCaseMasterFormValue.caseType,
          note:courtCaseMasterFormValue.note.richTextEditor,
          isActive:courtCaseMasterFormValue.isActive
        }
    
  //  console.log(this.courtCaseMasterValue);
    this.ccService.createCourtCaseMaster(this.courtCaseMasterValue)
      .subscribe(user => {
        alert('Court Case Master Created sucessfully')
        this.router.navigate(['courtcase/courtcasemasterlist']);
        this.petitionersControl.setValue('');
        this.respondentControl.setValue('');
      }, (error: AppError) => {
        if (error instanceof BadInput) {
          alert('invalid data');
        }
        else throw error;
      });
  }
  updateCourtMasterData(courtCaseMasterFormValue){
    var resP = this.respondentArray.reduce(function(s, a){
      s.push({petitionerName: a});
      return s;
      }, [])
      var resR = this.respondentArray.reduce(function(s, a){
        s.push({respondentName: a});
        return s;
        }, [])
        this.petitionersControl.setValue(resP);
        this.respondentControl.setValue(resR);
        this.courtCaseMasterValue={
          id:courtCaseMasterFormValue.id,
          courtId:courtCaseMasterFormValue.courtId,
          holdingNo:courtCaseMasterFormValue.holdingNo,
          arNo:courtCaseMasterFormValue.arNo,
          caseNo:courtCaseMasterFormValue.caseNo,
          courtOrderId:courtCaseMasterFormValue.courtOrderId,
          initiationDate:this.datepipe.transform(courtCaseMasterFormValue.initiationDate, 'yyyy-MM-dd'),
          referenceNo:courtCaseMasterFormValue.referenceNo,
          petitioners: this.petitionersControl.value,
          respondents:this.respondentControl.value,
          caseType:courtCaseMasterFormValue.caseType,
          note:courtCaseMasterFormValue.note.richTextEditor,
          isActive:courtCaseMasterFormValue.isActive
        }
    
  //  console.log(this.courtCaseMasterValue);
    this.ccService.updateCourtCaseMaster(this.courtCaseMasterValue)
      .subscribe(user => {
        alert('Court Case Master Updated sucessfully')
        this.router.navigate(['courtcase/courtcasemasterlist']);
        this.petitionersControl.setValue('');
        this.respondentControl.setValue('');
      }, (error: AppError) => {
        if (error instanceof BadInput) {
          alert('invalid data');
        }
        else throw error;
      });
  }
  getCourtOrderList(){
    this.SpinnerService.show(); 
    let requestId = this.registerDataRequest();
    this.ccService.getCourtCaseOrderList(true)
    .subscribe((courtOList:any[]) =>{
     // this.listOffice = officeList;
      this.listCourtCaseOrder=courtOList;
      this.signalDataRequestCompletion(requestId);
      this.SpinnerService.hide();
     },(error: AppError) => {
    this.SpinnerService.hide();
    });
  }

}
