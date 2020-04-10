import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  MatListModule,
  MatIconModule,
  MatButtonModule,
  MatCardModule,
  MatMenuModule,
  MatSlideToggleModule,
  MatGridListModule,
  MatChipsModule,
  MatCheckboxModule,
  MatRadioModule,
  MatTabsModule,
  MatInputModule,
  MatProgressBarModule
 } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ChartsModule } from 'ng2-charts';
import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload';
import { SharedModule } from './../../shared/shared.module';

import { AppBlankComponent } from './app-blank/app-blank.component';
import { OthersRoutes } from "./others.routing";
import { CustomcontrolsModule } from '../shared-controls/customcontrols.module';
import { RtpsModule } from '../../library/rtps/rtps.module';
import { LineChartComponent } from '../../library/rtps/line-chart/line-chart.component';
import { CovidI9Module } from '../covid-i9/covid-i9.module';
import { GoogleChartModule } from 'app/services/google-chart/google-chart.module';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatGridListModule,
    MatChipsModule,
    MatCheckboxModule,
    MatRadioModule,
    MatTabsModule,
    MatInputModule,
    MatProgressBarModule,
    FlexLayoutModule,
    NgxDatatableModule,
    ChartsModule,
    FileUploadModule,
    SharedModule,
    CustomcontrolsModule,
    RtpsModule,
    RouterModule.forChild(OthersRoutes),
    CovidI9Module,
    GoogleChartModule,
    NgxSpinnerModule
  ],
  declarations: [
    AppBlankComponent
  ],
  entryComponents: [LineChartComponent]
})
export class OthersModule { }
