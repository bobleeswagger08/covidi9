import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
const PINCODE_REGEXP = /^\d{6}$/;
const CONTACT_REGEXP = /^\d{10}$/;
export class ServiceRequestValidators{
 // static cannotContainSpace: ValidatorFn;
    static pinCode(control:AbstractControl) : ValidationErrors | null {
        return PINCODE_REGEXP.test(control.value) ? null : {'pinCode': true};
    }
    static contactNumber(control:AbstractControl) : ValidationErrors | null {
        return CONTACT_REGEXP.test(control.value) ? null : {'contactNumber': true};
    }
   
}