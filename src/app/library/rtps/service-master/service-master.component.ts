import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { RtpsService } from '../services/rtps/rtps.service';
import { IWorkingDayUnit, IDepartmentValues, IAuthorisedOfficer,IDesignatedOfficer } from 'app/library/rtps/model/rtps';
import { v4 as uuid } from 'uuid';
import { ConfigurationlistService } from 'app/services/config/configurationlist.service';
import { AppError } from 'app/shared/commonerror/app-error';
import { BadInput } from 'app/shared/commonerror/bad-input';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSelectionList } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { ServiceMasterValidators } from './servicemaster.validators';
import { UserAuthorization, ApplicationUserService } from 'app/services/application-user/application-user.service';

@Component({
  selector: 'app-service-master',
  templateUrl: './service-master.component.html',
  styleUrls: ['./service-master.component.scss']
})
export class ServiceMasterComponent implements OnInit{
  serviceMasterForm: FormGroup;
  listWorkingDayUnit: IWorkingDayUnit[];
  listDepartmentValues: IDepartmentValues[];
  listAuthorisedOfficer: IAuthorisedOfficer[];
  listDesignatedOfficer:IDesignatedOfficer[];

  id: string;
  userAuthorization:UserAuthorization;

  @ViewChild(MatSelectionList,{static:true}) selectionList: MatSelectionList;
  constructor(private rtps: RtpsService,private fb: FormBuilder,private cdr: ChangeDetectorRef
    , private configlist: ConfigurationlistService, private route: ActivatedRoute, private router: Router, userService : ApplicationUserService) { 
      this.userAuthorization = new UserAuthorization(1212, userService); //TODO: should not be a hard coded value should be in global configuration service
    }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');

    this.serviceMasterForm = new FormGroup({
      id: new FormControl(uuid()),
      code: new FormControl('', [
        Validators.required,
        Validators.maxLength(4),
        ServiceMasterValidators.cannotContainSpace
      ]),
      note: new FormControl('', [
       // Validators.required
      ]),
      description: new FormControl('', [
        Validators.required
      ]),
      departmentId: new FormControl('', [
        Validators.required
      ]),
      designatedOfficerId: new FormControl('', [
        Validators.required
      ]),
      authorizeOfficers: new  FormControl('', [
        Validators.required
      ]),
      stipulatedTimeLimit: new FormControl('', [
        Validators.required,
        ServiceMasterValidators.onlyNumber
      ]),
      reminderTimeLimit: new FormControl('', [
        Validators.required,
        ServiceMasterValidators.onlyNumber
      ]),
      alertTimeLimit: new FormControl('', [
        Validators.required,
        ServiceMasterValidators.onlyNumber
      ])
      ,
      stipulatedUOMId: new FormControl('', [
        Validators.required
      ]),
      reminderUOMId: new FormControl('', [
        Validators.required
      ]),
      alertUOMId: new FormControl('', [
        Validators.required
      ]),
     // isActive: new FormControl('checked',[]),
      isActive: new FormControl(true),
      isInternal: new FormControl(false)
     // ,
     // designatedOfficerId: new FormControl('3ca1f545-9d48-4ab2-b902-b2782127b138')

    });

    this.getWDunit();
    this.getDepartmentList();
    this.getAuthorisedOfficerList();
    this.getDesignatedOfficerList();  

    if (this.id && this.id != 'null') {
      this.rtps.getServiceMasterById(this.id)
        .subscribe(svcMasterItem => {
         var arrayList = svcMasterItem.authorizeOfficers.map(ao => ao.userRoleId);
         // console.log(arrayList)
          this.serviceMasterForm.setValue({
            id: this.id,
            code: svcMasterItem.code,
            note: svcMasterItem.note,
            description: svcMasterItem.description,
            departmentId: svcMasterItem.departmentId,
            stipulatedTimeLimit: svcMasterItem.stipulatedTimeLimit,
            reminderTimeLimit: svcMasterItem.reminderTimeLimit,
            alertTimeLimit: svcMasterItem.alertTimeLimit,
            stipulatedUOMId: svcMasterItem.stipulatedUOMId,
            reminderUOMId: svcMasterItem.reminderUOMId,
            alertUOMId: svcMasterItem.alertUOMId,
            isActive: svcMasterItem.isActive,
            isInternal: svcMasterItem.isInternal,
            designatedOfficerId: svcMasterItem.designatedOfficerId,
            authorizeOfficers:arrayList
          })
          // for(let item of arrayList)
          // {
          //   this.selectionList.selectedOptions.select(arrayList);
          // }
          this.serviceMasterForm.controls['code'].disable();
          this.selectionList.selectedOptions.select(arrayList);
        });
    }
  }
  onContentChanged() { }

  onSelectionChanged() { }
  getWDunit() {
    this.rtps.getWorkingDayUnit()
      .subscribe(listwdunit => {
        this.listWorkingDayUnit = listwdunit
      });
  }
  getDepartmentList() {
    this.configlist.getDepartmentList()
      .subscribe((listdept:any[] )=> {
        this.listDepartmentValues = listdept
        this.cdr.detectChanges();
        
      });
  }
  getAuthorisedOfficerList() {
    this.configlist.getAuthorisedOfficerList()
      .subscribe(listauthoffcr => {
        this.listAuthorisedOfficer = listauthoffcr
       // console.log(this.listAuthorisedOfficer)
        this.cdr.detectChanges();
      });
  }
  getDesignatedOfficerList() {
    this.rtps.getDesignatedOfficerList()
      .subscribe(listDeshoffcr => {
        this.listDesignatedOfficer = listDeshoffcr
        this.cdr.detectChanges();
        if(this.listDesignatedOfficer.length==1){
          this.serviceMasterForm.controls['designatedOfficerId'].setValue(this.listDesignatedOfficer[0].id);
       }
      });
  }

  CreateServiceMaster(svcMasterForm) {
    // for(let item of svcMasterForm.designatedOfficerId)
    // {
    //   svcMasterForm.designatedOfficerId.clear();
    //   svcMasterForm.designatedOfficerId.push({"userId":item})
    var arr = svcMasterForm.authorizeOfficers;
    var res = arr.reduce(function(s, a){
    s.push({userRoleId: a});
    return s;
    }, [])
   // console.log(res);
    svcMasterForm["authorizeOfficers"]=res; 
   //  }
   
    this.rtps.createServiceMaster(svcMasterForm)
      .subscribe(newServiceMaster => {
        alert('New Service created successfully');
        this.router.navigateByUrl('rtps/svcmasterlist');
      }, (error: AppError) => {
        if (error instanceof BadInput) {
        }
        else throw error;
      });
  }
  UpdateServiceMaster(svcMasterForm){
    var arr = svcMasterForm.authorizeOfficers;
    var res = arr.reduce(function(s, a){
    s.push({userRoleId: a});
    return s;
    }, [])
    console.log(res);
    svcMasterForm["authorizeOfficers"]=res; 

    this.rtps.updateServiceMasterPut(svcMasterForm)
      .subscribe(updateServiceMaster => {
        alert('Service updated successfully');
        this.router.navigateByUrl('rtps/svcmasterlist');
      }, (error: AppError) => {
        if (error instanceof BadInput) {
        }
        else throw error;
      });
  }
  // goToListPage() {
  //   this.router.navigateByUrl('roleservice/svcmasterlist');
  // }


}
