import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import { NotFoundError } from 'app/shared/commonerror/not-found-error';
import { AppError } from 'app/shared/commonerror/app-error';
import { catchError, map } from 'rxjs/operators';
import { BadInput } from 'app/shared/commonerror/bad-input';
import { ApplicationEnvironmentService } from 'app/services/application-environment/application-environment.service';
@Injectable({
    providedIn: 'root'
})
export class AdminModuleService {
    urlFunctionalModule: string;
    urlAccessPermission: string;
    urlUserRoleAssignment: string;
    constructor(private http: Http, private appEnvService: ApplicationEnvironmentService) {
        this.urlFunctionalModule = appEnvService.configParam.configServiceUrl + '/FunctionalModule/';
        this.urlAccessPermission = appEnvService.configParam.configServiceUrl + '/AccessPermissions/';
        this.urlUserRoleAssignment = appEnvService.configParam.configServiceUrl + '/UserRoleAssignment'
    }

    getFunctionalModule(code: number): Observable<FunctionalModule[]> {

        return this.http.get(this.urlFunctionalModule + code)
            .pipe(
                map(response => response.json()
                    .map(fm => FunctionalModule.fromJS(fm))
                ),
                catchError(this.HandleError)
            );
    }

    getFunctionalAccessConfig(code?: number): Observable<IModuleAccessConfiguration> {
        // curl -X GET "https://localhost:5001/FunctionalModule/1000/AccessConfiguration
        return this.http.get(this.urlFunctionalModule + code + '/AccessConfiguration')
            .pipe(
                map(response => {
                    //console.log(response);
                    return ModuleAccessConfiguration.fromJS(response.json());
                }
                )
                , catchError(this.HandleError)
            );

    }

    getEffectiveRolePermissions(roleId: string, unitId: string): Observable<EffectiveAccessPermission[]> {
        // https://localhost:5001/AccessPermissions/Role/845565d8-9321-4fac-896f-d2f7be97e002/Unit/ebc83ef5-15b1-11ea-a33f-9829a670a982
        var url = this.urlAccessPermission + 'Role/' + roleId + '/Unit/' + unitId;
        console.log(url);
        return this.http.get(url)
            .pipe(
                map(response => response.json()
                    .map(
                        fm => EffectiveAccessPermission.fromJS(fm)
                    ))
                , catchError(this.HandleError)
            );
    }

    private HandleError(err: Response) {
        if (err.status === 404) {
            return Observable.throw(new NotFoundError());
        }
        if (err.status === 400) {
            return Observable.throw(new BadInput(err.json()));
        }
        return Observable.throw(new AppError(err));
    }

    postAccessPermissionRequest(roleId: string, unitId: string, permissionRequest: UserRolePermissionRequest): Observable<string> {
        var url = this.urlAccessPermission + 'Role/' + roleId + '/Unit/' + unitId;
        return this.http.post(url, permissionRequest.toJSON())
            .pipe(
                map(response => response.json())
                , catchError(this.HandleError)
            );
    }

    getUserRoleAssignment(userUId: string, effectiveFrom:Date): Observable<IRoleAssignment[]> {
        // UserRoleAssignment/25750891-6f51-4615-80dc-c2c66835de3b/EffectiveFrom/2020-01-23
        let requestUrl: string = this.urlUserRoleAssignment +"/" + userUId + "/EffectiveFrom/" +effectiveFrom.toISOString();
        console.log(requestUrl);
        return this.http.get(requestUrl)
            .pipe(
                map(response => response.json())
                , catchError(this.HandleError)
            );
    }

    saveUserRoleAssignment(userRoleAssignment: UserRoleAssignment) :Observable<IRoleAssignment[]>{
        if (!userRoleAssignment) {
            alert('User role data not set');
            return;
        }

        let requestUrl: string = this.urlUserRoleAssignment;
        return this.http.post(requestUrl,userRoleAssignment)
            .pipe(
                map(response => response.json())
                , catchError(this.HandleError)
            );

    }

}


/** Represents an application functional module */
export interface IFunctionalModule {
    /** Identifies hierarchy tree branch for the current module */
    treeIdentifier?: number;
    /** Hierarchical position of current module in the tree */
    level?: number;
    /** Unique numeric Id of module */
    id?: number;
    /** Unique Module code */
    code?: string | undefined;
    /** Detailed description of module */
    description?: string | undefined;
    /** Reference of default parent module */
    defaultParentModule?: FunctionalModule | undefined;
    /** Child modules of current module */
    subModules?: FunctionalModule[] | undefined;
}


/** Represents an application functional module */
export class FunctionalModule /*implements IFunctionalModule*/ {
    /** Identifies hierarchy tree branch for the current module */
    treeIdentifier?: number;
    /** Hierarchical position of current module in the tree */
    level?: number;
    /** Unique numeric Id of module */
    id?: number;
    /** Unique Module code */
    code?: string | undefined;
    /** Detailed description of module */
    description?: string | undefined;
    /** Reference of default parent module */
    defaultParentModule?: FunctionalModule | undefined;
    /** Child modules of current module */
    subModules?: FunctionalModule[] | undefined;

    constructor(data?: IFunctionalModule) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.treeIdentifier = _data["treeIdentifier"];
            this.level = _data["level"];
            this.id = _data["id"];
            this.code = _data["code"];
            this.description = _data["description"];
            this.defaultParentModule = _data["defaultParentModule"] ? FunctionalModule.fromJS(_data["defaultParentModule"]) : <any>undefined;
            if (Array.isArray(_data["subModules"])) {
                this.subModules = [] as any;
                for (let item of _data["subModules"])
                    this.subModules!.push(FunctionalModule.fromJS(item));
            }
        }
    }

    static fromJS(data: any): FunctionalModule {
        data = typeof data === 'object' ? data : {};
        let result = new FunctionalModule();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["treeIdentifier"] = this.treeIdentifier;
        data["level"] = this.level;
        data["id"] = this.id;
        data["code"] = this.code;
        data["description"] = this.description;
        data["defaultParentModule"] = this.defaultParentModule ? this.defaultParentModule.toJSON() : <any>undefined;
        if (Array.isArray(this.subModules)) {
            data["subModules"] = [];
            for (let item of this.subModules)
                data["subModules"].push(item.toJSON());
        }
        return data;
    }
}

// /** Represents an application functional module */
// export interface IFunctionalModule {
//     /** Identifies hierarchy tree branch for the current module */
//     treeIdentifier?: number;
//     /** Hierarchical position of current module in the tree */
//     level?: number;
//     /** Unique numeric Id of module */
//     id?: number;
//     /** Unique Module code */
//     code?: string | undefined;
//     /** Detailed description of module */
//     description?: string | undefined;
//     /** Reference of default parent module */
//     defaultParentModule?: FunctionalModule | undefined;
//     /** Child modules of current module */
//     subModules?: FunctionalModule[] | undefined;
// }

/** Represents user access configuration data for a module */
export class ModuleAccessConfiguration implements IModuleAccessConfiguration {
    /** List of access configuration for the module */
    accessConfiguration?: AccessConfiguration[] | undefined;
    /** Details of 'list of values' data type applicable for current set of permissions  */
    listOfValuesTypes?: ListOfValuesAccessDataType[] | undefined;

    constructor(data?: IModuleAccessConfiguration) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            if (Array.isArray(_data["accessConfiguration"])) {
                this.accessConfiguration = [] as any;
                for (let item of _data["accessConfiguration"])
                    this.accessConfiguration!.push(AccessConfiguration.fromJS(item));
            }
            if (Array.isArray(_data["listOfValuesTypes"])) {
                this.listOfValuesTypes = [] as any;
                for (let item of _data["listOfValuesTypes"])
                    this.listOfValuesTypes!.push(ListOfValuesAccessDataType.fromJS(item));
            }
        }
    }

    static fromJS(data: any): ModuleAccessConfiguration {
        data = typeof data === 'object' ? data : {};
        let result = new ModuleAccessConfiguration();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        if (Array.isArray(this.accessConfiguration)) {
            data["accessConfiguration"] = [];
            for (let item of this.accessConfiguration)
                data["accessConfiguration"].push(item.toJSON());
        }
        if (Array.isArray(this.listOfValuesTypes)) {
            data["listOfValuesTypes"] = [];
            for (let item of this.listOfValuesTypes)
                data["listOfValuesTypes"].push(item.toJSON());
        }
        return data;
    }
}

/** Represents user access configuration data for a module */
export interface IModuleAccessConfiguration {
    /** List of access configuration for the module */
    accessConfiguration?: AccessConfiguration[] | undefined;
    /** Details of 'list of values' data type applicable for current set of permissions  */
    listOfValuesTypes?: ListOfValuesAccessDataType[] | undefined;
}

/** Represents functionality access right configuration data */
export class AccessConfiguration implements IAccessConfiguration {
    /** Unique module Id of the configuration */
    moduleId?: number;
    /** List of access access groups for the functional module */
    accessGroups?: AccessConfigurationGroup[] | undefined;

    constructor(data?: IAccessConfiguration) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.moduleId = _data["moduleId"];
            if (Array.isArray(_data["accessGroups"])) {
                this.accessGroups = [] as any;
                for (let item of _data["accessGroups"])
                    this.accessGroups!.push(AccessConfigurationGroup.fromJS(item));
            }
        }
    }

    static fromJS(data: any): AccessConfiguration {
        data = typeof data === 'object' ? data : {};
        let result = new AccessConfiguration();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["moduleId"] = this.moduleId;
        if (Array.isArray(this.accessGroups)) {
            data["accessGroups"] = [];
            for (let item of this.accessGroups)
                data["accessGroups"].push(item.toJSON());
        }
        return data;
    }
}

/** Represents functionality access right configuration data */
export interface IAccessConfiguration {
    /** Unique module Id of the configuration */
    moduleId?: number;
    /** List of access access groups for the functional module */
    accessGroups?: AccessConfigurationGroup[] | undefined;
}

/** Represents a similar set of functional access right */
export class AccessConfigurationGroup implements IAccessConfigurationGroup {
    /** Group name */
    name?: string | undefined;
    /** List of access configurations that belong to the group */
    accessConfiguration?: UserAccessConfiguration[] | undefined;

    constructor(data?: IAccessConfigurationGroup) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.name = _data["name"];
            if (Array.isArray(_data["accessConfiguration"])) {
                this.accessConfiguration = [] as any;
                for (let item of _data["accessConfiguration"])
                    this.accessConfiguration!.push(UserAccessConfiguration.fromJS(item));
            }
        }
    }

    static fromJS(data: any): AccessConfigurationGroup {
        data = typeof data === 'object' ? data : {};
        let result = new AccessConfigurationGroup();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["name"] = this.name;
        if (Array.isArray(this.accessConfiguration)) {
            data["accessConfiguration"] = [];
            for (let item of this.accessConfiguration)
                data["accessConfiguration"].push(item.toJSON());
        }
        return data;
    }
}

/** Represents a similar set of functional access right */
export interface IAccessConfigurationGroup {
    /** Group name */
    name?: string | undefined;
    /** List of access configurations that belong to the group */
    accessConfiguration?: UserAccessConfiguration[] | undefined;
}

/** Represents a specific user access configuration for a functionality */
export class UserAccessConfiguration implements IUserAccessConfiguration {
    /** User access  */
    accessId?: number;
    /** Represents the access data type */
    accessDataTypeId?: number;
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
    /** Child access right configurations of current access */
    dependentAccess?: AccessConfigurationGroup[] | undefined;

    constructor(data?: IUserAccessConfiguration) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.accessId = _data["accessId"];
            this.accessDataTypeId = _data["accessDataTypeId"];
            this.serialNumber = _data["serialNumber"];
            this.description = _data["description"];
            this.defaultValue = _data["defaultValue"];
            this.adminJson = _data["adminJson"];
            this.defaultJson = _data["defaultJson"];
            if (Array.isArray(_data["dependentAccess"])) {
                this.dependentAccess = [] as any;
                for (let item of _data["dependentAccess"])
                    this.dependentAccess!.push(AccessConfigurationGroup.fromJS(item));
            }
        }
    }

    static fromJS(data: any): UserAccessConfiguration {
        data = typeof data === 'object' ? data : {};
        let result = new UserAccessConfiguration();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["accessId"] = this.accessId;
        data["accessDataTypeId"] = this.accessDataTypeId;
        data["serialNumber"] = this.serialNumber;
        data["description"] = this.description;
        data["defaultValue"] = this.defaultValue;
        data["adminJson"] = this.adminJson;
        data["defaultJson"] = this.defaultJson;
        if (Array.isArray(this.dependentAccess)) {
            data["dependentAccess"] = [];
            for (let item of this.dependentAccess)
                data["dependentAccess"].push(item.toJSON());
        }
        return data;
    }
}

/** Represents a specific user access configuration for a functionality */
export interface IUserAccessConfiguration {
    /** User access  */
    accessId?: number;
    /** Represents the access data type */
    accessDataTypeId?: number;
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
    /** Child access right configurations of current access */
    dependentAccess?: AccessConfigurationGroup[] | undefined;
}

/** Represents a functionality user access type */
export class UserAccessType implements IUserAccessType {
    /** Module id of the functionality */
    moduleId?: number;
    /** Unique id of the functionality */
    functionalityId?: number;
    /** User access id */
    userAccessTypeId?: number;
    /** Data type of access */
    dataType?: AccessRightDataType;

    constructor(data?: IUserAccessType) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.moduleId = _data["moduleId"];
            this.functionalityId = _data["functionalityId"];
            this.userAccessTypeId = _data["userAccessTypeId"];
            this.dataType = _data["dataType"];
        }
    }

    static fromJS(data: any): UserAccessType {
        data = typeof data === 'object' ? data : {};
        let result = new UserAccessType();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["moduleId"] = this.moduleId;
        data["functionalityId"] = this.functionalityId;
        data["userAccessTypeId"] = this.userAccessTypeId;
        data["dataType"] = this.dataType;
        return data;
    }
}

/** Represents a functionality user access type */
export interface IUserAccessType {
    /** Module id of the functionality */
    moduleId?: number;
    /** Unique id of the functionality */
    functionalityId?: number;
    /** User access id */
    userAccessTypeId?: number;
    /** Data type of access */
    dataType?: AccessRightDataType;
}

/** Represents list of values access data type */
export class ListOfValuesAccessDataType extends UserAccessType implements IListOfValuesAccessDataType {
    /** List of allowed values */
    listItems?: AccessRightListItem[] | undefined;

    constructor(data?: IListOfValuesAccessDataType) {
        super(data);
    }

    init(_data?: any) {
        super.init(_data);
        if (_data) {
            if (Array.isArray(_data["listItems"])) {
                this.listItems = [] as any;
                for (let item of _data["listItems"])
                    this.listItems!.push(AccessRightListItem.fromJS(item));
            }
        }
    }

    static fromJS(data: any): ListOfValuesAccessDataType {
        data = typeof data === 'object' ? data : {};
        let result = new ListOfValuesAccessDataType();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        if (Array.isArray(this.listItems)) {
            data["listItems"] = [];
            for (let item of this.listItems)
                data["listItems"].push(item.toJSON());
        }
        super.toJSON(data);
        return data;
    }
}

/** Represents list of values access data type */
export interface IListOfValuesAccessDataType extends IUserAccessType {
    /** List of allowed values */
    listItems?: AccessRightListItem[] | undefined;
}

/** Represents an access list item, for access data types that is a list of items */
export class AccessRightListItem implements IAccessRightListItem {
    /** Description of the user access right, as will be displayed on screen */
    description?: string | undefined;
    /** The internal value for the item */
    value?: string | undefined;

    constructor(data?: IAccessRightListItem) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.description = _data["description"];
            this.value = _data["value"];
        }
    }

    static fromJS(data: any): AccessRightListItem {
        data = typeof data === 'object' ? data : {};
        let result = new AccessRightListItem();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["description"] = this.description;
        data["value"] = this.value;
        return data;
    }
}

/** Represents an access list item, for access data types that is a list of items */
export interface IAccessRightListItem {
    /** Description of the user access right, as will be displayed on screen */
    description?: string | undefined;
    /** The internal value for the item */
    value?: string | undefined;
}

/** Represents user access data types */
export enum AccessRightDataType {
    None = 0,
    Boolean = 1,
    Decimal = 2,
    ValueFromList = 3,
    NumericalRange = 4,
}


/** Represents resource access permission data */
export class AccessPermissionData {
    /** Id of functionality */
    functionalityId?: number;
    /** User Access id that represents a specific access right of the functionality */
    accessId?: number;
    /** Sequential list of permissions for user access */
    permissions?: string[] | null;
    accessJson?: string | null;

    init(_data?: any) {
        if (_data) {
            this.functionalityId = _data["functionalityId"] !== undefined ? _data["functionalityId"] : <any>null;
            this.accessId = _data["accessId"] !== undefined ? _data["accessId"] : <any>null;
            if (Array.isArray(_data["permissions"])) {
                this.permissions = [] as any;
                for (let item of _data["permissions"])
                    this.permissions!.push(item);
            }
            this.accessJson = _data["accessJson"] !== undefined ? _data["accessJson"] : <any>null;
        }
    }

    static fromJS(data: any): AccessPermissionData {
        data = typeof data === 'object' ? data : {};
        let result = new AccessPermissionData();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["functionalityId"] = this.functionalityId !== undefined ? this.functionalityId : <any>null;
        data["accessId"] = this.accessId !== undefined ? this.accessId : <any>null;
        if (Array.isArray(this.permissions)) {
            data["permissions"] = [];
            for (let item of this.permissions)
                data["permissions"].push(item);
        }
        data["accessJson"] = this.accessJson !== undefined ? this.accessJson : <any>null;
        return data;
    }
}

/** Represents actual user role access permissions for a functionality */
export class EffectiveAccessPermission extends AccessPermissionData {
    /** Timestamp from when the access is effective */
    effectiveFrom?: Date;
    /** If the current permission is inherited from a higher level organization unit */
    isInherited?: boolean;
    /** Access json for configuration */
    accessJson?: string | null;
    /** Unique Id of the organization unit where the permission was actually set */
    unitId?: string;
    /** Code of the organization unit where the permission was actually set */
    unitCode?: string | null;

    init(_data?: any) {
        super.init(_data);
        if (_data) {
            this.effectiveFrom = _data["effectiveFrom"] ? new Date(_data["effectiveFrom"].toString()) : <any>null;
            this.isInherited = _data["isInherited"] !== undefined ? _data["isInherited"] : <any>null;
            this.accessJson = _data["accessJson"] !== undefined ? _data["accessJson"] : <any>null;
            this.unitId = _data["unitId"] !== undefined ? _data["unitId"] : <any>null;
            this.unitCode = _data["unitCode"] !== undefined ? _data["unitCode"] : <any>null;
        }
    }

    static fromJS(data: any): EffectiveAccessPermission {
        data = typeof data === 'object' ? data : {};
        let result = new EffectiveAccessPermission();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["effectiveFrom"] = this.effectiveFrom ? this.effectiveFrom.toISOString() : <any>null;
        data["isInherited"] = this.isInherited !== undefined ? this.isInherited : <any>null;
        data["accessJson"] = this.accessJson !== undefined ? this.accessJson : <any>null;
        data["unitId"] = this.unitId !== undefined ? this.unitId : <any>null;
        data["unitCode"] = this.unitCode !== undefined ? this.unitCode : <any>null;
        super.toJSON(data);
        return data;
    }
}

/** Represents a set of access permission data for a user role */
export class UserRolePermissionRequest {
    /** Date and time from which the set of permissions will be applicable  */
    effectiveFrom?: Date | null;
    /** List of access rights */
    accessRights?: AccessPermissionRequest[] | null;

    init(_data?: any) {
        if (_data) {
            this.effectiveFrom = _data["effectiveFrom"] ? new Date(_data["effectiveFrom"].toString()) : <any>null;
            if (Array.isArray(_data["accessRights"])) {
                this.accessRights = [] as any;
                for (let item of _data["accessRights"])
                    this.accessRights!.push(AccessPermissionRequest.fromJS(item));
            }
        }
    }

    static fromJS(data: any): UserRolePermissionRequest {
        data = typeof data === 'object' ? data : {};
        let result = new UserRolePermissionRequest();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["effectiveFrom"] = this.effectiveFrom ? this.effectiveFrom.toISOString() : <any>null;
        if (Array.isArray(this.accessRights)) {
            data["accessRights"] = [];
            for (let item of this.accessRights)
                data["accessRights"].push(item.toJSON());
        }
        return data;
    }
}

/** Represents functionality access permission request details */
export class AccessPermissionRequest extends AccessPermissionData {

    init(_data?: any) {
        super.init(_data);
    }

    static fromJS(data: any): AccessPermissionRequest {
        data = typeof data === 'object' ? data : {};
        let result = new AccessPermissionRequest();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        super.toJSON(data);
        return data;
    }
}

/** Represents role assignment details */
export interface IRoleAssignment {
    /** Id of the role */
    roleId: string;
    /** Date and time from which the role will be effective  */
    startsOn?: Date;
    /** Date and time upto which the role will be effective  */
    expiresOn?: Date | undefined;
}

/** Represents role assignment details with role description */
export interface IRoleAssignmentDetails extends IRoleAssignment {
    /** Role description */
    description?: string | undefined;
}

/** Represents role assignments of user */
export class UserRoleAssignment {
    /** Id of the user */
    userId: string;
    /** Date and time from which the role assignment will be effective  */
    effectiveFrom?: any;
    /** List of assigned roles */
    roles?: IRoleAssignment[] | undefined;
}

export interface ILoginCredential {
    userId: string;
    password: string;
}


export interface IRoleAssignmentInputItem extends IRoleAssignmentDetails {

}

export class EditableRoleAssignmentItem implements IRoleAssignmentDetails {
    description?: string;
    roleId: string;
    startsOn?: Date;
    expiresOn?: Date;
    mode: number; // 1 - Add , 2 - update
    // currentRole : string; 
    existingRoles: string[] = [];
}
