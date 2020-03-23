import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { v4 as uuid } from 'uuid';
import { AppError } from 'app/shared/commonerror/app-error';
import { BadInput } from 'app/shared/commonerror/bad-input';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import { ConfigurationlistService } from '../../../services/config/configurationlist.service';
import { ConfigurationService } from '../../../services/config/configuration.service';
import { IOfficeListParent } from '../../../model/office'

@Component({
  selector: 'app-office',
  templateUrl: './office.component.html',
  styleUrls: ['./office.component.scss']
})
export class OfficeComponent implements OnInit {
  
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  organizationUnitForm: FormGroup;
  listParent: IOfficeListParent[];
  selectedParent: any[];
  Id: string;
  @ViewChild('dialogMatSelect', { static: true }) dialogMatSelect;
 

  constructor(private dialog: MatDialog,private configlist:ConfigurationlistService,private config:ConfigurationService, private route: ActivatedRoute, private router: Router) {
   
  }
  

  ngOnInit() {
    this.Id = this.route.snapshot.paramMap.get('Id');

    this.organizationUnitForm = new FormGroup({
      id: new FormControl(uuid()),
      code: new FormControl('', [
        Validators.required
      ]),
      note: new FormControl('', [
        Validators.required
      ]),
      description: new FormControl('', [
        Validators.required
      ]),
      isActive: new FormControl(true),
      parentUnitId: new FormControl('', [
        Validators.required
      ])
    });

    this.organizationUnitForm.reset(this.organizationUnitForm.value);

    this.getParentList();

    

    this.organizationUnitForm.controls['code'].enable();

    if (this.Id && this.Id != 'null') {
      this.configlist.getOrganisationalList(this.Id)
        .subscribe(parentList => {

          this.organizationUnitForm.setValue({
            id: this.Id,
            code: parentList.code,
            note: parentList.note,
            description: parentList.description,
            isActive: parentList.isActive,
            parentUnitId: parentList.parentUnitId
          })
          this.organizationUnitForm.controls['code'].disable();
        });
    }
    // console.log(this.listParent);
  }

 

  onContentChanged() { }

  onSelectionChanged() { }

  goToListPage() {
    this.router.navigateByUrl('administration/officelist');
  }

  getParentList() {
    this.configlist.getOrganisationalList()
      .subscribe(parentList => {
        this.listParent = parentList;
       // console.log(this.listParent);
      });
  }

  submitOrganisationData(organisationalUnitData) {
    this.config.createOrganisationUnit(organisationalUnitData)
      .subscribe(orgUnitData => {
        this.router.navigate(['administration/officelist']);
      }, (error: AppError) => {
        if (error instanceof BadInput) {
          alert('invalid data');
        }
        else throw error;
      });
  }
  // selectParent(pitem){
  //   this.selectedParent=pitem;
  //   this.organizationUnitForm.controls.parentUnitId.setValue({
  //     parentUnitId: pitem.parentUnitId
  //  });
  //  this.dialog.closeAll();
  // }
  updateOrganisationData(organisationalUnitData) {
    this.config.updateOrganisationUnit(organisationalUnitData)
      .subscribe(orgUnitData => {
        this.router.navigate(['administration/officelist']);
      }, (error: AppError) => {
        if (error instanceof BadInput) {
          alert('invalid data');
        }
        else throw error;
      });
  }
  openMatSelectDialog() {
    this.dialog.open(this.dialogMatSelect);
  }
  // saveAddressData(event){

  //   console.log(event)
  // }

}
