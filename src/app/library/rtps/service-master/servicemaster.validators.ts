import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
const NUMBER_REGEXP = /^\d+$/;
export class ServiceMasterValidators{
 // static cannotContainSpace: ValidatorFn;
   static cannotContainSpace(control:AbstractControl) : ValidationErrors | null {
            if((control.value as string).indexOf(' ') >= 0 )
                return {cannotContainSpace: true};

            return null;
    }
    static onlyNumber(control:AbstractControl) : ValidationErrors | null {
        return NUMBER_REGEXP.test(control.value) ? null : {'onlyNumber': true};
    }
   
}