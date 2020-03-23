import { Component, OnInit, forwardRef, OnDestroy } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, FormGroup, FormBuilder, Validators, FormControl, ControlValueAccessor } from '@angular/forms';
import { Subscription } from 'rxjs';

export interface CodeFormValues {
  code: string;
}
@Component({
  selector: 'app-code',
  templateUrl: './code.component.html',
  styleUrls: ['./code.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CodeComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CodeComponent),
      multi: true
    }
  ]
})
export class CodeComponent implements OnInit, ControlValueAccessor, OnDestroy {
  codeForm: FormGroup;

  subscriptions: Subscription[] = [];

  get value(): CodeFormValues {
    return this.codeForm.value;
  }

  set value(value: CodeFormValues) {
    this.codeForm.setValue(value);
    this.onChange(value);
    this.onTouched();
  }
  constructor(private formBuilder: FormBuilder) { 
    this.codeForm = this.formBuilder.group({
      code: ['', [Validators.minLength(2),Validators.maxLength(4),
        Validators.required]],
    });
    this.subscriptions.push(
      // any time the inner form changes update the parent of any change
      this.codeForm.valueChanges.subscribe(value => {
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
      this.codeForm.reset();
    }
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  // communicate the inner form validation to the parent form
  validate(_: FormControl) {
    return this.codeForm.valid ? null : { address: { valid: false } };
  }
  ngOnInit() {
  }

}
