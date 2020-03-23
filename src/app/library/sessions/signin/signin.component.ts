import { Component, OnInit, ViewChild } from '@angular/core';
import { MatProgressBar, MatButton } from '@angular/material';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { SignInUser } from '../../../model/user'
import { ConfigurationService } from 'app/services/config/configuration.service';
import { ApplicationEnvironmentService } from 'app/services/application-environment/application-environment.service';
import { AppError } from 'app/shared/commonerror/app-error';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  @ViewChild(MatProgressBar, { static: false }) progressBar: MatProgressBar;
  @ViewChild(MatButton, { static: false }) submitButton: MatButton;

  signinForm: FormGroup;
  signinUser: SignInUser;
  ipAddress:string;

  constructor(private router: Router, private config: ConfigurationService,private appEnvService: ApplicationEnvironmentService) { }

  ngOnInit() {
    
    this.signinForm = new FormGroup({
      userId: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      //rememberMe: new FormControl(false)
      isBackgroundUser:new FormControl(false),
      actualUserId:new FormControl(''),
      systemIP:new FormControl('')
    })
    this.getIPAddress();
  }
  getIPAddress()
  {
    this.config.getIPAddress().subscribe((res:any)=>{
      this.ipAddress = res.ip;
      this.signinForm.controls['systemIP'].setValue(this.ipAddress);
    });
  }
  signin() {
    //this.router.navigate(['address/newaddress']);
    this.appEnvService.userSession.resetSession();
    const signinData = this.signinForm.getRawValue();
    this.config.signInUser(signinData)
      .subscribe(signInData => {
        let result = signInData;
        
        if (result.userSession && result.status === 1) {
        
          this.appEnvService.userSession.registerLoggedInUser(result.userSession);
         
          this.router.navigate(['others/blank']);
          return true;
        }
        alert(result.errorMessage);
        this.router.navigate(['/']);
      },(error: AppError) => {
       alert('Something went wrong with the server,please try after some time.')
       this.router.navigate(['/']);
      });

    this.submitButton.disabled = true;
    this.progressBar.mode = 'indeterminate';
  }

}
