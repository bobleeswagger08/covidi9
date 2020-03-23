import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { CourtCaseRoutingModule } from './court-case-routing.module';
import { CourtMasterComponent } from './court-master/court-master.component';
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
import { CustomcontrolsModule } from '../shared-controls/customcontrols.module';
import { CourtMasterListComponent } from './court-master-list/court-master-list.component';
import { LawyerMasterComponent } from './lawyer-master/lawyer-master.component';
import { LawyerMasterListComponent } from './lawyer-master-list/lawyer-master-list.component';
import { LawyerPanelComponent } from './lawyer-panel/lawyer-panel.component';
import { LawyerPanelSelectionComponent } from './lawyer-panel-selection/lawyer-panel-selection.component';
import { CourtCaseMasterComponent } from './court-case-master/court-case-master.component';
import { CourtCaseMasterListComponent } from './court-case-master-list/court-case-master-list.component';
import { CourtCaseOrderComponent } from './court-case-order/court-case-order.component';
import { CourtCaseOrderListComponent } from './court-case-order-list/court-case-order-list.component';
import { LawyerAssignmentComponent } from './lawyer-assignment/lawyer-assignment.component';

@NgModule({
  declarations: [CourtMasterComponent, CourtMasterListComponent, LawyerMasterComponent, LawyerMasterListComponent, LawyerPanelComponent, LawyerPanelSelectionComponent, CourtCaseMasterComponent, CourtCaseMasterListComponent, CourtCaseOrderComponent, CourtCaseOrderListComponent, LawyerAssignmentComponent],
  imports: [
    CommonModule,
    CourtCaseRoutingModule,
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
    CustomcontrolsModule,
    NgxSpinnerModule
  ],
  providers: [DatePipe,{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  entryComponents:[
    LawyerPanelSelectionComponent
  ]
})
export class CourtCaseModule { }
