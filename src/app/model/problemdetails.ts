export interface IProblemDetails {
    type: string | undefined;
    title?: string | undefined;
    status?: number | undefined;
    detail?: string | undefined;
    instance?: string | undefined;
    extensions?: { [key: string]: any; } | undefined;
   
}


export interface IValidationProblemDetails extends IProblemDetails {
    errors?: { [key: string]: string[]; } | undefined;
}