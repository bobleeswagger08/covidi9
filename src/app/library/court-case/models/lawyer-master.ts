export interface ILawyerMaster
{
    code: string,
    name: string,
    isActive: true,
    note: string,
    contactNo: string,
    alternateContactNo: string,
    eMailId: string,
    courts: [
      {
        courtId: string,
        effectiveFrom: string
      }
    ],
    id: string
  }
  export interface IAddressLabel{
    office:string,
    home:string
  }