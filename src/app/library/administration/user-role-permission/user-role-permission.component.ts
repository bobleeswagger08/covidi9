import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource, MatSlideToggleChange } from '@angular/material';
import { IFunctionalModule, FunctionalModule, AdminModuleService, IModuleAccessConfiguration, IUserAccessConfiguration, IListOfValuesAccessDataType } from '../../../services/admin-module/admin-module.service';
import { CurrentAccessPermission } from '../role-access-ui/role-access-ui.component';


@Component({
  selector: 'app-user-role-permission',
  templateUrl: './user-role-permission.component.html',
  styleUrls: ['./user-role-permission.component.scss']
})

export class UserRolePermissionComponent implements OnInit {
  @Input() moduleId: number = 0;
  @Input('module-structure') moduleStructure: FunctionalModule[] = [];
  @Input('access-configuration') accessConfiguration: IModuleAccessConfiguration;
  @Input('effective-permissions') currentPermissions: CurrentAccessPermission[];

  treeNodeDataSource: MatTreeNestedDataSource<FunctionalModule[]>;
  treeControl = new NestedTreeControl<IFunctionalModule>(node => node.subModules);


  userAccessItem?: IUserAccessConfiguration;
  customList: IListOfValuesAccessDataType[];


  listOfValuesConfig: IListOfValuesAccessDataType[];
  value: string;
  PostAccessConfig = {
    effectiveFrom: new Date(),
    accessRights: [{
      accessId: '',
      functionalityId: '',
      permissions: []
    }]
  };
  accessValue: string;

  constructor(private configService: AdminModuleService , private cdr: ChangeDetectorRef) { }

  hasChild = (_: number, node: IFunctionalModule) => !!node.subModules && node.subModules.length > 0;

  public getUserAccessConfig(moduleId: number) {
    //console.log('get access config : ' + moduleId);
    //this.userAccessConfig = null;
    if (this.accessConfiguration && moduleId) {
      for (var moduleAccess of this.accessConfiguration.accessConfiguration) {
        if (moduleAccess.moduleId == moduleId) {
          return moduleAccess;
        }
      }
    }
    else {
      //  this.userAccessConfig = null;
      return null;
    }
  }

  isChecked(functionalityId: Number, accessId: number): boolean {
    var isChecked: boolean = false;
    //console.log("is checked called : functionality id (" + functionalityId + "," + accessId + ")");

    var currentConfig = this.getCurrentAccessStateItem(functionalityId, accessId);
    if (currentConfig) {
      let value = currentConfig.updatedPermission[0];
      isChecked = (value === "Y" || value === "y");
    }
    return isChecked;
  }

  canUpdate(functionalityId: Number, accessId: number): boolean {
   return !this.isInherited(functionalityId, accessId);
  }

  isInherited(functionalityId: Number, accessId: number) {
    var currentState = this.getCurrentAccessStateItem(functionalityId, accessId);
    if (currentState && currentState.isInherited == true) {
      return true;
    }
    else {
      return false;
    }
  }

  valueChanged(event: any, functionalityId: Number, accessId: number) {
    console.log("Changed :" + functionalityId + "," + accessId)
    console.log(event);
    let currentStateItem = this.getCurrentAccessStateItem(functionalityId, accessId);
    if (currentStateItem) {
      if (event instanceof MatSlideToggleChange) {
        let checkBoxChanged = event as MatSlideToggleChange;
        var newValue = checkBoxChanged.checked ? 'Y' : 'N';
        currentStateItem.updateValue(newValue);

      }
    }

  }

  private getCurrentAccessStateItem(functionalityId: Number, accessId: number): CurrentAccessPermission {
    var currentConfig: CurrentAccessPermission;
    if (this.currentPermissions && this.currentPermissions.length > 0) {
      currentConfig = this.currentPermissions.find(p => p.accessId == accessId && p.functionalityId == functionalityId);
    }

    return currentConfig;
  }

  public getListDataType = (dataTypeId: number) => {
    let result = this.customList.filter(l => l.userAccessTypeId == dataTypeId);
    if (result) {
      return result[0].listItems;
    }
  };
  // saveDetails(accessGroup) {
  //   console.log(accessGroup)
  //   this.PostAccessConfig['roleCode'] = "Application";
  //   this.PostAccessConfig['organizationUnit'] = "HO";
  //   this.PostAccessConfig['effectiveFrom'] = "2019-12-18";
  //   this.PostAccessConfig.accessRights[0].accessId = accessGroup[0].accessConfiguration[0].accessId;
  //   this.PostAccessConfig.accessRights[0].functionalityId = accessGroup[0].accessConfiguration[0].accessDataTypeId;
  //   this.PostAccessConfig.accessRights[0].permissions = ["Y"];
  //   console.log(this.PostAccessConfig);
  //   this.configService.createUserRole(this.PostAccessConfig)
  //     .subscribe(response => response.json()
  //     );
  //}
  ngOnInit() {


    //this.getModuleAccess(this.moduleId);
    // // this.userAuthorization.getAll()
    // // .subscribe(auth => this.dataSource.data = auth);
    // this.configListService.getFunctionalModule()
    //   .subscribe(functionModule => {
    //     this.dataSource = functionModule;
    //     // console.log(this.dataSource);
    //   });

  }


}
