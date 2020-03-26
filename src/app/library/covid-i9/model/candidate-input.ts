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
        commentByMOIC: string,
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
      //  commentByMOIC: string,
        fieldNote: string
}
export interface IListWard 
{
  wordNo: string
}
export interface IListUPHC
{
  uphc: string
}
export interface IListCandidate
{
  id: string,
  serialNo: string,
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
  isActive: string,
  fieldData: []
}
export interface CandidateSearchFilter {
  isEverContacted?: string | undefined;
  words?: SelectedWord[] | undefined;
  upscs?: SelectedUPHC[] | undefined;
  selectedStatuses?: SelectedStatus[] | undefined;
  inputDate?: Date;
}

export interface SelectedWord {
  wordNo?: string | undefined;
}

export interface SelectedUPHC {
  uphc?: string | undefined;
}

export interface SelectedStatus {
  statusId?: number;
}
export interface CandidateListItem {
  id?: string;
  referenceNo?: number;
  source?: string | undefined;
  serialNo?: string | undefined;
  arivalDate?: string | undefined;
  name?: string | undefined;
  mobileNo?: string | undefined;
  uphc?: string | undefined;
  wardNo?: string | undefined;
  lastContactDate?: Date | undefined;
  address?: string | undefined;
}
