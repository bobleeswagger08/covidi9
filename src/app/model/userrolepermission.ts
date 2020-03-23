
export interface UserAccessConfiguration {
    accessId : number,
    accessDataTypeId: number,
    serialNumber?: number,
    description?: string,
    defaultValue?: string,
    adminJson: string,
    defaultJson: string,
    dependentAccess: ModuleAccessGroup[]
}
export interface ModuleAccessGroup
{
    name:string,
    accessConfiguration?: UserAccessConfiguration[]
}
export interface ApplicationModule {
  treeIdentifier: number;
  level: number;
  id: number;
  code: string;
  description: string;
  defaultParentModule: ApplicationModule;
  subModules: ApplicationModule[];
}
export interface IModuleAccessConfiguration {
  accessConfiguration : FunctionalityAccessConfiguration[],
  listOfValuesTypes : ListOfValuesAccessDataType[]
}
export interface ListOfValuesAccessDataType extends UserAccessType {
  /** List of allowed values */
  listItems?: AccessRightListItem[] | undefined;
}
export interface AccessRightListItem {
  /** Description of the right, as will be displayed on screen */
  description?: string | undefined;
  /** The internal value for the item */
  value?: string | undefined;
}

export interface FunctionalityAccessConfiguration {
  /** Unique module Id of the configuration */
  moduleId: number,
  accessGroups: ModuleAccessGroup[]
}
export interface UserAccessType {
  moduleId: number,
  functionalityId: number,
  userAccessTypeId: number,
  dataType: AccessRightDataType,
}
export enum AccessRightDataType {
  None = 0,
  Boolean = 1,
  Decimal = 2,
  ValueFromList = 3,
  NumericalRange = 4,
}
 

export interface IUserAccessConfiguration {
  accessId: number;
  accessDataTypeId: number;
  /** Sets/gets preferred order of appearance of the item in access configuration screen */
  serialNumber?: number | undefined;
  /** Access description */
  description?: string | undefined;
  /** Default value of the access */
  defaultValue?: string | undefined;
  /** Json configuration for Superuser/Admin, if present */
  adminJson?: string | undefined;
  /** Default Json configuration for users, if present */
  defaultJson?: string | undefined;
  dependentAccess?: ModuleAccessGroup[] | undefined;
}
export interface IAccessRightListItem {
  /** Description of the right, as will be displayed on screen */
  description?: string | undefined;
  /** The internal value for the item */
  value?: string | undefined;
}
export interface IListOfValuesAccessDataType extends IUserAccessType {
  /** List of allowed values */
  listItems?: AccessRightListItem[] | undefined;
}
export interface IUserAccessType {
  moduleId: number;
  functionalityId: number;
  userAccessTypeId: number;
  dataType: AccessRightDataType;
}
/**Branch component model */
export interface IFunctionalityAccessConfiguration {
  /** Unique module Id of the configuration */
  moduleId: number;
  accessGroups?: ModuleAccessGroup[] | undefined;
}
