export class MasterListItem {
    Id:string;
    Code:string;
    Description:string;
    IsActive:boolean;
    IsInternal:boolean;

    constructor(id?:string, code?:string, description?:string, isActive?:boolean)
    {
        this.Id=id;
        this.Code=code;
        this.Description=description;
        this.IsActive= isActive;

    }
}


export interface OrganizationUnitHierarchicalListItem  {
    id:string;
    code:string;
    description:string;
    isActive:boolean;
    isInternal:boolean;
    /** Reference of parent unit */
    parentUnit?: OrganizationUnitHierarchicalListItem | undefined;
    /** List of direct child organization units */
    childUnits?: OrganizationUnitHierarchicalListItem[] | undefined;
}