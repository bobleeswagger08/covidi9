export interface ICandidateInput {
  source: string,
  name: string,
  flightNo: string,
  candidateStatusId: number,
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
  // commentByMOIC: string,
  fieldData?: IFieldData[],
  id: string,
  serialNo: string

}
export interface IFieldData {
  isEverContacted: string,
  // isContactedOnCurrentDate: string,
  dateOfContacted?: string,
  // timeOfConected: string,
  isSymptomatic?: string,
  isReferredForMedicalCare?: string,
  reasonForNotContacted?: string,
  isReleasedFromSurveillanc?: string,
  commentByMOIC?: string,
  //fieldNote: string
}
export interface IListWard {
  wardNo: string
}
export interface IListUPHC {
  uphc: string
}
export interface IListCandidate {
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
export interface ICandidateFilter {
  isEverContacted: string,
  words: [
  ],
  upscs: [
  ],
  names: [
  ],
  selectedStatuses: [
  ]
}
export interface IFieldInput {
  isEverContacted: string,
  isContactedOnCurrentDate: string,
  dateOfContacted: string,
  timeOfConected: string,
  isSymptomatic: string,
  isReferredForMedicalCare: string,
  reasonForNotContacted: string,
  isReleasedFromSurveillanc: string,
  streetName: string,
  commentByMOIC: string,
  reasonForUnableToTraceId: number,
  fieldNote: string,
  id: string,
  candidateId: string,
  isActive: true
}
export interface IListNoContactReason {
  id: string,
  category: string,
  description: string
}
export interface SearchCriteria {
  isEverContacted?: string | undefined;
  wards?: SelectedWord[] | undefined;
  uphcs?: SelectedUPHC[] | undefined;
  selectedStatuses?: SelectedStatus[] | undefined;
}

export interface CandidateSearchFilter extends SearchCriteria {
  inputDate?: Date | undefined;
}

export interface SelectedWord {
  wardNo?: string | undefined;
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
export interface fieldFormValues {
  id: string,
  isEverContacted: string,
  //  isContactedOnCurrentDate: string,
  dateOfContacted: string,
  // timeOfConected: string,
  reasonForUnableToTraceId: string,
  isSymptomatic: string,
  isReferredForMedicalCare: string,
  reasonForNotContacted: string,
  isReleasedFromSurveillanc: string,
  commentByMOIC: string
  //  fieldNote:string
}

export interface ColsedReason {
  id: number;
  category: string;
  description: string;
}

export interface CandidateCoreData {
  id?: string;
  referenceNo?: number;
  source?: string | undefined;
  name?: string | undefined;
  flightNo?: string | undefined;
  countryVisited?: string | undefined;
  dob?: string | undefined;
  age?: string | undefined;
  sex?: string | undefined;
  flightNumber?: string | undefined;
  arivalDate?: string | undefined;
  mobileNo?: string | undefined;
  address?: string | undefined;
  finalDestination?: string | undefined;
  block?: string | undefined;
  state?: string | undefined;
}

export interface CandidateFieldDataDefiinition {
  isEverContacted?: string | undefined;
  isContactedOnCurrentDate?: string | undefined;
  dateOfContacted?: Date | undefined;
  timeOfConected?: string | undefined;
  isSymptomatic?: string | undefined;
  isReferredForMedicalCare?: string | undefined;
  reasonForNotContacted?: string | undefined;
  isReleasedFromSurveillanc?: string | undefined;
  streetName?: string | undefined;
  commentByMOIC?: string | undefined;
  reasonForUnableToTraceId?: number | undefined;
  fieldNote?: string | undefined;
}

export interface CandidateDefinition extends CandidateCoreData {

  note?: string | undefined;
  wardNo?: string | undefined;
  uphc?: string | undefined;
  isActive?: boolean;
  candidateStatusId?: number | undefined;
  fieldData?: CandidateFieldDataDefiinition[] | undefined;
}

export interface CandidateData extends CandidateDefinition {
  id?: string;
  serialNo?: string | undefined;
}

export interface CandidateDateWiseReport extends CandidateData {
  id?: string;
  serialNo?: string | undefined;
  isEverContacted?: string | undefined;
  isContactedOnCurrentDate?: string | undefined;
  dateOfContacted?: Date | undefined;
  isSymptomatic?: string | undefined;
  isReferredForMedicalCare?: string | undefined;
  reasonForUnableToTrace?: string | undefined;
  isReleasedFromSurveillance?: string | undefined;
  wardNo?: string | undefined;
  uphc?: string | undefined;
  commentByMOIC?: string | undefined;
  statusDate?: Date | undefined;
  candidateReason?: string | undefined;
  dateOfArival?: Date | undefined;
  status?: string | undefined;
  category?: string | undefined;
}

export interface CandidateReportFilter {
  reportStartDate?: Date;
  reportEndDate?: Date;
  sourceVal?: string | undefined;
}


export interface UphcOffice {
  organizationId?: string | undefined;
  organizationCode?: string | undefined;
  organizationName?: string | undefined;
  uphc?: string | undefined;
  uphcOrderBy?: string | undefined;
}