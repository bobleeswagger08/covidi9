import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ConfigurationlistService } from 'app/services/config/configurationlist.service';
import { v4 as uuid } from 'uuid';
import { ConfigurationService } from 'app/services/config/configuration.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AppError } from 'app/shared/commonerror/app-error';
import { BadInput } from 'app/shared/commonerror/bad-input';
import { ICategories } from 'app/model/rolemaster';

@Component({
  selector: 'app-role-master',
  templateUrl: './role-master.component.html',
  styleUrls: ['./role-master.component.scss']
})
export class RoleMasterComponent implements OnInit {
  roleMasterForm: FormGroup;
  listCategory: ICategories;
  id: string;
  constructor(private configlist: ConfigurationlistService, private route: ActivatedRoute, private config: ConfigurationService, private cdr: ChangeDetectorRef, private router: Router) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.roleMasterForm = new FormGroup({
      id: new FormControl(uuid()),
      code: new FormControl('', [
        Validators.required
      ]),
      note: new FormControl('', [
        Validators.required
      ]),
      roleCategory: new FormControl('', [
        Validators.required
      ]),
      description: new FormControl('', [
        Validators.required
      ]),
      isActive: new FormControl(true),
      isInternal:new FormControl(true)

    });
    this.getRoleCategory();
    if (this.id && this.id != 'null') {
      this.configlist.getRoleMasterById(this.id)
        .subscribe(roleMasterItem => {
          this.roleMasterForm.setValue({
            id: this.id,
            code: roleMasterItem.code,
            description:roleMasterItem.description,
            roleCategory:roleMasterItem.roleCategory,
            note: roleMasterItem.note,
            isActive: roleMasterItem.isActive,
            isInternal:roleMasterItem.isInternal
          })
          this.roleMasterForm.controls['code'].disable();
        });
    }
  }
  onContentChanged() { }

  onSelectionChanged() { }

  getRoleCategory() {
    this.configlist.getRoleCategories()
      .subscribe(listcatry => {
        this.listCategory = listcatry
        this.cdr.detectChanges();
      });
  }
  CreateRoleMaster(userRoleMasterForm) {
    this.config.createUserRoleMaster(userRoleMasterForm)
      .subscribe(newUserRoleMaster => {
        alert('New User Role Master created successfully');
        this.router.navigateByUrl('administration/rolemasterlist');
      }, (error: AppError) => {
        if (error instanceof BadInput) {
        }
        else throw error;
      });
  }
  UpdateRoleMaster(userRoleMasterForm) {
    this.config.updateUserRoleMaster(userRoleMasterForm)
      .subscribe(newUserRoleMaster => {
        alert('User Role Master updated successfully');
        this.router.navigateByUrl('administration/rolemasterlist');
      }, (error: AppError) => {
        if (error instanceof BadInput) {
        }
        else throw error;
      });
  }

}
