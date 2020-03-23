import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MasterListItem } from 'app/model/master-list-item';
import { MasterListItemSelectionChanged } from '../selection-list/selection-list.component';
import { ConfigurationlistService } from 'app/services/config/configurationlist.service';

@Component({
  selector: 'app-user-selection',
  templateUrl: './user-selection.component.html',
  styleUrls: ['./user-selection.component.scss']
})
export class UserSelectionComponent implements OnInit {
  //  @Output ("selected-user") selectedUser : MasterListItem = new MasterListItem();
  //  @Output ("selected-user-id") selectedUserId: string="";
  @Output('user-selection-changed') userChanged: EventEmitter<MasterListItemSelectionChanged> = new EventEmitter();
  selectedUser: MasterListItem = new MasterListItem();
  selectedUserId: string = "";

  userList: MasterListItem[] = [];
  lastSelectedUserId: string;
  constructor(private configListService: ConfigurationlistService) { }

  ngOnInit() {
    this.getUserList();
  }

  private getUserList() {
    this.userList = null;
    this.configListService.getUserList()
      .subscribe(result => {
        this.userList = result;
      });

  }

  onUserSelectionChanged(eventParam: MasterListItemSelectionChanged) {
    this.selectedUser = null;
    this.selectedUserId = null;
    if (eventParam && eventParam.newSelection) {
      this.selectedUser = eventParam.newSelection;
      this.selectedUserId = this.selectedUser.Id;
    }

    if (!(this.selectedUserId === this.lastSelectedUserId)) {
      this.lastSelectedUserId = this.selectedUserId;
      this.userChanged.emit(eventParam);
    }
  }


}
