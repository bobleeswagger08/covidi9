import { Component, OnInit, Output, EventEmitter, forwardRef, OnDestroy, Input } from '@angular/core';
import { FormGroup, Validators, FormControl, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormBuilder, ControlValueAccessor } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { AddressService } from '../../../services/shared/address.service';
import { ICountry, ISates } from '../../../model/countries.sates';
import { AppError } from 'app/shared/commonerror/app-error';
import { BadInput } from 'app/shared/commonerror/bad-input';
import { Subscription } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { IAddressLabel } from 'app/library/court-case/models/lawyer-master';

export interface AddressFormValues {
  id:string;
  email: string;
  phone: string;
  city: string;
  countryId: string;
  stateId: string;
  pinCode: string;
  houseno: string;
  landmark: string;
  streetName: string;
  isActive: boolean;
}

@Component({
  selector: 'app-adress-editor',
  templateUrl: './adress-editor.component.html',
  styleUrls: ['./adress-editor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AdressEditorComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AdressEditorComponent),
      multi: true
    }
  ]
})
export class AdressEditorComponent implements OnInit,ControlValueAccessor, OnDestroy {
  listCountries:ICountry[];
  listStates:ISates[];
  //formData = {}
  //console = console;
  addressForm: FormGroup;
  //form: FormGroup;
  subscriptions: Subscription[] = [];
  @Input('address-type') addressType: string;

  get value(): AddressFormValues {
    return this.addressForm.value;
  }

  set value(value: AddressFormValues) {
    this.addressForm.setValue(value);
    this.onChange(value);
    this.onTouched();
  }
  get country(){return this.addressForm.get('countryId')}
  get state(){return this.addressForm.get('stateId')}
  // get emailControl() {
  //   return this.addressForm.controls.email;
  // }
  // get phoneControl() {
  //   return this.addressForm.controls.phone;
  // }
  // get pinCodeControl() {
  //   return this.addressForm.controls.pinCode;
  // }

  //@Output ('on-address') whenAddressRequested: EventEmitter<any> = new EventEmitter();
  constructor(private service : AddressService,private formBuilder: FormBuilder) {
    this.addressForm = this.formBuilder.group({
      id: [uuid()],
      email: ['', [Validators.email]],
      phone: ['', [CustomValidators.phone('IN')]],
      city: [],
      countryId: [],
      stateId: [],
      pinCode: ['', [Validators.minLength(2),Validators.maxLength(8),
       Validators.required]],
      houseno: [],
      landmark: [],
      streetName: [],
      isActive:[true]
    });
    this.subscriptions.push(
      // any time the inner form changes update the parent of any change
      this.addressForm.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );
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
      this.addressForm.reset();
    }
  } 

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  // communicate the inner form validation to the parent form
  validate(_: FormControl) {
    return this.addressForm.valid ? null : { address: { valid: false } };
  }

  getCountries(){
    this.service.getCountries()
    .subscribe(countries => this.listCountries = countries);
  }
  
  getStates(){
    this.service.getStates()
    .subscribe(states => this.listStates = states);
  }

  OnCountriesChange($event){
    if($event.value=="IN"){
      this.addressForm.get('stateId').enable();
    }
    else{
      this.addressForm.get('stateId').disable();
      this.addressForm.get('stateId').setValue(undefined);
    }
  }

  ngOnInit() {
    this.getCountries();
    this.getStates();
   this.state.disabled;
   //let i = this.addressType;
  }

}
