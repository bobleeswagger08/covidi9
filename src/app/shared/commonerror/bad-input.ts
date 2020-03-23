import { AppError } from './app-error';
import { IProblemDetails, IValidationProblemDetails } from 'app/model/problemdetails';

export class BadInput extends AppError {
    constructor(originalError: any) {
        //TODO: CAST THE OBJECT TO SPECIF TYPE AND SHOW DETAILED ERROR MESSAGE
        const badRequestError = originalError as IProblemDetails;
        super(originalError);
        console.log(originalError);
        if (badRequestError) {
            let errorMessage: string;
            if (badRequestError.title) {
                errorMessage = badRequestError.title;
                const validationError = originalError as IValidationProblemDetails;
                if (validationError) {
                    let errorList = validationError.errors;
                    for (let errorFieldName in errorList) {
                        errorMessage = errorMessage + "\n" + "Field :" + errorFieldName;
                        let fieldErrorList = errorList[errorFieldName];
                        //let fieldError = fieldErrorList[0];
                        for (let fieldError in fieldErrorList) {
                            errorMessage = errorMessage  +fieldErrorList[fieldError] + "\n";  //TODO: Add detailed error message here
                       }    
                    }
                }
            }
            else {
                errorMessage = "The server service is not available";
            }

            // if(validationError.errors)
            // {
            //     for()
            // }
            alert(errorMessage);
        }
        else {
            alert("Failed to save data");
        }
    }
}