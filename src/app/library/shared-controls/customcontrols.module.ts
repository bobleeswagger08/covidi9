import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from "@angular/flex-layout";

import { MatSelectModule, MatCardModule, MatDialogModule, MatButtonModule,
         MatExpansionModule,MatInputModule, MatDatepickerModule,MatDividerModule } from '@angular/material';
import { SelectionListComponent } from './selection-list/selection-list.component';
import { DialogConfirmComponent } from './dialog-confirm/dialog-confirm.component';
import { BaseComponent } from './base-component/base-component.component';
import { UserSelectionComponent } from './user-selection/user-selection.component';
import { UserRoleSelectionComponent } from './user-role-selection/user-role-selection.component';
import { ServiceFilterComponent } from './service-filter/service-filter.component';
import { CodeComponent } from './code/code.component';
import { DescriptionComponent } from './description/description.component';
import { AdressEditorComponent } from './adress-editor/adress-editor.component';
import { RichTextEditorComponent } from './rich-text-editor/rich-text-editor.component';
import { QuillModule } from 'ngx-quill';

@NgModule({
  declarations: [SelectionListComponent, BaseComponent,  DialogConfirmComponent, UserSelectionComponent, UserRoleSelectionComponent, ServiceFilterComponent, CodeComponent,
     DescriptionComponent,AdressEditorComponent,RichTextEditorComponent],
  imports: [
    CommonModule,
    MatSelectModule,
    MatCardModule,
    MatDialogModule,
    MatButtonModule,
    MatExpansionModule,
    MatInputModule,
    MatDatepickerModule,
    MatDividerModule,
    FormsModule,
    ReactiveFormsModule,
    QuillModule,
    FlexLayoutModule
  ]
  , exports: [SelectionListComponent, DialogConfirmComponent, UserSelectionComponent, UserRoleSelectionComponent,
    ServiceFilterComponent,AdressEditorComponent,RichTextEditorComponent,CodeComponent, DescriptionComponent]
})
export class CustomcontrolsModule { }
 

