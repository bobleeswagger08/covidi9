export interface IListLawyer{
    id:string,
    code:string,
    description:string,
    isActive:boolean,
    isInternal:boolean
}
export interface IListLawyerPanel{
    lawyer: any,
    panelInclusionDate: string,
    panelExclusionDate: string,
    isActive: boolean,
    isInternal: boolean,
    mode:number
  }
  