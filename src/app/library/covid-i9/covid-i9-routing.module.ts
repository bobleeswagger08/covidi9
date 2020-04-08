import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CandidateInputComponent } from './candidate-input/candidate-input.component';
import { CandidateListComponent } from './candidate-list/candidate-list.component';
import { FileUploadScreenComponent } from './file-upload-screen/file-upload-screen.component';
import { CandidateAnalysisComponent } from './candidate-analysis/candidate-analysis.component';
import { DailyReportComponent } from './daily-report/daily-report.component';
import { CandiateStatusChartComponent } from './candiate-status-chart/candiate-status-chart.component';


const routes: Routes = [{
  path: '',
  children: [{
    path: 'candidate/:id/:tabIndex',
    component: CandidateInputComponent,
    data: { title: 'CandidateInput', breadcrumb: 'CANDIDATEINPUT' }
  }]
},
{
  path: '',
  children: [{
    path: 'candidatelist',
    component: CandidateListComponent,
    data: { title: 'CandidateList', breadcrumb: 'CANDIDATELIST' }
  }]
},
{
  path: '',
  children: [{
    path: 'excelupload',
    component: FileUploadScreenComponent,
    data: { title: 'Upload Excel', breadcrumb: 'FILEUPLOAD' }
  }]
},
{
  path: '',
  children: [{
    path: 'candidateanalysis',
    component: CandidateAnalysisComponent,
    data: { title: 'Candidate Analysis', breadcrumb: 'CANDIDATEANALYSIS' }
  }]
},
{
  path: '',
  children: [{
    path: 'dailyreport',
    component: DailyReportComponent,
    data: { title: 'Daily Report', breadcrumb: 'DAILYREPORT' }
  }]},
  // {
  //   path: '',
  //   children: [{
  //     path: 'candidatestatus',
  //     component: CandiateStatusChartComponent,
  //     data: { title: 'Candidate Status', breadcrumb: 'candidatestatus' }
  //   }]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CovidI9RoutingModule { }
