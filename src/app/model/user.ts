import { MasterListItem, OrganizationUnitHierarchicalListItem } from "app/model/master-list-item";

export interface SignInUser {
    username : string,
    password: string
}

export enum LogInStatus {
  None = 0,
  Success = 1,
  NotFound = 2,
  IncorrectPassword = 4,
  Locked = 8,
  Blocked = 16,
  Inactive = 32,
}
export interface LoginResponse {
  status?: LogInStatus;
  errorMessage?: string | undefined;
  userSession?: LoggedInUser | undefined;
}
// export interface LogInUser{
//     id: string,
//     createSessionId: string,
//     updateSessionId: string,
//     code: string,
//     userId: string,
//     userFirstName: string,
//     userLastName: string,
//     userMobile: string,
//     userEmail: string,
//     password: string,
//     passwordHint:string,
//     isActive: boolean,
//     isLocked: boolean,
//     isBlocked: boolean,
//     isExternal: boolean
//   }
  export interface IListUser{
    id: string,
    code: string,
    userId: string,
    userFirstName: string,
    userLastName: string,
    userMobile: string,
    userEmail: string,
    isActive: boolean,
    isLocked: boolean,
    isBlocked: boolean,
    isExternal: boolean
  }

  
export interface LoggedInUser {
  id: string;
  code?: string | undefined;
  userId?: string | undefined;
  userFirstName?: string | undefined;
  userLastName?: string | undefined;
  userMobile?: string | undefined;
  userEmail?: string | undefined;
  userSession?: string;
  securityToken?: string | undefined;
  userRights?: UserRights | undefined;
  
}

export interface UserRights {
  functionalityAccessConfiguration?: FunctionalityAccessConfiguration[] | undefined;
  offices?: MasterListItem[] | undefined;
  roles?: MasterListItem[] | undefined;
  officeHierarchy?:OrganizationUnitHierarchicalListItem[]|undefined;
}

export interface FunctionalityAccessConfiguration {
  functionalityId?: number;
  userAccessId?: number;
  accessPermission?: string | undefined;
  accessJson?: string | undefined;
  roleId?: string;
  organizationUnitUUId?: string;
  accessType?: AccessRightType;
}

export enum AccessRightType {
  NotDefined = 0,
  Yes = 1,
  No = 2,
  Custom = 3,
}
