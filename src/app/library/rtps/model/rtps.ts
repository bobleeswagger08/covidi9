export interface IWorkingDayUnit {
    id: number;
    name: string;
  }
  export interface IRequestStatus {
    id: number;
    name: string;
  }
  export interface IOrderBy {
    id: number;
    name: string;
  }
  export interface IDepartmentValues {
    id: string;
    code: string;
    description: string;
   }
   export interface IServiceMaster {
    id: string;
    code: string;
    department: string;
    description: string;
    departmentId:string;
   }
   export interface IServiceRequest {
    id: string,
    serviceId: string,
    serviceRequestDate: string,
    hmcApplicationReferenceNo: string,
    applicantName: string,
    buildingName: string,
    houseNo: string,
    flatNo: string,
    streetName: string,
    pinCode: string,
    contactNo: string,
    eMailId: string,
    isAutoPosted: boolean,
    isProvisional: boolean,
    isActive: boolean,
    officeId: string,
    note: string
   }
   export interface IAuthorisedOfficer{
    id: string,
    code: string,
    description: string,
    isActive: boolean,
    isInternal: boolean,
    roleCategory: number
  }
  export interface IDesignatedOfficer{
    id: string,
    code: string,
    description: string
  }
  export interface IServiceRequestReport {
    referenceNo: string,
    status: string,
    statusId: number,
    id: string,
    serviceId: string,
    address:string,
    serviceCode: string,
    service:string,
    serviceRequestDate: string,
    hmcApplicationReferenceNo: string,
    applicantName: string,
    buildingName: string,
    houseNo: string,
    flatNo: string,
    streetName: string,
    pinCode: string,
    contactNo: string,
    eMailId: string,
    isAutoPosted: boolean,
    isProvisional: boolean,
    isActive: boolean,
    officeId: string,
    note: string,
    actualUserId: string,
    dueDate: Date,
   }