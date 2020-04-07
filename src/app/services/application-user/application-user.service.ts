import { Injectable, Inject } from '@angular/core';
import { MasterListItem, OrganizationUnitHierarchicalListItem } from 'app/model/master-list-item';
import { LoggedInUser, AccessRightType, IDataCollectorConfiguration } from 'app/model/user';

@Injectable({
  providedIn: 'root'
})
export class ApplicationUserService {

  private _loggedInUser: LoggedInUser;
  private _backlogPeriod:IDataCollectorConfiguration;
  // public officeHierarchy: OrganizationUnitHierarchicalListItem[];
  private officeHierarchyHelper: OrganizationUnitHierarchyHelper;
  constructor() { }



  get loggedInUser() {
    if (!this._loggedInUser) {
      if (localStorage.getItem('loginuser')) {
        this._loggedInUser = JSON.parse(localStorage.getItem('loginuser'));
      }
    }
    return this._loggedInUser;
  }
  get backLogPeriod() {
    if (!this._backlogPeriod) {
      if (localStorage.getItem('bp')) {
        this._backlogPeriod = JSON.parse(localStorage.getItem('bp'));
      }
    }
    return this._backlogPeriod;
  }

  get officeHierarchy(): OrganizationUnitHierarchicalListItem[] {
    let officeList: OrganizationUnitHierarchicalListItem[] = [];
    if (this.loggedInUser && this.loggedInUser.userRights) {
      officeList = this.loggedInUser.userRights.officeHierarchy;
    }

    return officeList;
  }
  get isSessionActive():boolean{
    if(this.loggedInUser){
      return true;
    }
    return false;
  }

  get securityToken():string{
    if(this.loggedInUser){
      return this.loggedInUser.securityToken;
    }
    return null;
  }
  public registerLoggedInUser(userSession: LoggedInUser) {
    this._loggedInUser = userSession;
    // this.officeHierarchy = this._loggedInUser.userRights.officeHierarchy;
    localStorage.setItem('loginuser', JSON.stringify(userSession));
    //localStorage.setItem('securityToken', userSession.securityToken);
    this.officeHierarchyHelper = new OrganizationUnitHierarchyHelper(this.officeHierarchy);
  }
  public registerBacklogPeriod(BackLogPeriod: IDataCollectorConfiguration) {
    this._backlogPeriod = BackLogPeriod;
    localStorage.setItem('bp', JSON.stringify(BackLogPeriod));
  }
  public resetSession() {
    this._loggedInUser = null;
    // this.officeHierarchy = this._loggedInUser.userRights.officeHierarchy;
    localStorage.removeItem('loginuser');
    //localStorage.setItem('securityToken', userSession.securityToken);
  }

  public logout() {
    this._loggedInUser = null;
    localStorage.removeItem('loginuser');
   // localStorage.removeItem('securityToken');
  }


}

class OrganizationUnitHierarchyHelper {
  constructor(private organizationUnitHierarchy: OrganizationUnitHierarchicalListItem[]) {

  }

  getOfficeList(officeId?: string): MasterListItem[] {
    let mainOfficeId: string;
    if (officeId) {
      const baseOffice = OrganizationUnitHierarchyHelper.getOffice(officeId, this.organizationUnitHierarchy);
      if (!baseOffice) {
        return null;
      }
    }


  }

  static getOffice(officeId: string, officeList: OrganizationUnitHierarchicalListItem[]): OrganizationUnitHierarchicalListItem {
    let targetOffice: OrganizationUnitHierarchicalListItem;

    if (officeList) {
      for (let office of officeList) {
        if (office.id === officeId) {
          targetOffice = office;
          break;
        }
        else {
          if (office.childUnits) {
            targetOffice = this.getOffice(officeId, office.childUnits);
            if (targetOffice) {
              break;
            }
          }
        }
      }
    }

    return targetOffice;
  }


  static getFlatSubOfficesList(officeList: OrganizationUnitHierarchicalListItem[], mainOffice?: OrganizationUnitHierarchicalListItem): OrganizationUnitHierarchicalListItem[] {
    let targetOffices: OrganizationUnitHierarchicalListItem[] = [];
    let sourceOffices: OrganizationUnitHierarchicalListItem[];
    if (mainOffice && mainOffice.childUnits) {
      sourceOffices = mainOffice.childUnits;
    }
    else {
      sourceOffices = officeList;
    }
    if (sourceOffices) {
      for (let office of officeList) {
        targetOffices.push(office);
        if (office.childUnits) {
          const subOffices = this.getFlatSubOfficesList(office.childUnits, office);
          subOffices.forEach(element => {
            targetOffices.push(element);
          });
        }
      }
    }

    return targetOffices;
  }
}

export enum UserAccessType {
  ViewCollection = 1,
  ViewForm = 2,
  AddNew = 3,
  Modify = 4,
  Delete = 5
}

export class UserAuthorization {
  constructor(private functionalityId: number, @Inject(ApplicationUserService) private applicationUserService) {

  }

  canAdd(officeId?: string): boolean {
    return this.hasAccess(UserAccessType.AddNew, officeId);
  }

  canModify(officeId?: string): boolean {
    return this.hasAccess(UserAccessType.Modify, officeId);
  }
  canView(officeId?: string): boolean {
    return this.hasAccess(UserAccessType.ViewForm, officeId);
  }

  canViewList(officeId?: string): boolean {
    return this.hasAccess(UserAccessType.ViewCollection, officeId);
  }

  hasAccess(userAccessId: number, organizationUnitId?: string): boolean {
    let result: boolean = false;
    var permittedOffices = this.getOffices(userAccessId);
    if (permittedOffices && permittedOffices.find(o => o.accessType === AccessRightType.Yes)) {
      if (organizationUnitId) {
        if (permittedOffices.find(o => o.officeId === organizationUnitId && o.accessType === AccessRightType.Yes)) {
          result = true;
        }

      }
      else {
        result = true;
      }
      return result;
    }
  }

  filterOfficeListByAccess(userAccessId: number, officeList: MasterListItem[]): MasterListItem[] {

    let filteredOffices: MasterListItem[] = [];
    if (officeList) {
      let permittedOffices = this.getOffices(userAccessId);
      if (permittedOffices) {
        for (let office of officeList) {
          if (permittedOffices.find(po => po.officeId === office.Id)) {
            filteredOffices.push(office);
          }
        }
      }
    }
    return filteredOffices;
  }


getOffices(userAccessId: number): AccessPermission[] {
    let officeList: AccessPermission[] = [];
    if (this.applicationUserService.loggedInUser && this.applicationUserService.officeHierarchy) {
      const userRights = this.applicationUserService.loggedInUser.userRights.functionalityAccessConfiguration;
      if (userRights) {
        const assignedAccessList = userRights.filter(ar => ar.functionalityId === this.functionalityId && ar.userAccessId === userAccessId);
        if (assignedAccessList) {
          for (let assignedAccess of assignedAccessList) {
            let office = OrganizationUnitHierarchyHelper.getOffice(assignedAccess.organizationUnitUUId, this.applicationUserService.officeHierarchy);
            let accessPermission: AccessPermission =
            {
              officeId: office.id,
              roleId: assignedAccess.roleId,
              permission: assignedAccess.accessPermission,
              isInherited: false,
              accessType: assignedAccess.accessType
            }

            officeList.push(accessPermission);

            var subOffices = OrganizationUnitHierarchyHelper.getFlatSubOfficesList(office.childUnits);
            if (subOffices) {
              subOffices.forEach(element => {
                let inheritedPermission: AccessPermission =
                {
                  officeId: element.id,
                  roleId: assignedAccess.roleId,
                  permission: assignedAccess.accessPermission,
                  isInherited: true,
                  accessType: assignedAccess.accessType
                }
                officeList.push(inheritedPermission);

              });
            }
          }
        }
      }
    }

    return officeList;
  }
}

export class AccessPermission {
  officeId: string;
  roleId: string;
  permission: string;
  isInherited: boolean;
  accessType: AccessRightType;
}

