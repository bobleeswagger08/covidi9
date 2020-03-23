import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ConfigurationlistService } from 'app/services/config/configurationlist.service';
import { IListUser } from 'app/model/user';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppError } from 'app/shared/commonerror/app-error';
export interface IUser {
  userId:string;
  userName: string;
 }
@Component({
  selector: 'app-form-i-user-selection',
  templateUrl: './form-i-user-selection.component.html',
  styleUrls: ['./form-i-user-selection.component.scss']
})
export class FormIUserSelectionComponent implements OnInit {
  listUser: IListUser[];
  selectedUser:IListUser;
  constructor(public dialogRef: MatDialogRef<FormIUserSelectionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IListUser,private configlist: ConfigurationlistService,private SpinnerService: NgxSpinnerService,private cdr:ChangeDetectorRef) { }

  ngOnInit() {
    this.getUserList();
  }
  getUserList(){
    this.configlist.getUserList()
      .subscribe(userList => {
        this.listUser=userList;
       // this.dataSource=new MatTableDataSource(userList);
        //this.signalDataRequestCompletion(requestId);
       // this.dataSource.paginator = this.paginator; 
        //this.dataSource.sort = this.sort; 
        this.cdr.detectChanges();
        this.SpinnerService.hide();
      },(error: AppError) => {
        this.SpinnerService.hide();
        });
  }
  applyFilter(filterValue: string) {
    //this.getUserList();
    if(filterValue){
    this.listUser = this.listUser.filter((data)=> JSON.stringify(data.userFirstName).toLowerCase().indexOf(filterValue.toLowerCase()) !== -1)
  }
  else{
    this.getUserList();
  }
  }
  closeButtonClicked(result: boolean) {
    if (result) {
      if (!this.selectedUser) {
        alert('Please select a user');
        return;
      }
      // if (this.data.mode == 1 && this.data.existingRoles) {
      //   if (this.data.existingRoles.find(r => r == this.selectedRole)) {
      //     alert('The selected role already exists for the user, please select another role');
      //     return;
      //   }
      // }
    

    // if (this.expiresOnDate && this.startsOnDate > this.expiresOnDate) {
    //   alert('Expires on date should be equal or higher than start date');
    //   return;
    // }
    // if (this.selectedRoleItem) {
    //   this.data.description = this.selectedRoleItem.Description;
    //   this.data.roleId = this.selectedRoleItem.Id;
    // }
    this.data = this.selectedUser
    //this.data.expiresOn = this.expiresOnDate;

  }
    else {
  this.data = null;
}
this.dialogRef.close(this.data);
  }
}
