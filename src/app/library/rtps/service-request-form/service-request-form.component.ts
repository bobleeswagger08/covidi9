import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RtpsService } from '../services/rtps/rtps.service';
import { IServiceMaster } from 'app/library/rtps/model/rtps';
import { v4 as uuid } from 'uuid';
import { IOfficeListParent } from 'app/model/office';
import { AppError } from 'app/shared/commonerror/app-error';
import { BadInput } from 'app/shared/commonerror/bad-input';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { DateAdapter } from '@angular/material';
import { ServiceRequestValidators } from './servicerequest.validators';
import { UserAuthorization, ApplicationUserService, UserAccessType, AccessPermission } from 'app/services/application-user/application-user.service';

@Component({
  selector: 'app-service-request-form',
  templateUrl: './service-request-form.component.html',
  styleUrls: ['./service-request-form.component.scss']
})
export class ServiceRequestFormComponent implements OnInit {
  serviceRequestForm: FormGroup;
  listServicemaster: IServiceMaster[];
  listOffice:IOfficeListParent[];
  id: string;
  minDate:string;
  tabIndex:number;
  status:string;
  userAuthorization:UserAuthorization;
  mode:UserAccessType;
  constructor(private rtps: RtpsService, private router: Router,
    private route: ActivatedRoute,private datepipe: DatePipe,private dateAdapter: DateAdapter<Date>,private cdr:ChangeDetectorRef,
    userService : ApplicationUserService) {
      this.userAuthorization = new UserAuthorization(1231, userService)
      this.dateAdapter.setLocale('in'); 
     }

  ngOnInit() {

    this.id = this.route.snapshot.paramMap.get('id');
    if(this.id=='null')
    {
        this.mode=UserAccessType.AddNew;
    }
    else{
      this.mode=UserAccessType.ViewForm;
    }
    this.route.queryParams
      .subscribe(params => {
        this.tabIndex = params.tabIndex;
    });
    this.serviceRequestForm = new FormGroup({
     
      id: new FormControl(uuid()),
      serviceId: new FormControl('', [
        Validators.required
      ]),
      referenceNo: new FormControl({value:'',disabled:true}),
      serviceRequestDate: new FormControl('',[]),
      dueDate: new FormControl('',[
        Validators.required
      ]),
      officeId: new FormControl('', [
        Validators.required
      ]),
      hmcApplicationReferenceNo:new FormControl(''),
      applicantName: new FormControl('', [
        Validators.required
      ]),
      // houseNo: new FormControl('', [
      //  // Validators.required
      // ]),
      // flatNo: new FormControl('', [
      //  // Validators.required
      // ]),
      streetName: new FormControl('', [
        //Validators.required
      ]),
      // buildingName: new FormControl('', [
      //  // Validators.required
      // ]),
      pinCode: new FormControl('', [
        Validators.required,
        ServiceRequestValidators.pinCode
      ]),
      contactNo: new FormControl('', [
        //Validators.required
        ServiceRequestValidators.contactNumber
      ]),
      // eMailId: new FormControl('', [
      // //  Validators.required
      // ]),
      note:new FormControl('', [
       // Validators.required
      ]),
      isAutoPosted:new FormControl(false),
      isProvisional:new FormControl(false),
      isActive:new FormControl(true)
    });

    let date = new Date();
    let formatedDate = this.datepipe.transform(date, 'yyyy-MM-dd');
    this.minDate = formatedDate;
    this.serviceRequestForm.controls['serviceRequestDate'].setValue(formatedDate);
    this.serviceRequestForm.controls['dueDate'].setValue(formatedDate);
    this.serviceRequestForm.controls['dueDate'].disable();

    this.getServiceMasterList();
    this.getOfficeList();

    if (this.id && this.id != 'null') {
      this.rtps.getServiceRequestById(this.id)
        .subscribe(svcRequestItem => {
         // console.log(svcRequestItem);
          this.status =svcRequestItem.status;
          this.serviceRequestForm.setValue({
          id:this.id,
          serviceId: svcRequestItem.serviceId,
          referenceNo:svcRequestItem.referenceNo,
          hmcApplicationReferenceNo:svcRequestItem.hmcApplicationReferenceNo,
          officeId:svcRequestItem.officeId,
          dueDate:svcRequestItem.dueDate,
          serviceRequestDate:svcRequestItem.serviceRequestDate,
          applicantName: svcRequestItem.applicantName,
         // houseNo: svcRequestItem.houseNo,
         // flatNo: svcRequestItem.flatNo,
          streetName: svcRequestItem.streetName,
         // buildingName: svcRequestItem.buildingName,
          pinCode: svcRequestItem.pinCode,
          contactNo:svcRequestItem.contactNo,
         // eMailId: svcRequestItem.eMailId,
          note:svcRequestItem.note,
          isAutoPosted:svcRequestItem.isAutoPosted,
          isProvisional:svcRequestItem.isProvisional,
          isActive:svcRequestItem.isActive
        })
    });
   }

  }
  onContentChanged() { }

  onSelectionChanged() { }

  getServiceMasterList() {
    this.rtps.getAllDesignatedService()
      .subscribe(parentList => {
        this.listServicemaster = parentList
        // console.log(this.listParent);
        this.cdr.detectChanges();
      });
  }
  getOfficeList(){
    let officeList=this.userAuthorization.getOffices(this.mode);
    console.log(officeList);
    this.rtps.getAllDesignatedOffice()
    .subscribe(parentList =>{
      this.listOffice =this.filterOfficeByAccess(parentList,officeList);
      console.log(this.listOffice);
     this.cdr.detectChanges();
  });
}

CreateServiceRequest() {
  const svcRequestForm = this.serviceRequestForm.getRawValue();
  this.rtps.createServiceRequest(svcRequestForm)
    .subscribe(newServiceRequest => {
      alert('New User Form(I) created successfully');
      this.router.navigateByUrl('rtps/svcrequestlist');
    }, (error: AppError) => {
      if (error instanceof BadInput) {
      }
      else throw error;
    });
}
// goToListPage() {
//   this.router.navigateByUrl('roleservice/svcrequestlist');
// }
UpdateServiceRequest(){
  const svcRequestForm = this.serviceRequestForm.getRawValue();
  this.rtps.updateServiceMasterPut(svcRequestForm)
    .subscribe(updateServiceRequest => {
      alert('User Form(I) updated successfully');
      this.router.navigateByUrl('rtps/svcmarequestlist');
    }, (error: AppError) => {
      if (error instanceof BadInput) {
      }
      else throw error;
    });
  }

  private filterOfficeByAccess(officeList: IOfficeListParent[], permittedOffices:AccessPermission[]): IOfficeListParent[]
  {
    let filteredOffices: IOfficeListParent[] = [];
    if (permittedOffices) {
     // let permittedOffices = this.userAuthorization.getOffices(4);
      if (permittedOffices) {
        for (let office of officeList) {
          if (permittedOffices.find(po => po.officeId === office.id)) {
            filteredOffices.push(office);
          }
        }
      }
  }
  return filteredOffices;
  }
}
