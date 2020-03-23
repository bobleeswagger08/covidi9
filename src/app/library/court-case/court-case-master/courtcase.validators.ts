import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
export class CCMasterValidators{
 // static cannotContainSpace: ValidatorFn;
   static cannotContainSpace(control:AbstractControl) : ValidationErrors | null {
            if((control.value as string).indexOf('') >= 0 )
                return {cannotContainSpace: true};

            return null;
    }
   
}