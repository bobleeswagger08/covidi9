import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FlexLayoutModule } from "@angular/flex-layout";
import { QuillModule } from 'ngx-quill';

import { RtpsRoutingModule } from './rtps-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatInputModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatListModule,
  MatCardModule,
  MatProgressBarModule,
  MatRadioModule,
  MatCheckboxModule,
  MatButtonModule,
  MatIconModule,
  MatStepperModule,
  MatSelectModule,
  MatTreeModule,
  MatExpansionModule,
  MatTooltipModule,
  MatDialogModule,
  MatSlideToggleModule,
  MatTabsModule,
  MAT_DATE_LOCALE
} from '@angular/material';
import { MatTableModule, MatPaginatorModule, MatSortModule } from '@angular/material';
import { NgxSpinnerModule } from "ngx-spinner";
import { ServiceMasterListComponent } from './service-master-list/service-master-list.component';
import { ServiceMasterComponent } from './service-master/service-master.component';
import { FormIAccessDelegationComponent } from './form-i-access-delegation/form-i-access-delegation.component';
import { ServiceRequestFormComponent } from './service-request-form/service-request-form.component';
import { ServiceRequestListComponent } from './service-request-list/service-request-list.component';
import { ServiceRequestStatusComponent } from './service-request-status/service-request-status.component';
import { CustomcontrolsModule } from '../shared-controls/customcontrols.module'
import { FormIServiceReportComponent } from './form-i-service-report/form-i-service-report.component';
import { FormIvReportComponent } from './form-iv-report/form-iv-report.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { GoogleChartModule } from 'app/services/google-chart/google-chart.module';
import { DepartmentWiseAnalysisComponent } from './department-wise-analysis/department-wise-analysis.component';
import { WebDataRocksPivot } from 'app/library/rtps/webdatarocks/webdatarocks.angular4';
import { FormIUserSelectionComponent } from './form-i-user-selection/form-i-user-selection.component';

@NgModule({
  declarations: [ServiceMasterListComponent,ServiceMasterComponent,FormIAccessDelegationComponent,
    ServiceRequestFormComponent,ServiceRequestListComponent,ServiceRequestStatusComponent,
    FormIServiceReportComponent,FormIvReportComponent,LineChartComponent,DepartmentWiseAnalysisComponent,
    WebDataRocksPivot,FormIUserSelectionComponent],
  imports: [
    CommonModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatListModule,
    MatCardModule,
    MatProgressBarModule,
    MatRadioModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatStepperModule,
    MatSelectModule,
    MatTreeModule,
    MatExpansionModule,
    MatTooltipModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatTabsModule,
    RtpsRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    FlexLayoutModule,
    NgxSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    QuillModule,
    CustomcontrolsModule,
    GoogleChartModule
  ],
  providers: [DatePipe,{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  exports:[
    LineChartComponent
  ],
  entryComponents:[
    FormIUserSelectionComponent
  ]
})
export class RtpsModule { }
