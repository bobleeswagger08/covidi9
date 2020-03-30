import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { v4 as uuid } from 'uuid';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CovidI9Service } from '../services/covid-i9.service';
import { BadInput } from 'app/shared/commonerror/bad-input';
import { AppError } from 'app/shared/commonerror/app-error';
import { ICandidateInput, IFieldData, IListWard, IListUPHC, fieldFormValues, ColsedReason } from '../model/candidate-input';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-candidate-input',    
  templateUrl: './candidate-input.component.html',
  styleUrls: ['./candidate-input.component.scss']
})
export class CandidateInputComponent implements OnInit {
  candidateForm: FormGroup;
  fieldInput:IFieldData[];
  listWard:IListWard[];
  listUPHC:IListUPHC[];
  listClosedReason : ColsedReason[];
  id: string;
  tabIndex:number;
  candidateFormValue:ICandidateInput;
  fieldInputFormValue:fieldFormValues;
  candidateId:string;
  
  constructor(private route: ActivatedRoute,private router:Router,private formBuilder: FormBuilder,private covidService:CovidI9Service,private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.candidateId = uuid();
    this.id = this.route.snapshot.paramMap.get('id');
    this.tabIndex = Number(this.route.snapshot.paramMap.get('tabIndex'));
    // this.route.queryParams
    //   .subscribe(params => {s
    //     this.tabIndex = params.tabIndex;
    // });
    this.candidateForm = this.formBuilder.group({
      id: [this.candidateId],
      source: ['',Validators.required],
      serialNo: [],
      name: ['',Validators.required],
      candidateStatusId: [0],
      flightNo: [],
      countryVisited: [],
      dob: [],
      age: [],
      sex: [],
      flightNumber: [],
      arivalDate: [],
      mobileNo: [],
      address: [],
      finalDestination: [],
      block: [],
      state: [],
      note: [],
      wardNo: [],
      uphc: [],
      commentByMOIC: [],
      fieldData: [],
      isActive: [true]
    });

    this.getWardList();
    this.getUPHCList();
    this.getClosedReasonList();

    if (this.id && this.id != 'null') {
      this.candidateId=this.id;
      this.covidService.getCandidateById(this.id)
        .subscribe((cItem:ICandidateInput) => {
         // let result:IFieldData = { isEverContacted: "N"};
       //  let dateList =[];
         if(cItem.fieldData && cItem.fieldData.length>0){
          var dates = cItem.fieldData.map(function(x) { return new Date(x.dateOfContacted);});
          var latest = new Date(Math.max.apply(null,dates));
          this.fieldInputFormValue ={
              commentByMOIC:'',
              dateOfContacted:formatDate(latest,'yyyy-MM-dd', 'en-US'),
              id:uuid(),
              isEverContacted:cItem.fieldData[0].isEverContacted,
              isReferredForMedicalCare:'',
              isReleasedFromSurveillanc:'',
              isSymptomatic:'',
              reasonForNotContacted:'',
              reasonForUnableToTraceId:''
          }
        }
        else{
          this.fieldInputFormValue =null;
        }
          this.candidateForm.setValue({
            source: cItem.source , // ? 'District' : 'Others',
            name: cItem.name,
           candidateStatusId:cItem.candidateStatusId,
            flightNo: cItem.flightNo,
            countryVisited: cItem.countryVisited,
            dob: cItem.dob,
            age: cItem.age,
            sex: cItem.sex,
            flightNumber: cItem.flightNumber,
            arivalDate: cItem.arivalDate,
            mobileNo: cItem.mobileNo,
            address: cItem.address,
            finalDestination: cItem.finalDestination,
            block: cItem.block,
            state: cItem.state,
            note: cItem.note,
            wardNo: cItem.wardNo,
            uphc: cItem.uphc,
            isActive: cItem.isActive,
          //  commentByMOIC:cItem.commentByMOIC,
            commentByMOIC:'',
            fieldData:  this.fieldInputFormValue, 
            id: cItem.id,
            serialNo: cItem.serialNo
          }
          );
      }
      ,(e)=> alert("An error occurred loading data")
      );
    }
  }
  submitCandidateInputData(candidateInputFormValue){
    //this.candidateForm.controls['fieldData'][0].commentByMOIC{}
    console.log(candidateInputFormValue);
    //  this.fieldInput =[]
    //  if(candidateInputFormValue.fieldData && (candidateInputFormValue.fieldData!=[] || candidateInputFormValue.fieldData!=null))
    //  this.fieldInput.push(candidateInputFormValue.fieldData)

    this.candidateFormValue={
      source: candidateInputFormValue.source,
      name: candidateInputFormValue.name,
      candidateStatusId:candidateInputFormValue.candidateStatusId,
      flightNo: candidateInputFormValue.flightNo,
      countryVisited: candidateInputFormValue.countryVisited,
      dob: candidateInputFormValue.dob,
      age: candidateInputFormValue.age,
      sex: candidateInputFormValue.sex,
      flightNumber: candidateInputFormValue.flightNumber,
      arivalDate: formatDate(candidateInputFormValue.arivalDate,'yyyy-MM-dd', 'en-US'),
      mobileNo: candidateInputFormValue.mobileNo,
      address: candidateInputFormValue.address,
      finalDestination: candidateInputFormValue.finalDestination,
      block: candidateInputFormValue.block,
      state: candidateInputFormValue.state,
      note: candidateInputFormValue.note,
      wardNo: candidateInputFormValue.wardNo,
      uphc: candidateInputFormValue.uphc,
      isActive: true,
     // commentByMOIC:candidateInputFormValue.commentByMOIC,
      fieldData: null, 
      id: candidateInputFormValue.id,
      serialNo: candidateInputFormValue.serialNo
    }
    console.log(this.candidateFormValue)
    this.covidService.saveCandidateInput(this.candidateFormValue)
      .subscribe(court => {
        alert('Candidate data submited successfully')
        //this.router.navigate(['administration/userlist']);
      }, (error: AppError) => {
        if (error instanceof BadInput) {
          alert('invalid data');
        }
        alert(error.originalError);
      });
  }
  updateCandidateInputData(candidateInputFormValue){
    console.log(candidateInputFormValue);
    //  this.fieldInput =[]
    //  if(candidateInputFormValue.fieldData!=[])
    //  this.fieldInput.push(candidateInputFormValue.fieldData)

    this.candidateFormValue={
      source: candidateInputFormValue.source,
      name: candidateInputFormValue.name,
      candidateStatusId:candidateInputFormValue.candidateStatusId,
      flightNo: candidateInputFormValue.flightNo,
      countryVisited: candidateInputFormValue.countryVisited,
      dob: candidateInputFormValue.dob,
      age: candidateInputFormValue.age,
      sex: candidateInputFormValue.sex,
      flightNumber: candidateInputFormValue.flightNumber,
      arivalDate: formatDate(candidateInputFormValue.arivalDate,'yyyy-MM-dd', 'en-US'),
      mobileNo: candidateInputFormValue.mobileNo,
      address: candidateInputFormValue.address,
      finalDestination: candidateInputFormValue.finalDestination,
      block: candidateInputFormValue.block,
      state: candidateInputFormValue.state,
      note: candidateInputFormValue.note,
      wardNo: candidateInputFormValue.wardNo,
      uphc: candidateInputFormValue.uphc,
      isActive: true,
     // commentByMOIC:candidateInputFormValue.commentByMOIC,
      fieldData: null, 
      id: candidateInputFormValue.id,
      serialNo: candidateInputFormValue.serialNo
    }
    console.log(this.candidateFormValue)
    this.covidService.updateCandidateInput(this.candidateFormValue)
      .subscribe(court => {
        alert('Candidate data saved successfully')
        //this.router.navigate(['administration/userlist']);
      }, (error: AppError) => {
        if (error instanceof BadInput) {
          alert('invalid data');
        }
        alert(error.originalError);
      });

  }
  getWardList() {
    this.covidService.getWardList()
      .subscribe((listW:IListWard[]) => {
        this.listWard = listW
        this.cdr.detectChanges();
      });
  }
  getUPHCList() {
    this.covidService.getUPHCList()
      .subscribe((listU:IListUPHC[]) => {
        this.listUPHC = listU
        this.cdr.detectChanges();
      });

     
  }

  getClosedReasonList()
  {
    this.covidService.getCandidateClosedReason()
    .subscribe((r :ColsedReason[])=>{
      this.listClosedReason = r;
      this.cdr.detectChanges();
      }
    )
  }
}
