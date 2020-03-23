export interface ICourtMasterList{
    id: string,
    code: string,
    description: string,
    isActive: boolean,
    isInternal: boolean
}
export interface ICourtCaseMaster{
  courtId: string,
  holdingNo: string,
  arNo: string,
  note: string,
  isActive: boolean,
  id: string,
  caseNo: string,
  courtOrderId:string,
  initiationDate: string,
  referenceNo: string,
  petitioners: [
    {
      petitionerName: string
    }
  ],
  respondents: [
    {
      respondentName: string
    }
  ],
  caseType: string
}
export interface ICourtCaseMasterList{
    id: string,
    isActive: boolean,
    isInternal: boolean,
    caseNo: string,
    initiationDate: string,
    referenceNo: string,
    courtId: string,
    courtCode: string,
    court: string,
    holdingNo: string,
    arNo: string
}