import { Component, OnInit, forwardRef, OnDestroy, Input, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IFieldInput, IListNoContactReason } from '../model/candidate-input';
import { v4 as uuid } from 'uuid';
import { CovidI9Service } from '../services/covid-i9.service';
import { AppError } from 'app/shared/commonerror/app-error';
import { BadInput } from 'app/shared/commonerror/bad-input';
import { formatDate } from '@angular/common';

export interface fieldFormValues {
      id:string,
      isEverContacted: string,
    //  isContactedOnCurrentDate: string,
      dateOfContacted: string,
     // timeOfConected: string,
      reasonForUnableToTraceId:string,
      isSymptomatic: string,
      isReferredForMedicalCare:string,
      reasonForNotContacted:string,
      isReleasedFromSurveillanc:string,
      commentByMOIC:string,
    //  fieldNote:string
}
   
@Component({
  selector: 'app-field-input',
  templateUrl: './field-input.component.html',
  styleUrls: ['./field-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FieldInputComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => FieldInputComponent),
      multi: true
    }
  ]
})
export class FieldInputComponent implements OnInit,ControlValueAccessor, OnDestroy {
  fieldInputForm: FormGroup;
  fieldInputValue:IFieldInput;
  subscriptions: Subscription[] = [];
  listNoContactReason:IListNoContactReason;

  get isSymptomaticControl() {
    return this.fieldInputForm.controls.isSymptomatic;
  }

  get isReferredMControl() {
    return this.fieldInputForm.controls.isReferredForMedicalCare;
  }
  
  get isReleasedSControl() {
    return this.fieldInputForm.controls.isReleasedFromSurveillanc;
  }
  @Input('candidate-id') candidateId: string;

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
      dateOfContacted: [],
     // timeOfConected: [],
      reason:[],
      isSymptomatic: [],
      reasonForUnableToTraceId:[],
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
      this.value = value;
    }

    if (value === null) {
      this.fieldInputForm.reset();
    }
  } 

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  // communicate the inner form validation to the parent form
  validate(_: FormControl) {
    return this.fieldInputForm.valid ? null : { address: { valid: false } };
  }
  submitCandidateInputData(fieldFormValue){
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
      reasonForUnableToTraceId: fieldFormValue.reasonForUnableToTraceId,
      fieldNote: '',
      candidateId: this.candidateId,
      isActive: true,
      id: uuid()
    }
    console.log(this.fieldInputValue)
    this.covidService.saveFieldInput(this.fieldInputValue)
      .subscribe(court => {
        alert('Covid 19 Field Input saved successfully')
        //this.router.navigate(['administration/userlist']);
      }, (error: AppError) => {
        if (error instanceof BadInput) {
          alert('invalid data');
        }
        else throw error;
      });
  }
  getNoContactReason(){
      this.covidService.getNotPickedUpReason()
        .subscribe((listNCR:IListNoContactReason) => {
          this.listNoContactReason = listNCR
          this.cdr.detectChanges();
        });
  }
  onReasonForUnableToTraceChange(reasonForUnableToTraceValue){
    if(reasonForUnableToTraceValue)
    {
      this.isSymptomaticControl.disable();
      this.isReferredMControl.disable();
      this.isReleasedSControl.disable();
    }
    else
    {
      this.isSymptomaticControl.enable();
      if(this.isSymptomaticControl.value=="Y")
      {
        this.isReferredMControl.enable();
      }
      this.isReleasedSControl.enable();

    }

  }
  onSymptomaticChange(isSymptomatic){
    if(isSymptomatic=="Y")
    {
    this.isReferredMControl.enable();
    }
    else{
      this.isReferredMControl.disable();
    }
  }
}
