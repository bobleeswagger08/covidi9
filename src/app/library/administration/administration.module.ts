import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FlexLayoutModule } from "@angular/flex-layout";
import { QuillModule } from 'ngx-quill';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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

import { AdministrationRoutingModule } from './administration-routing.module';
import { UserListComponent } from './user-list/user-list.component';
import { UserComponent } from './user/user.component';
import { RoleMasterListComponent } from './role-master-list/role-master-list.component';
import { RoleMasterComponent } from './role-master/role-master.component';
import { UserRoleAssignmentComponent } from './user-role-assignment/user-role-assignment.component';
import { CustomcontrolsModule } from '../shared-controls/customcontrols.module';
import { UserRoleAssignmentSelectionComponent } from './user-role-assignment-selection/user-role-assignment-selection.component';
import { UserRolePermissionComponent } from './user-role-permission/user-role-permission.component';
import { RoleAccessUiComponent } from './role-access-ui/role-access-ui.component';
import { UnlockUserComponent } from './unlock-user/unlock-user.component';
import { OfficeListComponent } from './office-list/office-list.component';
import { OfficeComponent } from './office/office.component';
import { DepartmentListComponent } from './department-list/department-list.component';
import { DepartmentMasterComponent } from './department-master/department-master.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

@NgModule({
  declarations: [UserListComponent,UserComponent,RoleMasterListComponent,RoleMasterComponent,
    UserRoleAssignmentComponent,UserRoleAssignmentSelectionComponent,UserRolePermissionComponent,
    RoleAccessUiComponent,UnlockUserComponent,OfficeListComponent,OfficeComponent,
    DepartmentListComponent,DepartmentMasterComponent,ChangePasswordComponent],
  imports: [
    CommonModule,
    AdministrationRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    QuillModule,
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
    NgxSpinnerModule,
    CustomcontrolsModule
  ],
  entryComponents: [
    UserRoleAssignmentSelectionComponent
  ],
  providers: [DatePipe,{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
})
export class AdministrationModule { }
