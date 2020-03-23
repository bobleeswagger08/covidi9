import { Component, OnInit, Input, Output, EventEmitter, DoCheck } from '@angular/core';
import { MasterListItem } from 'app/model/master-list-item';

@Component({
  selector: 'app-selection-list',
  templateUrl: './selection-list.component.html',
  styleUrls: ['./selection-list.component.scss']
})
export class SelectionListComponent implements DoCheck, OnInit {


  @Input() sourceList: MasterListItem[];
  @Input('restricted-items') restrictedItems: MasterListItem[]; // ** not fully implemented
  @Input() shortLabel: string;
  @Input('disabled') isDisabled: boolean = false;
  @Input() selectedId: string;
  //@Output() selectedItem: any;
  @Output() itemSelectionChanged: EventEmitter<MasterListItemSelectionChanged> = new EventEmitter();

  lastInputList: MasterListItem[];
  selectedItem: MasterListItem;
  lastSelectedItem: MasterListItem = null;

  IsEnabled = () => (this.sourceList && this.sourceList.length > 0);
  IsDisabled = () => this.isDisabled || (!this.IsEnabled);
  activeMastersList(): MasterListItem[] {
    var list: MasterListItem[] = [];
    if (this.sourceList) {
      this.sourceList.forEach(a => {
        if (a.IsActive) {// only add active items in list
          list.push(a);
        }
      });
    }
    return list;
  };

  selectedInActiveMasters: MasterListItem[]; // in case the parent component wants to select a master which is disabled
  lastSelectedId: string;

  constructor() {
    this.lastSelectedId = "";
    this.selectedId = "";
  }

  ngOnInit() {
  }

  onSelectionChange(eventParam: any) {
    let newItem: MasterListItem;
    this.selectedId = null;
    let lastId = this.lastSelectedId
    if (eventParam && eventParam.value) {
      newItem = eventParam.value;
      this.selectedId = this.selectedItem.Id;
    }

    if (!(this.selectedId === this.lastSelectedId)) {
      this.lastSelectedId = this.selectedId;
      let changedEventData = new MasterListItemSelectionChanged();
      changedEventData.currentSelection = this.selectedItem;
      changedEventData.newSelection = newItem;
     // changedEventData.restrictChange = false;
      this.itemSelectionChanged.emit(changedEventData);
      // if (changedEventData.restrictChange) {
      //   // roleback to last selection
      //   this.setListItem(lastId);
      // }
    }
  }


  ngDoCheck() {
    //console.log("OnDoCheck");
    if (!(this.lastSelectedId === this.selectedId)) {
      this.lastSelectedId = this.selectedId;
      this.setListItem(this.selectedId);
    }

    if (this.sourceList) {
      if (!(this.sourceList === this.lastInputList)) {
        this.lastInputList = this.sourceList;
        this.setListItem(this.lastSelectedId);
      }
    }
  }

  canSelectItem(currentItem: MasterListItem) {
    let selectable = true;
    if (currentItem) {
      if (!currentItem.IsActive) {
        selectable = false;
      }
      else {
        if (this.restrictedItems) {
          if (this.restrictedItems.find(i => i.Id === currentItem.Id)) {
            selectable = false;
          }
        }
      }
    }
    else {
      selectable = false;
    }
    return selectable;
  }

  setListItem(newItemId: string) {
    let newItem: MasterListItem;
    this.selectedInActiveMasters = []; // clear previous selection of inactive master
    if (newItemId && this.sourceList) {
      for (let i = 0; i < this.sourceList.length; i++) {
        if (this.sourceList[i].Id == newItemId) {
          newItem = this.sourceList[i];
          if (!newItem.IsActive) {
            this.selectedInActiveMasters.push(newItem);
          }
          break;
        }
      }
    }
    //this.lastSelectedItem= this.selectedItem;
    this.selectedItem = newItem;
  }
}

export class MasterListItemSelectionChanged {
  newSelection: MasterListItem;
  currentSelection: MasterListItem;
  //restrictChange: boolean; // this does not work - to be revisited
}