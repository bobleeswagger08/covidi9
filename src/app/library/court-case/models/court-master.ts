export interface ICourtMaster{
        code: string,
        description: string,
        isActive: true,
        note: string,
        id: string
}
export interface IAddress{
        id: string,
        referenceId: string,
        buildingName: string,
        houseNo: string,
        flatNo: string,
        streetName: string,
        pinCode: string,
        wardNo: string,
        countryId: string,
        stateId: string,
        isActive: true,
        addressType: number
}
export interface IAddressFormValues {
        id:string;
        email: string;
        phone: string;
        city: string;
        countryId: string;
        stateId: string;
        pinCode: string;
        houseno: string;
        landmark: string;
        streetName: string;
        isActive: boolean;
}