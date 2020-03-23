import { Component, OnInit } from '@angular/core';
import { v4 as uuid } from 'uuid';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CovidI9Service } from '../services/covid-i9.service';
import { BadInput } from 'app/shared/commonerror/bad-input';
import { AppError } from 'app/shared/commonerror/app-error';
import { ICandidateInput, IFieldData } from '../model/candidate-input';

@Component({
  selector: 'app-candidate-input',
  templateUrl: './candidate-input.component.html',
  styleUrls: ['./candidate-input.component.scss']
})
export class CandidateInputComponent implements OnInit {
  candidateForm: FormGroup;
  fieldInput:IFieldData[];
  candidateFormValue:ICandidateInput;
  tabIndex:number;
  constructor(private route: ActivatedRoute,private router:Router,private formBuilder: FormBuilder,private covidService:CovidI9Service) { }

  ngOnInit() {
    this.candidateForm = this.formBuilder.group({
      id: [uuid()],
      source: [],
      serialNo: [],
      name: [],
      flightNo: [],
      countryVisited: [],
      dob: [],
      age: [],
      sex: [],
      flightNumber: [],
      arivalDate: [],
      mobileNo: [],
      address: [],
      finalDestination: [],
      block: [],
      state: [],
      note: [],
      wardNo: [],
      uphc: [],
      fieldData: [],
      isActive: [true]
    });
  }
  submitCandidateInputData(candidateInputFormValue){
    console.log(candidateInputFormValue);
     this.fieldInput =[]
     this.fieldInput.push(candidateInputFormValue.fieldData)
    this.candidateFormValue={
      source: candidateInputFormValue.source,
      name: candidateInputFormValue.name,
      flightNo: candidateInputFormValue.flightNo,
      countryVisited: candidateInputFormValue.countryVisited,
      dob: candidateInputFormValue.dob,
      age: candidateInputFormValue.age,
      sex: candidateInputFormValue.sex,
      flightNumber: candidateInputFormValue.flightNumber,
      arivalDate: candidateInputFormValue.arivalDate,
      mobileNo: candidateInputFormValue.mobileNo,
      address: candidateInputFormValue.address,
      finalDestination: candidateInputFormValue.finalDestination,
      block: candidateInputFormValue.block,
      state: candidateInputFormValue.state,
      note: candidateInputFormValue.note,
      wardNo: candidateInputFormValue.wardNo,
      uphc: candidateInputFormValue.uphc,
      isActive: true,
      fieldData: this.fieldInput, 
      id: candidateInputFormValue.id,
      serialNo: candidateInputFormValue.serialNo
    }
    console.log(this.candidateFormValue)
    this.covidService.saveCandidateInput(this.candidateFormValue)
      .subscribe(court => {
        alert('Court Master Created  sucessfully')
        //this.router.navigate(['administration/userlist']);
      }, (error: AppError) => {
        if (error instanceof BadInput) {
          alert('invalid data');
        }
        else throw error;
      });
  }
}
