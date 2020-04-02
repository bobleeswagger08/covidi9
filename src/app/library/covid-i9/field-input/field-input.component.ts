import { Component, OnInit, forwardRef, OnDestroy, Input, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, ControlValueAccessor, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IFieldInput, IListNoContactReason, fieldFormValues } from '../model/candidate-input';
import { v4 as uuid } from 'uuid';
import { CovidI9Service } from '../services/covid-i9.service';
import { AppError } from 'app/shared/commonerror/app-error';
import { BadInput } from 'app/shared/commonerror/bad-input';
import { formatDate } from '@angular/common';


   
@Component({
  selector: 'app-field-input',
  templateUrl: './field-input.component.html',
  styleUrls: ['./field-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FieldInputComponent),
      multi: true
    }
    // ,
    // {
    //   provide: NG_VALIDATORS,
    //   useExisting: forwardRef(() => FieldInputComponent),
    //   multi: true
    // }
  ]
})
export class FieldInputComponent implements OnInit,ControlValueAccessor, OnDestroy {
  fieldInputForm: FormGroup;
  fieldInputValue:IFieldInput;
  subscriptions: Subscription[] = [];
  listNoContactReason:IListNoContactReason[];
  lastStatusDate:string;
  NoContactReasonHierarchy: NoContactCategory[];

  getNoContactReasonHierarchy(): NoContactCategory[]
  {
    let hierarchyList : NoContactCategory[] =[];
    if(this.listNoContactReason)
    {
      for(let reason of this.listNoContactReason)
      {
          let hierarchyItem = hierarchyList.find(h=> h.categoryName === reason.category);
          if(!hierarchyItem)
          {
            hierarchyItem = {categoryName: reason.category,reason : []};
            hierarchyList.push(hierarchyItem);
          }

          hierarchyItem.reason.push(reason);
        
      }
    }
    this.NoContactReasonHierarchy = hierarchyList;
    return hierarchyList;
  }

  get isSymptomaticControl() {
    return this.fieldInputForm.controls.isSymptomatic;
  }

  get isReferredMControl() {
    return this.fieldInputForm.controls.isReferredForMedicalCare;
  }
  
  get isReleasedSControl() {
    return this.fieldInputForm.controls.isReleasedFromSurveillanc;
  }
  get isEvrContactedControl() {
    return this.fieldInputForm.controls.isEverContacted;
  }
  @Input('candidate-id') candidateId: string;
  @Input('button-visible') isButtonVisible: boolean;
  @Input('max-date') maxContactDate: Date;
  get value(): fieldFormValues {
    return this.fieldInputForm.value;
  }

  set value(value: fieldFormValues) {
    this.fieldInputForm.setValue(value);
    this.onChange(value);
    this.onTouched();
  }
  constructor(private route: ActivatedRoute,private router:Router,private formBuilder: FormBuilder,private covidService:CovidI9Service,
    private cdr: ChangeDetectorRef) {
    this.fieldInputForm = this.formBuilder.group({
      id: [uuid()],
      isEverContacted: [],
     // isContactedOnCurrentDate: [],
      dateOfContacted: ['',Validators.required],
     // timeOfConected: [],
      //reason:[],
      isSymptomatic: ['',Validators.required],
      reasonForUnableToTraceId:[0],
      isReferredForMedicalCare:[],
      reasonForNotContacted:[],
      isReleasedFromSurveillanc:[],
      commentByMOIC:[],
      //fieldNote:[]
    });
    this.subscriptions.push(
      // any time the inner form changes update the parent of any change
      this.fieldInputForm.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );
   }

  ngOnInit() {
    this.getNoContactReason();
    this.isReferredMControl.disable();
  }
  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  onChange: any = () => {};
  onTouched: any = () => {};

  registerOnChange(fn) {
    this.onChange = fn;
  }

  writeValue(value) {
    if (value) { 
      this.lastStatusDate = value.dateOfContacted;
     
      this.isEvrContactedControl.disable();
     

      if(value.isSymptomatic=='Y'){
        this.isReferredMControl.enable();
      }
      this.value = value;
      this.isEvrContactedControl.setValue('Y');
      this.fieldInputForm.controls.dateOfContacted.setValue('');
    }

    if (value === null) {
      this.fieldInputForm.reset();
      this.isEvrContactedControl.disable();
      this.isEvrContactedControl.setValue('N')
    }
    else
    {
      this.isEvrContactedControl.setValue("Y");
    }
  } 

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  // communicate the inner form validation to the parent form
  // validate(_: FormControl) {
  //   return this.fieldInputForm.valid ? null : { address: { valid: false } };
  // }

  submitCandidateInputData(){
    let fieldFormValue = this.fieldInputForm.getRawValue();
    let unableToTraceReason : any = null;
    if(fieldFormValue.reasonForUnableToTraceId)
    {
      unableToTraceReason= fieldFormValue.reasonForUnableToTraceId;
    }
    this.fieldInputValue={
      isEverContacted: fieldFormValue.isEverContacted,
      isContactedOnCurrentDate: fieldFormValue.isContactedOnCurrentDate,
     // flightNo: fieldFormValue.flightNo,
      dateOfContacted: formatDate(fieldFormValue.dateOfContacted,'yyyy-MM-dd', 'en-US'),
      timeOfConected: '',
      isSymptomatic: fieldFormValue.isSymptomatic,
      isReferredForMedicalCare: fieldFormValue.isReferredForMedicalCare,
      reasonForNotContacted: fieldFormValue.reasonForNotContacted,
      isReleasedFromSurveillanc: fieldFormValue.isReleasedFromSurveillanc,
      streetName: '',
      commentByMOIC: fieldFormValue.commentByMOIC,
      reasonForUnableToTraceId:unableToTraceReason, // fieldFormValue.reasonForUnableToTraceId,
      fieldNote: '',
      candidateId: this.candidateId,
      isActive: true,
      id: uuid()
    }
    console.log(this.fieldInputValue)
    this.covidService.saveFieldInput(this.fieldInputValue)
      .subscribe(court => {
        alert('Field Input data saved successfully');
        this.fieldInputForm.reset();
        this.router.navigate(['covidi9/candidatelist']);
      }, (error: AppError) => {
        if (error instanceof BadInput) {
          alert('invalid data');
        }
        alert(error.originalError);
      });
     
  }
  getNoContactReason(){
      this.covidService.getNotPickedUpReason()
        .subscribe((listNCR:IListNoContactReason[]) => {
          this.listNoContactReason = listNCR;
          this.getNoContactReasonHierarchy();
          this.cdr.detectChanges();
        });
  }
  onReasonForUnableToTraceChange(reasonForUnableToTraceValue){
    if(reasonForUnableToTraceValue)
    {
      this.isSymptomaticControl.clearValidators();

      this.isSymptomaticControl.disable();
      this.isReferredMControl.disable();
      this.isReleasedSControl.disable();

      this.isSymptomaticControl.setValue('');
      this.isReferredMControl.setValue('');
      this.isReleasedSControl.setValue('');
    }
    else
    {
      this.isSymptomaticControl.enable();
      this.isSymptomaticControl.setValidators(Validators.required);
      if(this.isSymptomaticControl.value=="Y")
      {
        this.isReferredMControl.enable();
        this.isReferredMControl.setValidators(Validators.required);
      }
      this.isReleasedSControl.enable();
    }

  }
  onSymptomaticChange(isSymptomatic){
    if(isSymptomatic=="Y")
    {
    this.isReferredMControl.enable();
    this.isReleasedSControl.setValue('');
    this.isReleasedSControl.disable();
    }
    else{
      this.isReferredMControl.disable();
      this.isReferredMControl.setValue('');
      this.isReleasedSControl.setValue('');
      this.isReleasedSControl.disable();
    }
  }
  onReferedForMdclCChange(isMedicalCare){
    if(isMedicalCare=="Y")
    {
      this.isReleasedSControl.enable();
    }
    else{
      this.isReleasedSControl.disable();
      this.isReleasedSControl.setValue('');
    }
  }
}

export interface NoContactCategory
{
  categoryName : string;
  reason? : IListNoContactReason[];
}