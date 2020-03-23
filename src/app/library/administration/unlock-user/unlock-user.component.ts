import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
interface selectedUser{
    userid:string,
    name:string,
    lockedAt:Date
}
@Component({
  selector: 'app-unlock-user',
  templateUrl: './unlock-user.component.html',
  styleUrls: ['./unlock-user.component.scss']
})
export class UnlockUserComponent implements OnInit {
  lockedUserList: any[] = [
    {'userid':'1','name':'nishant prasad','lockedAt':'Wed Jan 15 2020 18:35:54 GMT+0530 (India Standard Time)'}
    ,{'userid':'2','name':'Ananata Deb','lockedAt':'Wed Jan 15 2020 18:35:54 GMT+0530 (India Standard Time)'}
  ];
  selectedUser:selectedUser;

  unlockUserForm:FormGroup;
  constructor() { }

  ngOnInit() {
      this.unlockUserForm = new FormGroup({
      userId: new FormControl('', [
        Validators.required
      ])
    });
  }
  onUserSelectionChange(lp){
      console.log(lp);
      this.selectedUser = lp.value;
  }
  unlockUser(unlockUserForm){

  }

}
