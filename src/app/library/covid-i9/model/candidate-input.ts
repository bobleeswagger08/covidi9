export interface ICandidateInput{
        source: string,
        name: string,
        flightNo: string,
        countryVisited: string,
        dob: string,
        age: string,
        sex: string,
        flightNumber: string,
        arivalDate: string,
        mobileNo: string,
        address: string,
        finalDestination: string,
        block: string,
        state: string,
        note: string,
        wardNo: string,
        uphc: string,
        isActive: true,
        fieldData: IFieldData[],
        id: string,
        serialNo: string
      
}
export interface IFieldData{
        isEverContacted: string,
        isContactedOnCurrentDate: string,
        dateOfContacted: string,
        timeOfConected: string,
        isSymptomatic: string,
        isReferredForMedicalCare: string,
        reasonForNotContacted: string,
        isReleasedFromSurveillanc: string,
        commentByMOIC: string,
        fieldNote: string
}