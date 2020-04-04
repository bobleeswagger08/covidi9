import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ApplicationEnvironmentService } from 'app/services/application-environment/application-environment.service';
import { CovidI9Service } from '../services/covid-i9.service';
import { UphcOffice } from '../model/candidate-input';
import { UserAuthorization } from 'app/services/application-user/application-user.service';

@Component({
  selector: 'app-uphc-filtered-list',
  templateUrl: './uphc-filtered-list.component.html',
  styleUrls: ['./uphc-filtered-list.component.scss']
})
export class UphcFilteredListComponent implements OnInit {
  @Input("functionality-id") functionalityId: number;
  @Input("access-id") accessId: number;
  @Input("disable-default-set") disableDefault: boolean;

  @Input() get uphclist(){
    return this.selectedItems;
  }

  set uphclist(val) {
    this.selectedItems = val;
    this.uphclistChange.emit(this.selectedItems);
  }
   
  @Output() uphclistChange = new EventEmitter<string[]>();
  @Output("on-data-loaded") dataLoadComplete = new EventEmitter<boolean>();

  selectedItems : string[] =[];
  userAuthorization: UserAuthorization;
  constructor(private appEnvironmentServie: ApplicationEnvironmentService, private covid19Service: CovidI9Service) {
    this.userAuthorization = new UserAuthorization(this.functionalityId, this.appEnvironmentServie.userSession);
    this.officeList = this.getOfficeList();
  }

  originalUphcList: UphcOffice[] = [];
  filteredList: UphcOffice[] = [];
  officeList: string[];
  selectedUphc: string[];
  ngOnInit() {
    this.userAuthorization = new UserAuthorization(this.functionalityId, this.appEnvironmentServie.userSession);
    this.officeList = this.getOfficeList();
    this.getUpscList();
  }

  getUpscList() {
    this.covid19Service.getUpscOfficeList()
      .subscribe(
        r => {
          this.originalUphcList = r;
          this.filterUphcAccess();
          this.setDefaultSelection();
          this.dataLoadComplete.emit(true);
        }
      )
  }

  private filterUphcAccess() {
    this.filteredList = [];
    // filter list by users office
    if (this.originalUphcList && this.officeList) {
      for (let uphc of this.originalUphcList) {
        if (this.officeList.find(o => o === uphc.organizationId)) {
          this.filteredList.push(uphc);
        }
      }
    }
  }

  private setDefaultSelection() {
    if (!this.disableDefault) {
      this.selectedItems = [];
      if (this.filteredList) {
        for (let uphc of this.filteredList) {
          this.selectedItems.push(uphc.uphc);
        }
      }
      this.whenSelectionChanged(null);
    }
  }

  private getOfficeList(): string[] {
    let officeList: string[] = [];
    let permittedOffices = this.userAuthorization.getOffices(this.accessId);
    if (permittedOffices) {
      for (let office of permittedOffices) {
        officeList.push(office.officeId);
      }
    }
    return officeList;
  }

  whenSelectionChanged(event : any)
  {
    this.uphclistChange.emit(this.selectedItems);
  }
  // updateValue(value) {
  //   this.selectedItems = value;
  //   this.selectedItems.emit(value);
  // }
}
