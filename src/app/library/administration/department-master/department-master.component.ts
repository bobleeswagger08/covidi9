import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ConfigurationlistService } from 'app/services/config/configurationlist.service';
import { IOfficeListParent } from 'app/model/office';
import { ConfigurationService } from 'app/services/config/configuration.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AppError } from 'app/shared/commonerror/app-error';
import { BadInput } from 'app/shared/commonerror/bad-input';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-department-master',
  templateUrl: './department-master.component.html',
  styleUrls: ['./department-master.component.scss']
})
export class DepartmentMasterComponent implements OnInit {

  departmentUnitForm: FormGroup;
  listParent: IOfficeListParent[];
  selectedParent: any[];
  id: string;

  constructor(private route: ActivatedRoute, private configlist: ConfigurationlistService, private config: ConfigurationService, private router: Router, private fb: FormBuilder, private cdr: ChangeDetectorRef) { }


  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');

    this.departmentUnitForm = this.fb.group({
      id: new FormControl(uuid()),
      code: new FormControl('', [
        Validators.required
      ]),
      organizations: new FormControl('', [
        Validators.required
      ]),
      note: new FormControl('', [
        // Validators.required
      ]),
      description: new FormControl('', [
        Validators.required
      ]),
      isActive: new FormControl(true),
      // isActive: new FormControl(true, (control: FormControl) => {
      //   const isActive = control.value;
      //   if (!isActive) {
      //     return { isActive: true }
      //   }
      //   return null;
      // }),
      isInternal: new FormControl(false)
    });

    this.getParentList();

    if (this.id && this.id != 'null') {
      this.configlist.getDepartmentById(this.id)
        .subscribe(deptItem => {
          let arrayList = deptItem.organizations.map(ao => ao.organizationUnitId);
          this.departmentUnitForm.setValue({
            id: this.id,
            code: deptItem.code,
            note: deptItem.note,
            description: deptItem.description,
            isActive: deptItem.isActive,
            isInternal: deptItem.isInternal,
            organizations: arrayList

          })
          // this.departmentUnitForm.controls['code'].disable();
        });
    }
  }
  getParentList() {
    this.configlist.getOrganisationalList()
      .subscribe(parentList => {
        this.listParent = parentList;
        //  console.log(this.listParent)
        this.cdr.detectChanges();
      });
  }

  CreateDepartment(departmentUnitForm) {

    var arr = departmentUnitForm.organizations;
    var res = arr.reduce(function (s, a) {
      s.push({ organizationUnitId: a });
      return s;
    }, [])
    console.log(res);
    departmentUnitForm["organizations"] = res;

    this.config.createDepartment(departmentUnitForm)
      .subscribe(deptUnitValue => {
        alert('Department Created successfully')
        this.router.navigate(['administration/departmentlist']);
      }, (error: AppError) => {
        if (error instanceof BadInput) {
          alert('invalid data');
        }
        else throw error;
      });
  }

  goToDepartmentListPage() {
    this.router.navigateByUrl('administration/departmentlist');
  }
  UpdateDepartment(departmentUnitForm) {
    var arr = departmentUnitForm.organizations;
    var res = arr.reduce(function (s, a) {
      s.push({ organizationUnitId: a });
      return s;
    }, [])
    console.log(res);
    departmentUnitForm["organizations"] = res;
    // console.log()

    this.config.UpdateDepartment(departmentUnitForm)
      .subscribe(deptUnitValue => {
        alert('Department Updated successfully')
        this.router.navigate(['administration/departmentlist']);
      }, (error: AppError) => {
        if (error instanceof BadInput) {
          alert('invalid data');
        }
        else throw error;
      });
  }

}


