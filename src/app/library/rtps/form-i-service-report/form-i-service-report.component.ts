import { Component, OnInit, Inject, ChangeDetectorRef, ElementRef ,ViewChild } from '@angular/core';
import * as jsPDF from "jspdf";
import { MAT_DIALOG_DATA } from '@angular/material';
import { RtpsService } from '../services/rtps/rtps.service';
import { IServiceRequestReport } from 'app/library/rtps/model/rtps';
import html2canvas from 'html2canvas';  
//import html2canvas from 'html2canvas'; 

@Component({
  selector: 'app-form-i-service-report',
  templateUrl: './form-i-service-report.component.html',
  styleUrls: ['./form-i-service-report.component.scss']
})
export class FormIServiceReportComponent implements OnInit {
  serviceId:string;
  serviceRequestDetails:IServiceRequestReport;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private rtps: RtpsService,private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    if(this.data){
    this.serviceId = this.data.Id;
    if (this.serviceId && this.serviceId != 'null') {
      this.rtps.getServiceRequestById(this.serviceId)
        .subscribe(svcRequestItem => {
          this.serviceRequestDetails=svcRequestItem;
          this.cdr.detectChanges();
          console.log(this.serviceRequestDetails);
          console.log(this.serviceRequestDetails.applicantName);
        })
      }
    }
  }
  public downloadAsPDF() {
     let pdf = new jsPDF('p', 'pt', 'a4'); 
  //   let source = document.getElementById('pdfTable');
  //       let  specialElementHandlers = {
  //         // element with id of "bypass" - jQuery style selector
  //         '#bypassme': function (element, renderer) {
  //             // true = "handled elsewhere, bypass text extraction"
  //             return true
  //         }
  //     };
  //     let margins = {
  //       top: 20,
  //       bottom: 20,
  //       left: 20,
  //       width: 900
  //   };
  //   pdf.fromHTML(
  //     source, // HTML string or DOM elem ref.
  //     margins.left, // x coord
  //     margins.top, { // y coord
  //         'width': margins.width, // max width of content on PDF
  //         'elementHandlers': specialElementHandlers
  //     },

  //     function (dispose) {
  //       // dispose: object with X, Y of the last line add to the PDF 
  //       //          this allow the insertion of new lines after html
        
  //       pdf.save('purosathiForm1.pdf');
  //   }, margins);
  var data = document.getElementById('pdfTable'); 
  //let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF   
  html2canvas(data).then(canvas => {  
    // Few necessary setting options  
    var imgWidth = 500;   
    var pageHeight = 150;    
    var imgHeight = canvas.height * imgWidth / canvas.width;  
    var heightLeft = imgHeight;  

    const contentDataURL = canvas.toDataURL('image/png')  
    
    var position = 0;  
    pdf.addImage(contentDataURL, 'PNG', 40, 40, imgWidth, imgHeight)  
    pdf.save('purosathiForm1.pdf'); // Generated PDF   
  });  

  }
 }