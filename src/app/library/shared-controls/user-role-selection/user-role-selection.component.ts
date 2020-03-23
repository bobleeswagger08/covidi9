import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MasterListItem } from 'app/model/master-list-item';
import { MasterListItemSelectionChanged } from '../selection-list/selection-list.component';
import { ConfigurationlistService } from 'app/services/config/configurationlist.service';

@Component({
  selector: 'app-user-role-selection',
 // templateUrl: '../selection-list/selection-list.component.html' , 
  templateUrl: './user-role-selection.component.html',
  styleUrls: ['./user-role-selection.component.scss']
})
export class UserRoleSelectionComponent implements OnInit {
  @Input('disabled') isDisabled: boolean;
  @Input('selected-role') roleInput : string;
  
  @Output('role-selection-changed') roleChanged: EventEmitter<MasterListItemSelectionChanged> = new EventEmitter();
  userRoleList: MasterListItem[] = [];
  selectedRoleId: string;
  constructor(private configListService: ConfigurationlistService) {
    this.getUserRoleList();
   }

  ngOnInit() {
    //this.getUserRoleList();
  }

  private getUserRoleList() {
    this.userRoleList = null;
    this.configListService.getUserRoles(true, false)
      .subscribe(result => {
        this.userRoleList = result;
      });

  }

  onRoleSelectionChanged(eventParam: MasterListItemSelectionChanged) {
    let selectedItem: MasterListItem;
    this.selectedRoleId = null;
    //this.selectedRole = null;
    if (eventParam) {
     
      this.roleChanged.emit(eventParam);
      // if(!eventParam.restrictChange)
      {
        selectedItem = eventParam.newSelection;
        // this.selectedRole = selectedItem;
        this.selectedRoleId = selectedItem.Id;
      }
    }
  }
}
