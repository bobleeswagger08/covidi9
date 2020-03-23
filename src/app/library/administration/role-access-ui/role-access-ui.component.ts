import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MasterListItem } from 'app/model/master-list-item';
import { AdminModuleService, IFunctionalModule, IModuleAccessConfiguration, EffectiveAccessPermission, AccessConfigurationGroup, UserRolePermissionRequest, AccessPermissionRequest, UserAccessConfiguration } from '../../../services/admin-module/admin-module.service';
//import { ConfigParamService } from 'app/services/config-param/config-param.service';
import { MasterListItemSelectionChanged } from '../../shared-controls/selection-list/selection-list.component';
import { ApplicationEnvironmentService } from 'app/services/application-environment/application-environment.service';
import { ConfigurationlistService } from 'app/services/config/configurationlist.service';


@Component({
  selector: 'app-role-access-ui',
  templateUrl: './role-access-ui.component.html',
  styleUrls: ['./role-access-ui.component.scss']
})
export class RoleAccessUiComponent implements OnInit {


  organizationUnits: MasterListItem[];
  userRoles: MasterListItem[];

  moduleStructure: IFunctionalModule[] = null;
  moduleAccessConfiguration: IModuleAccessConfiguration = null;
  savedRolePermissions: EffectiveAccessPermission[] = null;

  liveAccessPermissions: CurrentAccessPermission[] = null;

  selectedOfficeId: string = null;
  selectedRoleId: string = null;

  accessConfigurationLoaded: boolean = false;



  isValidSelection(): boolean {
    return (!(this.selectedOfficeId == undefined || this.selectedOfficeId == null || this.selectedOfficeId == "")
      || (this.selectedRoleId == undefined || this.selectedOfficeId == null || this.selectedOfficeId == "")
    );
  }

  /*
    getModuleAccessPermissionData(moduleId: number): ModulePermissionData {
      var moduleData: ModulePermissionData = null;
      for (let i = 0; i < this.modulePermissionData.length; i++) {
        if (this.modulePermissionData[i].moduleId == moduleId) {
          moduleData = this.modulePermissionData[i];
          break;
        }
      }
  
      if (moduleData == null) {
        moduleData = new ModulePermissionData();
        moduleData.moduleId = moduleId;
        this.modulePermissionData.push(moduleData);
      }
  
      return moduleData;
    }*/

  constructor(private configList: ConfigurationlistService
    , private adminModuleService: AdminModuleService
    , private cdr: ChangeDetectorRef
    , private appEnvironment:ApplicationEnvironmentService
  ) { }

  ngOnInit() {
    this.configList.getOrganizationUnitList(true)
      .subscribe(newList => {
        this.organizationUnits = newList;
      });

    this.configList.getUserRoles(true, false)
      .subscribe(newMasterList => {
        this.userRoles = newMasterList;
      });

    this.getModuleStructure();
    this.getModuleAccessConfiguration();

  }

  getModuleStructure() {
    this.moduleStructure = null;
    this.adminModuleService.getFunctionalModule(0) // get configuration of all modules
      .subscribe(
        moduleList => {
          this.moduleStructure = moduleList;
          this.accessConfigurationLoaded = true;
          this.cdr.detectChanges();
          //console.log(this.moduleStructure);
        }
      );

  }

  private getModuleAccessConfiguration() {
    this.moduleAccessConfiguration = null;
    this.adminModuleService.getFunctionalAccessConfig(0)
      .subscribe(result => {
        this.moduleAccessConfiguration = result;
        this.cdr.detectChanges();
      });

  }

  officeSelectionChanged(eventParam: MasterListItemSelectionChanged) {
    var newValue = null;
    if (eventParam && eventParam.newSelection) {
      newValue = eventParam.newSelection.Id;
    }
    else {
      newValue = null;
    }
    //alert("Value changed to : " + eventParam.Code);
    if (this.selectedOfficeId != newValue) {
      this.selectedOfficeId = newValue;
      this.masterSelectionChanged();
    }
  }

  roleSelectionChanged(eventParam: MasterListItemSelectionChanged) {
    var newValue = null;
    if (eventParam && eventParam.newSelection) {
      newValue = eventParam.newSelection.Id;
    }
    else {
      newValue = null;
    }
    //alert("Value changed to : " + eventParam.Code);
    if (this.selectedRoleId != newValue) {
      this.selectedRoleId = newValue;
      this.masterSelectionChanged();
    }
  }

  masterSelectionChanged() {
    this.accessConfigurationLoaded = false;  
    this.savedRolePermissions = null;
    if (this.selectedOfficeId && this.selectedRoleId) {
      this.adminModuleService.getEffectiveRolePermissions(this.selectedRoleId, this.selectedOfficeId)
        .subscribe(result => {
          this.savedRolePermissions = result;
          this.generateEffectiveAccessStructure();
          this.cdr.detectChanges();
        });
    }
  }

  generateEffectiveAccessStructure() {
    this.liveAccessPermissions = [];
    if (this.moduleStructure && this.moduleAccessConfiguration) {
      for (let moduleAccessConfiguration of this.moduleAccessConfiguration.accessConfiguration) {
        if (moduleAccessConfiguration.accessGroups) {
          for (let accessGroup of moduleAccessConfiguration.accessGroups) {
            this.generateEffectiveGroupAccess(moduleAccessConfiguration.moduleId, accessGroup);
          }
        }
      }

      // prepare access list
      this.accessConfigurationLoaded = true;
    }
  }

  generateEffectiveGroupAccess(functionalityId: number, accessConfigurationGroup: AccessConfigurationGroup) {
    if (accessConfigurationGroup) {
      for (let userAccessConfiguration of accessConfigurationGroup.accessConfiguration) {
        let permissionData: CurrentAccessPermission = new CurrentAccessPermission();
        permissionData.functionalityId = functionalityId;
        permissionData.accessId = userAccessConfiguration.accessId;
        permissionData.defaultJson = userAccessConfiguration.defaultJson;
        permissionData.updatedJson = userAccessConfiguration.defaultJson;
        //TODO: the user access configuration should also be an array of default values
        // this is to cater to range type permission - to be enhanced
        permissionData.defaultPermissions.push(userAccessConfiguration.defaultValue);
        permissionData.updatedPermission.push(userAccessConfiguration.defaultValue);
        if (this.savedRolePermissions) {
          this.updateSavedPermissions(functionalityId, userAccessConfiguration, permissionData);
          this.liveAccessPermissions.push(permissionData);
        }

        for (let dependentAccessGroup of userAccessConfiguration.dependentAccess) {
          this.generateEffectiveGroupAccess(functionalityId, dependentAccessGroup);
        }
      }
    }
  }

  private updateSavedPermissions(functionalityId: number, userAccessConfiguration: UserAccessConfiguration, permissionData: CurrentAccessPermission) {
    var savedPermission = this.savedRolePermissions.find(p => p.functionalityId == functionalityId && p.accessId == userAccessConfiguration.accessId);
    if (savedPermission) {
      permissionData.updatedJson = savedPermission.accessJson;
      permissionData.defaultJson = savedPermission.accessJson;
      permissionData.defaultPermissions = savedPermission.permissions;
      permissionData.updatedPermission = savedPermission.permissions;
      permissionData.isInherited = savedPermission.isInherited;
      permissionData.isImplied = false;
      permissionData.unitCode = savedPermission.unitCode;
    }
  }

  canSave(): boolean {
    let canSave: boolean = false;

    if (this.liveAccessPermissions) {
      if (this.liveAccessPermissions.find(i => i.isModified)) {
        canSave = true;
      }
    }

    return canSave;
  }

  saveChanges() {
    this.appEnvironment.alertManager.showConfirmationDialog("Do you want to update permissions for current role ?", "Confirm Permission Updates")
    .subscribe(
      result => {
        if (result) {
          this.savePermissions();
        }
       
      });
    
  }

  savePermissions() {
    // get list of updated permissions
    if (this.liveAccessPermissions) {
      let updatedPermissionSet: CurrentAccessPermission[] = [];
      for (let updatedPermissionValue of this.liveAccessPermissions) {
        if (updatedPermissionValue.isModified) {
          updatedPermissionSet.push(updatedPermissionValue);
        }
      }

      if (updatedPermissionSet.length > 0) {
        let permissionRequest: UserRolePermissionRequest = new UserRolePermissionRequest();

        permissionRequest.effectiveFrom = null;
        permissionRequest.accessRights = [];
        for (let updatedPermission of updatedPermissionSet) {
          let accessPermissionRequest: AccessPermissionRequest = new AccessPermissionRequest();
          accessPermissionRequest.accessId = updatedPermission.accessId;
          accessPermissionRequest.functionalityId = updatedPermission.functionalityId;
          accessPermissionRequest.accessJson = updatedPermission.updatedJson;
          accessPermissionRequest.permissions = updatedPermission.updatedPermission;
          permissionRequest.accessRights.push(accessPermissionRequest);
        }

        this.adminModuleService.postAccessPermissionRequest(this.selectedRoleId, this.selectedOfficeId, permissionRequest).
          subscribe(() => {
            alert("Saved");
            this.masterSelectionChanged();
          })
      };

    }

  }

  resetChanges(eventParam: any) {
    this.masterSelectionChanged();
  }

}


/* supporting classes */
export class CurrentAccessPermission {
  /** Id of functionality */
  functionalityId?: number;
  /** User Access id that represents a specific access right of the functionality */
  accessId?: number;
  /** Sequential list of permissions for user access */
  defaultPermissions?: string[] | undefined = [];
  updatedPermission?: string[] | undefined = [];
  defaultJson: string | undefined;
  updatedJson: string | undefined;
  isInherited: boolean;
  isImplied: boolean;
  unitId?: string;

  /** Code of the organization unit where the permission was actually set */
  unitCode?: string | undefined;
  isModified: boolean = false;
  checkModified(): boolean {
    let modified: boolean = false;
    for (let i = 0; i < this.updatedPermission.length; i++) {
      if (this.updatedPermission[i] != this.defaultPermissions[i]) {
        modified = true;
        break;
      }
    }

    if (!modified) {
      modified = this.defaultJson != this.updatedJson;
    }

    return modified;
  }

  public updateValue(newValue: string, index?: number | null) {
    let valueIndex = 0;
    if (index) {
      valueIndex = index;
    }

    this.updatedPermission[valueIndex] = newValue;
    this.isModified =true; // this.checkModified();
  }

}

// export class ModulePermissionData {
//   moduleId: number;
//   accessPermissionList: AccessPermissionData[];
// }
