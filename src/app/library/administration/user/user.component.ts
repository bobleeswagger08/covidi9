import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { ConfigurationService } from 'app/services/config/configuration.service';
import { ActivatedRoute, Router } from '@angular/router';
import { v4 as uuid } from 'uuid';
import { AppError } from 'app/shared/commonerror/app-error';
import { BadInput } from 'app/shared/commonerror/bad-input';
import { MatButton } from '@angular/material';
import { ConfigurationlistService } from 'app/services/config/configurationlist.service';
import { IListUser } from 'app/model/user';
import { ApplicationEnvironmentService } from 'app/services/application-environment/application-environment.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  @ViewChild(MatButton, {static: false}) submitButton: MatButton;
  userForm: FormGroup;
  id:string;
  listUser: IListUser[];
  constructor(private config:ConfigurationService,private configlist:ConfigurationlistService,private route: ActivatedRoute, private router: Router, private appEnvService : ApplicationEnvironmentService) { }

  ngOnInit() {
   // console.log("initializing view");
    let password = new FormControl('', Validators.required);
    let confirmPassword = new FormControl('', CustomValidators.equalTo(password));
    this.id = this.route.snapshot.paramMap.get('id');
    const userId = new FormControl('',[Validators.required,Validators.minLength(4),Validators.maxLength(10)]);
    this.userForm = new FormGroup({
      id: new FormControl(uuid()),
      createSessionId:new FormControl('00000002-0000-0000-0000-000000000000'),
      updateSessionId:new FormControl('00000002-0000-0000-0000-000000000000'),
      userId:userId,
      code:new FormControl(''),
      userFirstName:new FormControl('',Validators.required),
      userLastName:new FormControl('',Validators.required),
      userMobile: new FormControl('',  [CustomValidators.phone('IN')]),
      userEmail: new FormControl('', [Validators.required]),
      password: password,
      confirmpassword: confirmPassword,
      passwordHint: new FormControl('abc'),
      isActive: new FormControl(true, (control: FormControl) => {
        const isActive = control.value;
        if (!isActive) {
          return { isActive: true }
        }
        return null;
      }),
     isLocked: new FormControl(false),
     isBlocked: new FormControl(false),
     isExternal: new FormControl(false)
    });
    if (this.id && this.id != 'null') {
      this.configlist.getUserById(this.id)
        .subscribe(userItem => {
          this.userForm.setValue({
              id: this.id,
              createSessionId:userItem.createSessionId,
              updateSessionId:userItem.updateSessionId,
              code:userItem.code,
              userId:userItem.userId,
              userFirstName:userItem.userFirstName,
              userLastName:userItem.userLastName,
              userMobile:userItem.userMobile,
              userEmail: userItem.userEmail,
              password:userItem.password+'********',
              confirmpassword: userItem.password+'********',
              passwordHint:userItem.passwordHint,
              isActive: userItem.isActive,
              isLocked: userItem.isLocked,
              isBlocked: userItem.isLocked,
              isExternal: userItem.isLocked
          })
          //this.userForm.controls['code'].disable();
          this.userForm.controls['userId'].disable();
        });
    }
    // else{
    //   this.userForm.reset();
    // }
  }
  signup() {
   
    const signupData = this.userForm.getRawValue();
    signupData.code = signupData.userId;
  //  console.log(signupData);
    this.config.createUser(signupData)
      .subscribe(user => {
        alert('User Created  sucessfully')
        this.router.navigate(['administration/userlist']);
      }, (error: AppError) => {
        if (error instanceof BadInput) {
          alert('invalid data');
        }
        else throw error;
      });

    this.submitButton.disabled = true;
  }
  update(){
    const userUpdateData = this.userForm.getRawValue();
    // console.log(userUpdateData);
    this.config.updateUser(userUpdateData)
      .subscribe(user => {
        alert('User Detail updated successfully');
      }, (error: AppError) => {
        if (error instanceof BadInput) {
          alert('invalid data');
        }
        else throw error;
      });
    this.submitButton.disabled = true;
  }
}
