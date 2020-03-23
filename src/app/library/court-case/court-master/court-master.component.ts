import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { v4 as uuid } from 'uuid';
import { ICourtMaster, IAddress, IAddressFormValues } from '../models/court-master';
import { CourtCaseService } from '../services/court-case.service';
import { AppError } from 'app/shared/commonerror/app-error';
import { BadInput } from 'app/shared/commonerror/bad-input';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-court-master',
  templateUrl: './court-master.component.html',
  styleUrls: ['./court-master.component.scss']
})
export class CourtMasterComponent implements OnInit {
  descriptionText:string="Name";
  addressLabel:string="Address"
  courtMasterForm: FormGroup;
  courtMasterValue:ICourtMaster;
  courtAddressValue:IAddress;
  courtAddressFormValue:IAddressFormValues;
  id:string;
  constructor(private route: ActivatedRoute,private router:Router,private formBuilder: FormBuilder,private courtService:CourtCaseService) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');

    this.courtMasterForm = this.formBuilder.group({
      id: [uuid()],
      code:['', Validators.required],
      remarks: [],
      address:[],
      description:[],
      isActive: [true]
      // parentUnitId: new FormControl('', [
      //   Validators.required
      // ])
    });

    if (this.id && this.id != 'null') {
      this.courtService.getCourtMasterById(this.id)
        .subscribe((courtItem:ICourtMaster) => {
         // let arrayList = deptItem.organizations.map(ao => ao.organizationUnitId);
         this.courtService.getCourtAddressById(this.id)
        .subscribe((addressItem:IAddress) => {
          this.courtAddressFormValue={
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
          this.courtMasterForm.setValue({
            id: this.id,
            code: {code: courtItem.code},
            remarks:{richTextEditor: courtItem.note},
            address:this.courtAddressFormValue,
            // address:{id:'',email: '',phone: '',city: '',countryId: '',stateId: '',
            // pinCode: '',houseno: '',landmark: '',streetName: '',isActive: ''},
           // name:'',
            description: {description:courtItem.description},
            isActive: courtItem.isActive
          })
         },(error: AppError) => {
          alert(error);
          this.courtMasterForm.setValue({
            id: this.id,
            code: {code: courtItem.code},
            remarks:{richTextEditor: courtItem.note},
            address:{id:'',email: '',phone: '',city: '',countryId: '',stateId: '',
            pinCode: '',houseno: '',landmark: '',streetName: '',isActive: ''},
            // address:{id:'',email: '',phone: '',city: '',countryId: '',stateId: '',
            // pinCode: '',houseno: '',landmark: '',streetName: '',isActive: ''},
           // name:'',
            description: {description:courtItem.description},
            isActive: courtItem.isActive
          })
         });
          
         // this.courtMasterForm.controls['code'].disable();
        });
      }
  }
  submitCourtMasterData(courtMasterFormValue){
   // console.log(courtMasterFormValue);
    this.courtMasterValue={
      id:courtMasterFormValue.id,
      code:courtMasterFormValue.code.code,
      description:courtMasterFormValue.description.description,
      note:courtMasterFormValue.remarks.richTextEditor,
      isActive:courtMasterFormValue.isActive
    }
    
   // console.log(this.courtMasterValue);

    this.courtService.createCourtMaster(this.courtMasterValue)
      .subscribe(court => {
        alert('Court Master Created  sucessfully')
        //this.router.navigate(['administration/userlist']);
      }, (error: AppError) => {
        if (error instanceof BadInput) {
          alert('invalid data');
        }
        else throw error;
      });

      this.courtAddressValue={
        id:uuid(),
        referenceId:courtMasterFormValue.id,
        buildingName:'',
        houseNo:courtMasterFormValue.address.houseno,
        flatNo:'',
        streetName:courtMasterFormValue.address.streetName,
        pinCode:courtMasterFormValue.address.pinCode,
        wardNo:'',
        countryId:'00000000-0000-0000-0000-000000000000',
        stateId:'00000000-0000-0000-0000-000000000000',
        isActive:true,
        addressType:1
      }
     // console.log(this.courtAddressValue);

      this.courtService.saveAddress(this.courtAddressValue)
      .subscribe(user => {
        alert('Court Address saved  sucessfully')
         this.router.navigate(['courtcase/courtmasterlist']);
      }, (error: AppError) => {
        if (error instanceof BadInput) {
          alert('invalid data');
        }
        else throw error;
      });
   // this.submitButton.disabled = true;

  }
  updateCourtMasterData(courtMasterFormValue){
    this.courtMasterValue={
      id:courtMasterFormValue.id,
      code:courtMasterFormValue.code.code,
      description:courtMasterFormValue.description.description,
      note:courtMasterFormValue.remarks.richTextEditor,
      isActive:courtMasterFormValue.isActive
    }
    
   // console.log(this.courtMasterValue);

    this.courtService.updateCourtMaster(this.courtMasterValue)
      .subscribe(user => {
        alert('Court Master updated  sucessfully')
        //this.router.navigate(['administration/userlist']);
      }, (error: AppError) => {
        if (error instanceof BadInput) {
          alert('invalid data');
        }
        else throw error;
      });

      this.courtAddressValue={
        id:uuid(),
        referenceId:courtMasterFormValue.id,
        buildingName:'',
        houseNo:courtMasterFormValue.address.houseno,
        flatNo:'',
        streetName:courtMasterFormValue.address.streetName,
        pinCode:courtMasterFormValue.address.pinCode,
        wardNo:'',
        countryId:'00000000-0000-0000-0000-000000000000',
        stateId:'00000000-0000-0000-0000-000000000000',
        isActive:true,
        addressType:1
      }
     // console.log(this.courtAddressValue);

      this.courtService.saveAddress(this.courtAddressValue)
      .subscribe(user => {
        alert('Court Address saved  sucessfully')
        this.router.navigate(['courtcase/courtmasterlist']);
      }, (error: AppError) => {
        if (error instanceof BadInput) {
          alert('invalid data');
        }
        else throw error;
      });
  }

}
