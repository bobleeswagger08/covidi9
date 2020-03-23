import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfigurationService } from 'app/services/config/configuration.service';
import { AppError } from 'app/shared/commonerror/app-error';
import { BadInput } from 'app/shared/commonerror/bad-input';
import { MatButton } from '@angular/material';
import { ConfigurationlistService } from 'app/services/config/configurationlist.service';
import { ActivatedRoute } from '@angular/router';
import { CustomValidators } from 'ng2-validation';
import { IListUser } from 'app/model/user';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm:FormGroup;
  @ViewChild(MatButton, {static: false}) submitButton: MatButton;
  id:string;
  listUser: IListUser[];
 // toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
  constructor(private configService:ConfigurationService,private cdr: ChangeDetectorRef,private route: ActivatedRoute,private configlist:ConfigurationlistService) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    let password = new FormControl('', Validators.required);
    let confirmPassword = new FormControl('', CustomValidators.equalTo(password));
    this.changePasswordForm = new FormGroup({
      id:new FormControl('0000-0000-0000-0001'),
      userId: new FormControl('', [
        Validators.required
      ]),
      selectedUser: new FormControl('', [
        Validators.required
      ]),
      OldPassword: new FormControl('', [
        Validators.required
      ]),
      NewPassword: password,
      confirmpassword: confirmPassword
    });
    this.getUserList();
    if (this.id && this.id != 'null') {

      const suControl = this.changePasswordForm.get('selectedUser');
      suControl.clearValidators();

      this.configlist.getUserById(this.id)
        .subscribe(userItem => {
          this.changePasswordForm.setValue({
              id: this.id,
              userId:userItem.userId,
              selectedUser:'',
              OldPassword:'',
              NewPassword:'',
              confirmpassword:''
          })
          this.changePasswordForm.controls['userId'].disable();
        });
    }
    else if(this.id && this.id == 'null'){
      const opControl = this.changePasswordForm.get('OldPassword');
      opControl.clearValidators();
      
    }
   // this.formControlValueChanged();
  }
  userIdSelectionChange(value)
  {
   // console.log(value);
    this.changePasswordForm.controls['id'].setValue(value.id)
    this.changePasswordForm.controls['userId'].setValue(value.userId)
  }
//   formControlValueChanged() {
//     const idControl = this.changePasswordForm.get('id');
//     let userIdControl =  this.changePasswordForm.controls['userId'].value;
//     console.log(userIdControl);
//     console.log('kaka');
//  }
  changeUserPassword(){
    const resetPassForm = this.changePasswordForm.getRawValue();
    this.configService.changePassword(resetPassForm)
      .subscribe(user => {
       // this.router.navigate(['sessions/signin']);
       alert('User password changed successfully')
      }, (error: AppError) => {
        if (error instanceof BadInput) {
          alert('invalid data');
        }
        else throw error;
      });
      this.submitButton.disabled = true;
  }
  getUserList(){
    this.configlist.getUserList()
      .subscribe(userList => {
        this.listUser = userList;
        this.cdr.detectChanges();
      });
  }

}
