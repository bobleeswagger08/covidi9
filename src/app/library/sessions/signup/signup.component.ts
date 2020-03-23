import { Component, OnInit, ViewChild } from '@angular/core';
import { MatProgressBar, MatButton } from '@angular/material';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { v4 as uuid } from 'uuid';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomValidators } from 'ng2-validation';
import { ConfigurationService } from 'app/services/config/configuration.service';
import { AppError } from 'app/shared/commonerror/app-error';
import { BadInput } from 'app/shared/commonerror/bad-input';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  @ViewChild(MatProgressBar, {static: false}) progressBar: MatProgressBar;
  @ViewChild(MatButton, {static: false}) submitButton: MatButton;

  userForm: FormGroup
  constructor(private config:ConfigurationService,private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const password = new FormControl('', Validators.required);
    const confirmPassword = new FormControl('', CustomValidators.equalTo(password));

    this.userForm = new FormGroup({
      id: new FormControl(uuid()),
      createSessionId:new FormControl('00000002-0000-0000-0000-000000000000'),
      updateSessionId:new FormControl('00000002-0000-0000-0000-000000000000'),
      code:new FormControl('',[Validators.required,Validators.minLength(8)]),
      userId:new FormControl('',[Validators.required,Validators.minLength(4),Validators.maxLength(10)]),
      userFirstName:new FormControl('',Validators.required),
      userLastName:new FormControl('',Validators.required),
      userMobile: new FormControl('',  [CustomValidators.phone('IN'),Validators.required]),
      userEmail: new FormControl('', [Validators.required, Validators.email]),
      password: password,
      //confirmPassword: confirmPassword,
      passwordHint: new FormControl('',[ 
        Validators.minLength(2),
        Validators.maxLength(8),
        Validators.required
     ]),
     isActive: new FormControl(true),
     isLocked: new FormControl(false),
     isBlocked: new FormControl(false),
     isExternal: new FormControl(false)
    //  ,
    //   agreed: new FormControl('', (control: FormControl) => {
    //     const agreed = control.value;
    //     if(!agreed) {
    //       return { agreed: true }
    //     }
    //     return null;
    //   })
    })
  }

  signup() {
    const signupData = this.userForm.value;
    console.log(signupData);
    this.config.createUser(signupData)
      .subscribe(user => {
        this.router.navigate(['sessions/signin']);
      }, (error: AppError) => {
        if (error instanceof BadInput) {
          alert('invalid data');
        }
        else throw error;
      });

    this.submitButton.disabled = true;
    this.progressBar.mode = 'indeterminate';
  }

}
