export class NotifyMessage {
   nId: number;
   nName: string;
   nSummary: string;
   nType: number;
   nReferences: string;
   nDetails: string;
   nCreatedOn: string;
   nExpiresOn : string;
   nUser: {
     uId: number;
     uName : string
    };
   uRole: {
     rId: number;
     rName: string
    }
  }
  export interface IMessageForUser{
    id:string;
    type:number;
    raisedOn:number;
    expiredOn:number;
    title:string;
    messageText:string;
    messageRecipients:IMessageRecipient;
    referenceInfo:IMessageReferenceInfo;
  }
  interface IMessageRecipient{
    userId:string;
  }
  interface IMessageReferenceInfo{
    functionalityTypeId:number;
    referenceId:string;
    refernceDocumentNo:string;
    refernceDocumentDate:string;
  }