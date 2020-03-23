import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { EditableRoleAssignmentItem } from '../../../services/admin-module/admin-module.service';
import { MasterListItem } from 'app/model/master-list-item';
import { MasterListItemSelectionChanged } from '../../shared-controls/selection-list/selection-list.component';

@Component({
  selector: 'app-user-role-assignment-selection',
  templateUrl: './user-role-assignment-selection.component.html',
  styleUrls: ['./user-role-assignment-selection.component.scss']
})
export class UserRoleAssignmentSelectionComponent implements OnInit {

  selectedRoleItem: MasterListItem;
  allowChangingRole: boolean = true;
  submitCaption: string;
  selectedRole: string;
  startsOnDate: Date;
  expiresOnDate: Date;

  constructor(public dialogRef: MatDialogRef<UserRoleAssignmentSelectionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EditableRoleAssignmentItem) {
    this.startsOnDate = data.startsOn;
    if (data.mode == 2) {
      this.submitCaption = "Update";
      this.expiresOnDate = data.expiresOn;
      this.allowChangingRole = false;
      this.selectedRole = data.roleId;
    }
    else {
      this.submitCaption = "Add";
    }
  }



  closeButtonClicked(result: boolean) {
    if (result) {
      if (!this.selectedRole) {
        alert('Please select a role');
        return;
      }
      if (this.data.mode == 1 && this.data.existingRoles) {
        if (this.data.existingRoles.find(r => r == this.selectedRole)) {
          alert('The selected role already exists for the user, please select another role');
          return;
        }
      }
    

    if (this.expiresOnDate && this.startsOnDate > this.expiresOnDate) {
      alert('Expires on date should be equal or higher than start date');
      return;
    }
    if (this.selectedRoleItem) {
      this.data.description = this.selectedRoleItem.Description;
      this.data.roleId = this.selectedRoleItem.Id;
    }
    this.data.startsOn = this.startsOnDate;
    this.data.expiresOn = this.expiresOnDate;

  }
    else {
  this.data = null;
}
this.dialogRef.close(this.data);
  }

ngOnInit() {
}

roleChanged(eventData: MasterListItemSelectionChanged) {
  if (eventData && eventData.newSelection) {
    const newItem = eventData.newSelection;
    // if (this.data.existingRoles) {
    //   if (this.data.existingRoles.find(r => r == newItem.Id)) {
    //     alert('The selected role already exists for the user');
    //    eventData.restrictChange=true;
    //     return;
    //   }
    // }

    this.selectedRoleItem = newItem;
    this.selectedRole = newItem.Id;
  }
}

}


