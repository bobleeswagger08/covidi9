import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { RtpsService, FormIvRegister } from '../services/rtps/rtps.service';
import { MatTable } from '@angular/material';
import * as XLSX from "xlsx";
import pdfMake from 'pdfmake/build/pdfMake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { DatePipe, formatDate } from '@angular/common';
import { IServiceMaster, IRequestStatus, IOrderBy } from 'app/library/rtps/model/rtps';
import { MasterListItem } from 'app/model/master-list-item';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent } from '../../shared-controls/base-component/base-component.component';
import { ConfigurationlistService } from 'app/services/config/configurationlist.service';
import { UserAuthorization } from 'app/services/application-user/application-user.service';
import { ApplicationEnvironmentService } from 'app/services/application-environment/application-environment.service';

pdfMake.vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-form-iv-report',
  templateUrl: './form-iv-report.component.html',
  styleUrls: ['./form-iv-report.component.scss']
})
export class FormIvReportComponent extends BaseComponent implements OnInit {
  @ViewChild(MatTable, { static: false }) myTable: MatTable<FormIvRegister>;
  // displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  // dataSource = ELEMENT_DATA;
  displayedColumns: string[] = ['srlNo', 'serviceRequestDate', 'applicantName', 'serviceName', 'dueDate', 'serviceProvided'];

  currentDataSource: FormIvRegister[] = [];
  dataSource: FormIvRegister[] = [];
  length: number = 0;
  pageIndex: number = 0;
  pageSize: number = 5;
  serviceList: IServiceMaster[];
  statusList: IRequestStatus[];
  orderList: IOrderBy[];
  officeList: MasterListItem[] = [];
  userAuthorization: UserAuthorization;

  @ViewChild('TABLE', { static: false }) reportTable: ElementRef;

  constructor(private rtpsService: RtpsService, cdr: ChangeDetectorRef, systemEnvironment: ApplicationEnvironmentService,
    private configListService: ConfigurationlistService, private datepipe: DatePipe, private SpinnerService: NgxSpinnerService) {
    super(cdr);
    this.userAuthorization = new UserAuthorization(1231, systemEnvironment.userSession);
    this.refreshData();
  }
  //registerData:FormIvRegister[] = [];
  ngOnInit() {
    this.getOfficeList();
    this.getServiceMasterList();
    this.getRStatus();
    this.getOrderBy();
  }

  refreshData() {
    let aaurlValue: any = {};
    aaurlValue.OrderById = 1;
    let aaServiceValue: any = {};
    aaServiceValue.selectedServices = []
    aaServiceValue.selectedOffices = []
    aaServiceValue.selectedStatuses = []
    aaServiceValue.selectedDepartments = []
    this.rtpsService.getFormIVRegisterData(aaurlValue, aaServiceValue).subscribe(reportData => {
      this.dataSource = reportData;
      this.length = reportData.length;
      this.updatePageData(1, this.pageSize);
      // update table
    })
  }

  refreshPage(pageEventData: any) {
    console.log(pageEventData);
    this.updatePageData(pageEventData.pageIndex * pageEventData.pageSize, pageEventData.pageSize);
  }
  seachRerquestData(event) {
    let aaUrlValue: any = {};
    if (event.orderList.length == 0) {
      alert('Please select order by')
      return false;
    }
    else {
      //console.log(event.orderList);
      aaUrlValue.OrderById = event.orderList;
    }
    if (event.ApplicationDateFrom) {
      aaUrlValue.ApplicationDateFrom = formatDate(event.ApplicationDateFrom, 'yyyy-MM-dd', 'en-US')
    }
    if (event.ApplicationDateTo) {
      aaUrlValue.ApplicationDateTo = formatDate(event.ApplicationDateTo, 'yyyy-MM-dd', 'en-US')
    }
    if (event.ApplicationDateFrom && event.ApplicationDateTo && (event.ApplicationDateFrom > event.ApplicationDateTo)) {
      alert('Application from date can not be greater than application to date');
      return false;
    }
    if (event.DueDateFrom) {
      aaUrlValue.DueDateFrom = formatDate(event.DueDateFrom, 'yyyy-MM-dd', 'en-US')
    }
    if (event.DueDateTo) {
      aaUrlValue.DueDateTo = formatDate(event.DueDateTo, 'yyyy-MM-dd', 'en-US');

    }
    if (event.DueDateFrom && event.DueDateTo && (event.DueDateFrom > event.DueDateTo)) {
      alert('Due from date can not be greater than due to date');
      return false;
    }
    let aaServiceValue: any = {};

    aaServiceValue.selectedServices = event.serviceList.reduce(function (s, a) {
      s.push({ serviceId: a });
      return s;
    }, [])
    aaServiceValue.selectedOffices = event.officeList.reduce(function (s, a) {
      s.push({ officeId: a });
      return s;
    }, [])
    aaServiceValue.selectedStatuses = event.statusList.reduce(function (s, a) {
      s.push({ statusId: a });
      return s;
    }, [])
    aaServiceValue.selectedDepartments = []
    let requestId = this.registerDataRequest();
    this.rtpsService.getFormIVRegisterData(aaUrlValue, aaServiceValue).subscribe(reportData => {

      this.dataSource = reportData;
      this.signalDataRequestCompletion(requestId);
      this.length = reportData.length;
      this.updatePageData(0, this.pageSize);
      // update table
    });
  }
  updatePageData(startIndex: number, currentPageLength: number) {
    this.SpinnerService.show();
    if (this.dataSource.length > startIndex) {
      let lastIndex: number;
      lastIndex = (startIndex + currentPageLength) + 1;

      let endIndex = this.dataSource.length > lastIndex ? lastIndex : this.dataSource.length - 1;
      this.currentDataSource = this.dataSource.slice(startIndex, lastIndex);
      this.myTable.renderRows();
      this.SpinnerService.hide();
    }
    else {
      this.currentDataSource = this.dataSource.slice(startIndex);
    }
    this.SpinnerService.hide();
  }

  ExportTOExcel() {

    //const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.reportTable.nativeElement);
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.reportTable.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'RTPS Form IV Register.xlsx');

  }
  downloadaspdf() {

    // const documentDefinition = { content: 'This is an sample PDF printed with pdfMake' };
    const documentDefinition = this.getDocumentDefinition();
    pdfMake.createPdf(documentDefinition).open();
    // pdfMake.createPdf(documentDefinition).download();
    // pdfMake.createPdf(documentDefinition).print();
  }

  getPdfData() {
    // displayedColumns: string[] = ['srlNo', 'serviceRequestDate', 'applicantName', 'serviceName', 'dueDate', 'serviceProvided'];
    let reportDataArray = [];

    // header columns
    // reportDataArray.push({ srl: 'Serial#', applicationDate: 'Date', Applicant: 'Applicant', Service: 'Service ', Due: 'Due Date', Provided: 'Service Provided' });
    reportDataArray.push(['Sl. #', 'Date of receipt of application', 'Name and address of the applicant', 'Nature of service requested', 'Date on which application is disposed of. If rejected the reasons there of', 'Whether service provided in time Yes/No']);
    if (this.dataSource) {
      for (let data of this.dataSource) {
        let rowData = [];
        // rowData.push()
        //reportDataArray.push({
        rowData.push(data.srlNo);
        rowData.push(this.formatDateAsDDMMYYYY(data.serviceRequestDate));
        rowData.push(data.applicantName);
        rowData.push(data.serviceName);
        rowData.push(this.formatDateAsDDMMYYYY(data.statusDate));
        rowData.push(data.serviceProvided);
        reportDataArray.push(rowData);
      }
    }
    return reportDataArray;
  }

  getDocumentDefinition() {

    return {
      pageOrientation: 'landscape',
      margin: [50,50, 50, 50],
      footer: function(currentPage, pageCount) { return { text: ['Page ' + currentPage.toString() + ' of ' + pageCount+ '   '] , alignment: 'center'} },
      header: function(currentPage, pageCount, pageSize) {
          return { text:(currentPage == 1) ? ['Form IV\n','REGISTER OF CASES\n', 'Howrah Municipal Corporation\n', '4, Mahatma Gandhi Road, Howrah - 711101' ] : ['Form IV Register'],
          style : (currentPage == 1) ? 'firstPageHeader':'pageHeader'
        }},
      content: [
        
        {
          table: {
            headerRows: 1,
             widths: [30, 80,150, '*',80,100],
            body: this.getPdfData()
          }
        }
      ],
      styles: {
        firstPageHeader: {
          fontSize: 16,
          bold: true,
          alignment: 'center'
        },
        pageHeader: {
          fontSize: 12,
          bold: true,
          alignment: 'center'
        }
        
      }
    };
  }
 
  getServiceMasterList() {
    this.SpinnerService.show();
    let requestId = this.registerDataRequest();
    this.rtpsService.getAllDesignatedService()
      .subscribe(parentList => {
        this.serviceList = parentList
        // console.log(this.serviceList);
        this.signalDataRequestCompletion(requestId);
        this.SpinnerService.hide();
      });
  }
  getRStatus() {
    this.SpinnerService.show();
    let requestId = this.registerDataRequest();
    this.rtpsService.getRequestStatus()
      .subscribe(listRStatus => {
        this.statusList = listRStatus;
        this.signalDataRequestCompletion(requestId);
        this.SpinnerService.hide();
      });
  }
  getOrderBy() {
    this.SpinnerService.show();
    let requestId = this.registerDataRequest();
    this.rtpsService.getOrderBy()
      .subscribe(oBy => {
        this.orderList = oBy;
        this.signalDataRequestCompletion(requestId);
        this.SpinnerService.hide();
      });
  }
  getOfficeList() {
    this.SpinnerService.show();
    this.configListService.getOrganizationUnitList(false).subscribe(ul => {
      this.officeList = this.userAuthorization.filterOfficeListByAccess(1, ul);
      this.SpinnerService.hide();
    })
  }
}