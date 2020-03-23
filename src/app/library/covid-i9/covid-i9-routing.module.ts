import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CandidateInputComponent } from './candidate-input/candidate-input.component';


const routes: Routes = [{
  path: '',
  children: [{
    path: 'candidate',
    component: CandidateInputComponent,
    data: { title: 'CandidateInput', breadcrumb: 'CANDIDATEINPUT' }
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CovidI9RoutingModule { }
