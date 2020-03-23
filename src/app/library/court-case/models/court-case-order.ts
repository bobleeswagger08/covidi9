export interface ICourtCaseOrder{
   orderReferenceNo: string,
   orderReceiveDate: string,
   orderDetails: string,
   note: string,
   isIncoming: boolean,
   sendReceiverName:string,
   orderTypeId:number,
   isActive: true,
   id: string,
   courtCaseId: string,
   orderDate: string
}
export interface ICourtCaseOrderList{
   id: string,
   courtCaseId: string,
   courtCaseCode: string,
   courtCase: string,
   courtId: string,
   courtCode: string,
   court: string,
   orderDate: string,
   orderReceiveDate: string,
   orderReferenceNo:string,
   isClosedOrder: boolean,
   isInternal: boolean,
   isActive: boolean
 }
 export interface ICCOrderType{
    id:number,
    description:string;
 }
 export interface IInOutDependentValue{
   orderRcvSntDate:string,
   rcvSntName:string
 }