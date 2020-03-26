import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { CovidI9RoutingModule } from './covid-i9-routing.module';

import { NgxSpinnerModule } from "ngx-spinner";

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

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from "@angular/flex-layout";
import { CandidateInputComponent } from './candidate-input/candidate-input.component';
import { CustomcontrolsModule } from '../shared-controls/customcontrols.module';
import { FieldInputComponent } from './field-input/field-input.component';
import { CandidateListComponent } from './candidate-list/candidate-list.component';
import { FileUploadScreenComponent } from './file-upload-screen/file-upload-screen.component';
import { CandidateAnalysisComponent } from './candidate-analysis/candidate-analysis.component';
import { WebDataRocksPivot } from './webdatarocks/webdatarocks.angular4'



@NgModule({
  declarations: [CandidateInputComponent, FieldInputComponent, CandidateListComponent, FileUploadScreenComponent, CandidateAnalysisComponent,WebDataRocksPivot],
  imports: [
    CommonModule,
    CovidI9RoutingModule,
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
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    NgxSpinnerModule,
    CustomcontrolsModule
  ],
  providers: [DatePipe,{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CovidI9Module { }
