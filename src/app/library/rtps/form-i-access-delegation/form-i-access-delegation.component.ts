import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialogConfig, MatTable, } from '@angular/material';
import { IServiceMaster } from 'app/library/rtps/model/rtps';
import { RtpsService } from '../services/rtps/rtps.service';
import { IOfficeListParent } from 'app/model/office';
import { Observable } from 'rxjs';
import { FormIUserSelectionComponent } from '../form-i-user-selection/form-i-user-selection.component';
import { MatDialog } from '@angular/material/dialog';
import { IListUser } from 'app/model/user';
import { v4 as uuid } from 'uuid';
import { AppError } from 'app/shared/commonerror/app-error';
import { BadInput } from 'app/shared/commonerror/bad-input';
import { formatDate } from '@angular/common';
import { UserAuthorization } from 'app/services/application-user/application-user.service';
import { ApplicationEnvironmentService } from 'app/services/application-environment/application-environment.service';

export interface IFormIAccessValues {
  office: {
    id: string;
    code: string;
    description: string;
  };
  service: {
    id: string;
    code: string;
    description: string;
  };
}
export interface IUser {
  userId: string,
  userName: string,
  serviceCode: string,
  serviceName: string,
  officeCode: string,
  officeName: string
}
export interface IListAssignedItem {
  id: string,
  code: string,
  userId: string,
  userFirstName: string,
  userLastName: string,
  serviceCode: string,
  serviceName: string,
  officeCode: string,
  officeName: string
}
export interface IFormIServiceDelegation {
  id: string,
  authorizeUserId: string,
  serviceId: string,
  officeId: string,
  effectiveFrom: string,
  isActive: true
}
export interface IAlreadyAssignedUser {
  userMapping: [
    {
      userUId: string,
      userId: string,
      firstName: string,
      lastName: string
    }],
  id: string,
  authorizeUserId: string,
  serviceId: string,
  serviceCode: string,
  service: string,
  officeId: string,
  officeCode: string,
  office: string,
  effectiveFrom: string,
  isActive: true
}

@Component({
  selector: 'app-form-i-access-delegation',
  templateUrl: './form-i-access-delegation.component.html',
  styleUrls: ['./form-i-access-delegation.component.scss']
})
export class FormIAccessDelegationComponent implements OnInit {
  @ViewChild(MatTable, { static: false }) myTable: MatTable<IListAssignedItem>;
  displayedColumns: string[] = ['userId', 'userFirstName', 'service', 'office', 'updatebutton'];
  // dataSource:MatTableDataSource<IListUser>;
  listServicemaster: IServiceMaster[];
  listOffice: IOfficeListParent[];
  selectedUser: IListUser;
  private userAuthorization: UserAuthorization;

  listAlreadyAssignedUser: IAlreadyAssignedUser = {
    userMapping: [
      {
        userUId: '',
        userId: '',
        firstName: '',
        lastName: ''
      }],
    id: '',
    authorizeUserId: '',
    serviceId: '',
    serviceCode: '',
    service: '',
    officeId: '',
    officeCode: '',
    office: '',
    effectiveFrom: '',
    isActive: true
  };
  formIAccessValues: IFormIAccessValues = {
    office: {
      id: '',
      code: '',
      description: ''
    },
    service: {
      id: '',
      code: '',
      description: ''
    }
  };
  assignedUser: IListAssignedItem[] = [];
  formIServiceDelegationValue: IFormIServiceDelegation = {
    authorizeUserId: '',
    effectiveFrom: '',
    id: '',
    isActive: true,
    officeId: '',
    serviceId: ''
  };
  //@ViewChild('TABLE',{static: false}) table: ElementRef;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(private rtps: RtpsService, private environmentService: ApplicationEnvironmentService, private dialog: MatDialog, private cdr: ChangeDetectorRef) {
    // this.dataSource.paginator = this.paginator; 
    // this.dataSource.sort = this.sort; 
    this.userAuthorization = new UserAuthorization(1213, this.environmentService.userSession);
  }

  ngOnInit() {
    this.getServiceMasterList();
    this.getOfficeList();
  }
  onServiceOrOfficeCahnge() {
    if (this.formIAccessValues.office.id != '' && this.formIAccessValues.service.id != '') {
      this.getAssignedUser(this.formIAccessValues.office.id, this.formIAccessValues.service.id)
    }
  }
  getServiceMasterList() {
    this.rtps.getAllDesignatedService()
      .subscribe(parentList => {
        this.listServicemaster = parentList
        // console.log(this.listParent);
      });
  }
  getOfficeList() {
    this.rtps.getAllDesignatedOffice()
      .subscribe(parentList => {
        this.listOffice =this.filterOfficeByAccess(parentList);
        // console.log(this.listParent);
        this.cdr.detectChanges();
      });
  }

  private filterOfficeByAccess(officeList: IOfficeListParent[]): IOfficeListParent[]
  {
    let filteredOffices: IOfficeListParent[] = [];
    if (officeList) {
      let permittedOffices = this.userAuthorization.getOffices(4);
      if (permittedOffices) {
        for (let office of officeList) {
          if (permittedOffices.find(po => po.officeId === office.id)) {
            filteredOffices.push(office);
          }
        }
      }
  }
  return filteredOffices;
  }
  getAssignedUser(officeId, serviceId) {
    this.rtps.getAllAssignedUser(officeId, serviceId)
      .subscribe(aUser => {
        this.listAlreadyAssignedUser = aUser
        // console.log(this.listParent);
        this.cdr.detectChanges();
        var index = 0;
        for (let i = 0; i < this.listAlreadyAssignedUser.userMapping.length; i++) {
          let aaUserValue: any = {};
          aaUserValue.id = this.listAlreadyAssignedUser.userMapping[i].userUId,
            aaUserValue.userId = this.listAlreadyAssignedUser.userMapping[i].userId,
            aaUserValue.userFirstName = this.listAlreadyAssignedUser.userMapping[i].firstName,
            aaUserValue.userLastName = this.listAlreadyAssignedUser.userMapping[i].lastName,
            // aaUserValue['userFirstName'] = aaUser.userName,
            aaUserValue['officeCode'] = this.listAlreadyAssignedUser.officeCode,
            aaUserValue['officeDescription'] = this.listAlreadyAssignedUser.office,
            aaUserValue['serviceCode'] = this.listAlreadyAssignedUser.serviceCode,
            aaUserValue['serviceDescription'] = aUser.service,
            this.assignedUser.splice(i, 1, aaUserValue);
        }
        console.log(this.assignedUser);
        this.myTable.renderRows();
      });
  }
  public onAddUser() {
    if (this.formIAccessValues.office.id != '' && this.formIAccessValues.service.id != '') {
      this.showRoleSelectionDialog().subscribe
        (
          user => {
            if (user) {
              console.log(user);
              this.updateUser(user);
            }
          }

        );
    }
    else {
      alert('Please select Office and Service')
    }
    // const dialogRef = this.dialog.open(FormIUserSelectionComponent,
    //   {height:'95%',autoFocus: false});

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log(`Dialog result: ${result}`);
    // });
  }
  private updateUser(assignmentItem) {
    if (assignmentItem) {
      let index: number;
      // if (assignmentItem.mode == 2) {
      index = this.assignedUser.findIndex(r => r.userId === assignmentItem.userId);
      if (index < 0) {
        index = this.assignedUser.length;
      }
      else if (index <= this.assignedUser.length - 1) {
        alert('User already exists.')
      }
      assignmentItem.officeCode = this.formIAccessValues.office.code;
      assignmentItem.officeDescription = this.formIAccessValues.office.description;
      assignmentItem.serviceCode = this.formIAccessValues.service.code;
      assignmentItem.serviceDescription = this.formIAccessValues.service.description;
      this.assignedUser.splice(index, 1, assignmentItem);

      this.myTable.renderRows();
      //this.dataSource=new MatTableDataSource(assignmentItem);
    }   
  }
  onDeleteRole(deletedItem) {
    if (deletedItem && deletedItem.userId) {
      let index = this.assignedUser.findIndex(r => r.userId == deletedItem.userId);
      if (index >= 0) {
        this.assignedUser.splice(index, 1);
        this.myTable.renderRows();
      }
    }
  }
  public showRoleSelectionDialog(roleAssignmentInput?): Observable<IUser> {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    // let roleAssignmentDetails: EditableRoleAssignmentItem;
    // if (roleAssignmentInput) {
    //   roleAssignmentDetails = this.getEditableRoleAssignmentItem(2, roleAssignmentInput);
    // }
    // else {
    //   roleAssignmentDetails = this.getEditableRoleAssignmentItem(1);
    // }

    // if (roleAssignmentDetails) {
    //   dialogConfig.data = roleAssignmentDetails;
    // const dialogRef = this.dialog.open(UserRoleAssignmentSelectionComponent, dialogConfig);
    const dialogRef = this.dialog.open(FormIUserSelectionComponent);
    return dialogRef.afterClosed();
    // }
  }
  onSaveData() {
    if (localStorage.getItem('loginuser')) {
      let loginUser = JSON.parse(localStorage.getItem('loginuser'));
      this.formIServiceDelegationValue.authorizeUserId = loginUser.id;
    }
    this.formIServiceDelegationValue.effectiveFrom = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
    this.formIServiceDelegationValue.id = uuid();
    this.formIServiceDelegationValue.isActive = true;
    this.formIServiceDelegationValue.officeId = this.formIAccessValues.office.id;
    this.formIServiceDelegationValue.serviceId = this.formIAccessValues.service.id;
    //console.log(this.formIServiceDelegationValue);
    //console.log(this.formIAccessValues.service);
    let res = this.assignedUser.reduce(function (s, a) {
      s.push({ userUId: a.id, userId: a.userId, firstName: a.userFirstName, lastName: a.userLastName });
      return s;
    }, [])
    // console.log(res);
    this.formIServiceDelegationValue['userMapping'] = res;
    // console.log(this.formIServiceDelegationValue);

    this.rtps.createServiceDlegation(this.formIServiceDelegationValue)
      .subscribe(newServiceMaster => {
        alert('New Form (I) Service Delegation created successfully');
        //this.router.navigateByUrl('roleservice/svcmasterlist');
      }, (error: AppError) => {
        if (error instanceof BadInput) {
        }
        else throw error;
      });
  }
  onResetData() {
    this.assignedUser.splice(0);
    this.myTable.renderRows();
    this.formIAccessValues = {
      office: {
        id: '',
        code: '',
        description: ''
      },
      service: {
        id: '',
        code: '',
        description: ''
      }
    }
  }

}
