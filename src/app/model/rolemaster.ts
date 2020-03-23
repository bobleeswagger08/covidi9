export interface IRoleMaster {
    id: string;
    code: string;
    description: string;
    isActive: boolean,
    isInternal: boolean,
    roleCategory: number
   }
   export interface ICategories {
    id: string;
    code: string;
    description: string;
   }