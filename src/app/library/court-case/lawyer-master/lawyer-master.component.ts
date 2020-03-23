import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { v4 as uuid } from 'uuid';
import { DatePipe, formatDate } from '@angular/common';
import { BaseComponent } from 'app/library/shared-controls/base-component/base-component.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { CourtCaseService } from '../services/court-case.service';
import { ICourtMaster, IAddress, IAddressFormValues } from '../models/court-master';
import { AppError } from 'app/shared/commonerror/app-error';
import { ILawyerMaster, IAddressLabel } from '../models/lawyer-master';
import { BadInput } from 'app/shared/commonerror/bad-input';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-lawyer-master',
  templateUrl: './lawyer-master.component.html',
  styleUrls: ['./lawyer-master.component.scss']
})
export class LawyerMasterComponent extends BaseComponent implements OnInit {
  lawyerMasterForm: FormGroup;
  id:string;
  minDate:string;
  listCourt:ICourtMaster[];
  lawyerMasterValue:ILawyerMaster;
  officeAddressValue:IAddress;
  homeAddressValue:IAddress;
  officeAddressFormValue:IAddressFormValues;
  homeAddressFormValue:IAddressFormValues;
  addressLabel:IAddressLabel={
    office:'Office Address',
    home:'Home Address'
  }
  constructor(private route: ActivatedRoute,private router:Router,private ccService:CourtCaseService,private formBuilder: FormBuilder,private datepipe: DatePipe,cdr: ChangeDetectorRef,private SpinnerService: NgxSpinnerService) { 
    super(cdr);
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.lawyerMasterForm = this.formBuilder.group({
      id: [uuid()],
      code:[],
      remarks: [],
      addressOffice:[],
      addressHome:[],
      phone:['',Validators.required],
      alternatePhone:[],
      emailId:['',Validators.required],
      practicingCourts:['',Validators.required],
    //  description:[],
      effectiveFromDate:['',Validators.required],
      name:['',Validators.required ],
      isActive: [true]
      // parentUnitId: new FormControl('', [
      //   Validators.required
      // ])
    });
    let date = new Date();
    let formatedDate = this.datepipe.transform(date, 'yyyy-MM-dd');
    this.minDate = formatedDate;

    this.getCourtMasterList();

    if (this.id && this.id != 'null') {
      this.ccService.getLawyerMasterById(this.id)
        .subscribe((lawyerItem:ILawyerMaster) => {
         // let arrayList = deptItem.organizations.map(ao => ao.organizationUnitId);
         this.ccService.getCourtAddressById(this.id)
         .subscribe((addressItem:IAddress) => {
          this.homeAddressFormValue={
            id:addressItem.id,
            email:'',
            phone:'',
            city:'',
            houseno:addressItem.houseNo,
            streetName:addressItem.streetName,
            pinCode:addressItem.pinCode,
            countryId:'',
            stateId:'',
            isActive:true,
            landmark:''
          } 
          this.lawyerMasterForm.setValue({
            id: this.id,
            code: {code: lawyerItem.code},
            remarks:{richTextEditor: lawyerItem.note},
            addressOffice:this.homeAddressFormValue,
            addressHome:this.homeAddressFormValue,
            phone:lawyerItem.contactNo,
            alternatePhone:lawyerItem.alternateContactNo,
            emailId:lawyerItem.eMailId,
            effectiveFromDate:lawyerItem.courts[0].effectiveFrom,
            practicingCourts:lawyerItem.courts.map(ao => ao.courtId),
            // address:{id:'',email: '',phone: '',city: '',countryId: '',stateId: '',
            // pinCode: '',houseno: '',landmark: '',streetName: '',isActive: ''},
            name:lawyerItem.name,
           // description: {description:courtItem.description},
            isActive: lawyerItem.isActive
          })
         },(error: AppError) => {
          //alert(error);
          this.lawyerMasterForm.setValue({
            id: this.id,
            code: {code: lawyerItem.code},
            remarks:{richTextEditor: lawyerItem.note},
            addressOffice:{id:'',email: '',phone: '',city: '',countryId: '',stateId: '',
            pinCode: '',houseno: '',landmark: '',streetName: '',isActive: ''},
            addressHome:{id:'',email: '',phone: '',city: '',countryId: '',stateId: '',
            pinCode: '',houseno: '',landmark: '',streetName: '',isActive: ''},
            phone:lawyerItem.contactNo,
            alternatePhone:lawyerItem.alternateContactNo,
            emailId:lawyerItem.eMailId,
            effectiveFromDate:lawyerItem.courts[0].effectiveFrom,
            practicingCourts:lawyerItem.courts.map(ao => ao.courtId),
            name:lawyerItem.name,
            isActive: lawyerItem.isActive
          })
         });
          
         // this.courtMasterForm.controls['code'].disable();
        });
      }
  }
  submitLawyerMasterData(lawayerFormValue){
    //console.log(lawayerFormValue);
    var arr = lawayerFormValue.practicingCourts;
    var res = arr.reduce(function(s, a){
    s.push({courtId: a,
      effectiveFrom: formatDate(lawayerFormValue.effectiveFromDate,'yyyy-MM-dd', 'en-US')});
    return s;
    }, [])
   // console.log(res);
   this.lawyerMasterValue={
    id:lawayerFormValue.id,
    code:lawayerFormValue.code.code,
    //description:courtMasterFormValue.description.description,
    note:lawayerFormValue.remarks.richTextEditor,
    isActive:lawayerFormValue.isActive,
    courts:res,
    contactNo:lawayerFormValue.phone,
    alternateContactNo:lawayerFormValue.alternatePhone,
    eMailId:lawayerFormValue.emailId,
    name:lawayerFormValue.name
  }
  //console.log(this.lawyerMasterValue);
  this.ccService.createLawyerMaster(this.lawyerMasterValue)
      .subscribe(lawyer => {
        alert('Lawyer Master Created  sucessfully')
        //this.router.navigate(['administration/userlist']);
      }, (error: AppError) => {
        if (error instanceof BadInput) {
          alert('invalid data');
        }
        else throw error;
      });

      this.officeAddressValue={
        id:uuid(),
        referenceId:lawayerFormValue.id,
        buildingName:'',
        houseNo:lawayerFormValue.addressOffice.houseno,
        flatNo:'',
        streetName:lawayerFormValue.addressOffice.streetName,
        pinCode:lawayerFormValue.addressOffice.pinCode,
        wardNo:'',
        countryId:'00000000-0000-0000-0000-000000000000',
        stateId:'00000000-0000-0000-0000-000000000000',
        isActive:true,
        addressType:3
      }
      //console.log(this.officeAddressValue);
      this.saveLawyerAddress(this.officeAddressValue)
      this.homeAddressValue={
        id:uuid(),
        referenceId:lawayerFormValue.id,
        buildingName:'',
        houseNo:lawayerFormValue.addressHome.houseno,
        flatNo:'',
        streetName:lawayerFormValue.addressHome.streetName,
        pinCode:lawayerFormValue.addressHome.pinCode,
        wardNo:'',
        countryId:'00000000-0000-0000-0000-000000000000',
        stateId:'00000000-0000-0000-0000-000000000000',
        isActive:true,
        addressType:1
      }
      //console.log(this.homeAddressValue);
      this.saveLawyerAddress(this.homeAddressValue)
  }
  saveLawyerAddress(lawyerAddress){
    this.ccService.saveAddress(lawyerAddress)
    .subscribe(lAddress => {
      if(lawyerAddress.addressType==3)
      {
      alert('Lawyer Office Address saved  sucessfully')
      }
      else{
        alert('Lawyer Home Address saved  sucessfully')
        this.router.navigate(['courtcase/lawyermasterlist']);
      }
      // this.router.navigate(['courtcase/courtmasterlist']);
    }, (error: AppError) => {
      if (error instanceof BadInput) {
        alert('invalid data');
      }
      else throw error;
    });
  }
  updateLawyerMasterData(lawayerFormValue){
    //console.log(lawayerFormValue);
    var arr = lawayerFormValue.practicingCourts;
    var res = arr.reduce(function(s, a){
    s.push({courtId: a,
      effectiveFrom: formatDate(lawayerFormValue.effectiveFromDate,'yyyy-MM-dd', 'en-US')});
    return s;
    }, [])
   // console.log(res);
   this.lawyerMasterValue={
    id:lawayerFormValue.id,
    code:lawayerFormValue.code.code,
    //description:courtMasterFormValue.description.description,
    note:lawayerFormValue.remarks.richTextEditor,
    isActive:lawayerFormValue.isActive,
    courts:res,
    contactNo:lawayerFormValue.phone,
    alternateContactNo:lawayerFormValue.alternatePhone,
    eMailId:lawayerFormValue.emailId,
    name:lawayerFormValue.name
  }
  //console.log(this.lawyerMasterValue);
  this.ccService.updateLawyerMaster(this.lawyerMasterValue)
      .subscribe(lawyer => {
        alert('Lawyer Master Updated sucessfully')
        //this.router.navigate(['administration/userlist']);
      }, (error: AppError) => {
        if (error instanceof BadInput) {
          alert('invalid data');
        }
        else throw error;
      });

      this.officeAddressValue={
        id:uuid(),
        referenceId:lawayerFormValue.id,
        buildingName:'',
        houseNo:lawayerFormValue.addressOffice.houseno,
        flatNo:'',
        streetName:lawayerFormValue.addressOffice.streetName,
        pinCode:lawayerFormValue.addressOffice.pinCode,
        wardNo:'',
        countryId:'00000000-0000-0000-0000-000000000000',
        stateId:'00000000-0000-0000-0000-000000000000',
        isActive:true,
        addressType:3
      }
      //console.log(this.officeAddressValue);
      this.saveLawyerAddress(this.officeAddressValue)
      this.homeAddressValue={
        id:uuid(),
        referenceId:lawayerFormValue.id,
        buildingName:'',
        houseNo:lawayerFormValue.addressHome.houseno,
        flatNo:'',
        streetName:lawayerFormValue.addressHome.streetName,
        pinCode:lawayerFormValue.addressHome.pinCode,
        wardNo:'',
        countryId:'00000000-0000-0000-0000-000000000000',
        stateId:'00000000-0000-0000-0000-000000000000',
        isActive:true,
        addressType:1
      }
      //console.log(this.homeAddressValue);
      this.saveLawyerAddress(this.homeAddressValue)
  }
  getCourtMasterList(){
    this.SpinnerService.show(); 
    let requestId = this.registerDataRequest();
    this.ccService.getCourtMasterList()
    .subscribe((ccmList:any[]) =>{
     // this.listOffice = officeList;
      this.listCourt=ccmList;
      this.signalDataRequestCompletion(requestId);
      
      this.SpinnerService.hide();
     },(error: AppError) => {
       this.SpinnerService.hide();
    });
  }

}
