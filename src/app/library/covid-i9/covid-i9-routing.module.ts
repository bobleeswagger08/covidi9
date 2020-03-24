import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CandidateInputComponent } from './candidate-input/candidate-input.component';
import { FileUploadScreenComponent } from './file-upload-screen/file-upload-screen.component';


const routes: Routes = [{
  path: '',
  children: [{
    path: 'candidate',
    component: CandidateInputComponent,
    data: { title: 'CandidateInput', breadcrumb: 'CANDIDATEINPUT' }
  }]
},
{
  path: '',
  children: [{
    path: 'excelupload',
    component: FileUploadScreenComponent,
    data: { title: 'Upload Excel', breadcrumb: 'FILEUPLOAD' }
  }]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CovidI9RoutingModule { }
