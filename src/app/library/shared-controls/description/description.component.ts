import { Component, OnInit, forwardRef, OnDestroy, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, FormGroup, FormBuilder, Validators, ControlValueAccessor, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
export interface DescriptionFormValues {
  description: string;
}
@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DescriptionComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DescriptionComponent),
      multi: true
    }
  ]
})
export class DescriptionComponent implements OnInit, ControlValueAccessor, OnDestroy {
  descriptionForm: FormGroup;
  @Input('desc-place-holder') descPlaceHolder: string;
  subscriptions: Subscription[] = [];

  get value(): DescriptionFormValues {
    return this.descriptionForm.value;
  }

  set value(value: DescriptionFormValues) {
    this.descriptionForm.setValue(value);
    this.onChange(value);
    this.onTouched();
  }
  constructor(private formBuilder: FormBuilder) { 
    this.descriptionForm = this.formBuilder.group({
      description: ['', [Validators.required]],
    });
    this.subscriptions.push(
      // any time the inner form changes update the parent of any change
      this.descriptionForm.valueChanges.subscribe(value => {
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
      this.descriptionForm.reset();
    }
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  // communicate the inner form validation to the parent form
  validate(_: FormControl) {
    return this.descriptionForm.valid ? null : { address: { valid: false } };
  }

  ngOnInit() {
  //  let i =this.descPlaceHolder;
  }

}
