import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MasterListItem } from 'app/model/master-list-item';
import { IRoleAssignmentDetails, AdminModuleService, IRoleAssignmentInputItem, EditableRoleAssignmentItem, UserRoleAssignment } from '../../../services/admin-module/admin-module.service';
import { Observable } from 'rxjs';
import { UserRoleAssignmentSelectionComponent } from '../user-role-assignment-selection/user-role-assignment-selection.component';
import { MatDialogConfig, MatDialog, MatTable } from '@angular/material';
import { MasterListItemSelectionChanged } from '../../shared-controls/selection-list/selection-list.component';
import { ConfigurationlistService } from 'app/services/config/configurationlist.service';

@Component({
  selector: 'app-user-role-assignment',
  templateUrl: './user-role-assignment.component.html',
  styleUrls: ['./user-role-assignment.component.scss']
})
export class UserRoleAssignmentComponent implements OnInit {
  @ViewChild(MatTable, { static: false }) myTable: MatTable<IRoleAssignmentInputItem>;
  systemDate: Date;

  effectiveDate: Date=new Date();
  selectedUserItem: MasterListItem;
 // userRoleAssignment: UserRoleAssignment;
  selectedDate:Date;

  assignedRoles: IRoleAssignmentInputItem[] = [];
  displayedColumns: string[] = ['description', 'startsOn', 'expiresOn', 'action'];
  userRoles: MasterListItem[];

  constructor(private configListService: ConfigurationlistService
    , private adminModuleService: AdminModuleService
    , private dialog: MatDialog
    , private cdr: ChangeDetectorRef
    ) {
    this.systemDate = new Date();
  }

  ngOnInit() {
    this.configListService.getUserRoles(true, false)
      .subscribe(newMasterList => {
        this.userRoles = newMasterList;
      });
  }

  dateChanged(eventType: string, eventData: any) {
    console.log(eventData);
    let newDate: Date = eventData.value;
    if (this.effectiveDate != newDate) {
      // alert("Date selection changed to " + newDate);
      this.effectiveDate = newDate;
      this.masterSelectionChanged();
    }
  }

  onDeleteRole(eventData: IRoleAssignmentInputItem) {
    if (eventData && eventData.roleId) {
      let index = this.assignedRoles.findIndex(r => r.roleId == eventData.roleId);
      if (index >= 0) {
        this.assignedRoles.splice(index, 1);
        this.myTable.renderRows();
      }
    }
  }

  onUpdateRole(eventData: IRoleAssignmentInputItem) {
    if (eventData && eventData.roleId) {
      let index = this.assignedRoles.findIndex(r => r.roleId == eventData.roleId);
      if (index >= 0) {
        this.showRoleSelectionDialog(eventData).subscribe
          (
            role => {
              if (role) {
                this.updateRole(role);
              }
            }
          )
      }
    }
  }

  masterSelectionChanged() {
    if (this.selectedUserItem) {
      this.reloadData(this.selectedUserItem.Id, this.effectiveDate);
    }
  }

  reloadData(userId: string, effectiveDate: Date) {
    this.adminModuleService.getUserRoleAssignment(userId, effectiveDate).subscribe
      (
        r => {
          //this.userRoleAssignment = r;
          this.updateAssignmentData(r);
          this.cdr.detectChanges();
        }
      );
  }

  updateAssignmentData(roleAssignmentData: IRoleAssignmentDetails[]) {
    if(roleAssignmentData)
    {
    this.assignedRoles = roleAssignmentData;
    }
    else
    {
      this.assignedRoles=[];
    }

    this.myTable.renderRows();
  }
  canSave(): boolean {
    return false;
  }

  public onAddRole() {
    this.showRoleSelectionDialog().subscribe
      (
        role => {
          if (role) {
            this.updateRole(role);
          }
        }

      )
  }

  private updateRole(assignmentItem: EditableRoleAssignmentItem) {
    if (assignmentItem) {
      let index: number;
      // if (assignmentItem.mode == 2) {
      index = this.assignedRoles.findIndex(r => r.roleId === assignmentItem.roleId);
      if (index < 0) {
        index = this.assignedRoles.length;
      }

      this.assignedRoles.splice(index, 1, assignmentItem);
      this.myTable.renderRows();
    }
  }

  public showRoleSelectionDialog(roleAssignmentInput?: IRoleAssignmentInputItem): Observable<EditableRoleAssignmentItem> {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    let roleAssignmentDetails: EditableRoleAssignmentItem;
    if (roleAssignmentInput) {
      roleAssignmentDetails = this.getEditableRoleAssignmentItem(2, roleAssignmentInput);
    }
    else {
      roleAssignmentDetails = this.getEditableRoleAssignmentItem(1);
    }

    if (roleAssignmentDetails) {
      dialogConfig.data = roleAssignmentDetails;
      const dialogRef = this.dialog.open(UserRoleAssignmentSelectionComponent, dialogConfig);

      return dialogRef.afterClosed();
    }
  }

  getEditableRoleAssignmentItem(mode: number, currentRole?: IRoleAssignmentDetails): EditableRoleAssignmentItem {
    let item: EditableRoleAssignmentItem = new EditableRoleAssignmentItem();
    if (this.assignedRoles) {
      for (let assignedRole of this.assignedRoles) {
        item.existingRoles.push(assignedRole.roleId);
      }
    }

    if (mode == 2) {
      if (!currentRole) {
        console.debug("Select role assignment to edit");
        alert("No item selected to edit");
        item = null;
      }
      else {
        item.mode = 2;
        item.description = currentRole.description;
        item.expiresOn = currentRole.expiresOn;
        item.startsOn = currentRole.startsOn;
        item.roleId = currentRole.roleId;
      }
    }
    else {
      item.mode = 1;
      item.startsOn = this.effectiveDate;
    }
    return item;

  }

  onSaveData() {
   let userRoleAssignment: UserRoleAssignment = new UserRoleAssignment();
   userRoleAssignment.userId = this.selectedUserItem.Id;
   userRoleAssignment.effectiveFrom=this.effectiveDate;
   userRoleAssignment.roles= this.assignedRoles;
   this.adminModuleService.saveUserRoleAssignment(userRoleAssignment).subscribe(
     r=> 
     {
       if(r)
       {
         alert('User role assignment data updated');
       }
     }
   );

  }

  onUserSelectionChanged(eventData:MasterListItemSelectionChanged)
  {
      if (eventData && eventData.newSelection) {
        const newItem = eventData.newSelection;
        this.selectedUserItem = newItem;
      }
      else
      {
        this.selectedUserItem = null;
      }
  }


  isValidData(): boolean {
    let result: boolean = false;
    result = this.selectedUserItem && this.effectiveDate && this.assignedRoles && this.assignedRoles.length > 0;
    return result;

  }

}


