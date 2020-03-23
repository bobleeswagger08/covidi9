import { Component, OnInit, forwardRef, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

export interface fieldFormValues {
      isEverContacted: string,
      isContactedOnCurrentDate: string,
      dateOfContacted: string,
      timeOfConected: string,
      isSymptomatic: string,
      isReferredForMedicalCare:string,
      reasonForNotContacted:string,
      isReleasedFromSurveillanc:string,
      commentByMOIC:string,
      fieldNote:string
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
  subscriptions: Subscription[] = [];

  get value(): fieldFormValues {
    return this.fieldInputForm.value;
  }

  set value(value: fieldFormValues) {
    this.fieldInputForm.setValue(value);
    this.onChange(value);
    this.onTouched();
  }
  constructor(private route: ActivatedRoute,private router:Router,private formBuilder: FormBuilder) {
    this.fieldInputForm = this.formBuilder.group({
      isEverContacted: [],
      isContactedOnCurrentDate: [],
      dateOfContacted: [],
      timeOfConected: [],
      isSymptomatic: [],
      isReferredForMedicalCare:[],
      reasonForNotContacted:[],
      isReleasedFromSurveillanc:[],
      commentByMOIC:[],
      fieldNote:[]
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
}
