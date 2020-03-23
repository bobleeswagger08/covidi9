import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ServiceMasterListComponent } from './service-master-list/service-master-list.component';
import { ServiceMasterComponent } from './service-master/service-master.component';
import { FormIAccessDelegationComponent } from './form-i-access-delegation/form-i-access-delegation.component';
import { ServiceRequestFormComponent } from './service-request-form/service-request-form.component';
import { ServiceRequestListComponent } from './service-request-list/service-request-list.component';
import { ServiceRequestStatusComponent } from './service-request-status/service-request-status.component';
import { FormIServiceReportComponent } from './form-i-service-report/form-i-service-report.component';
import { FormIvReportComponent } from './form-iv-report/form-iv-report.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { DepartmentWiseAnalysisComponent } from './department-wise-analysis/department-wise-analysis.component';

const routes: Routes = [
  {
    path: '',
    children: [{
      path: 'svcmasterlist',
      component: ServiceMasterListComponent,
      data: { title: 'ServiceMasterList', breadcrumb: 'SERVICEMASTERLIST' }
    }]
  },
  
  {
    path: '',
    children: [{
      path: 'servicemaster/:id',
      component: ServiceMasterComponent,
      data: { title: 'ServiceMaster', breadcrumb: 'SERVICEMASTER' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'formiaccessdelegation',
      component: FormIAccessDelegationComponent,
      data: { title: 'FormIAccessDelegation', breadcrumb: 'FORMIACCESSDELEGATION' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'servicerequestform/:id',
      component: ServiceRequestFormComponent,
      data: { title: 'ServiceRequestForm', breadcrumb: 'SERVICEREQUESTFORM' }
    }]
  }
  ,
  {
    path: '',
    children: [{
      path: 'svcrequestlist',
      component: ServiceRequestListComponent,
      data: { title: 'ServiceRequestList', breadcrumb: 'SERVICEREQUESTLIST' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'servicerequeststatus/:id',
      component: ServiceRequestStatusComponent,
      data: { title: 'ServiceRequestStatus', breadcrumb: 'SERVICEREQUESTSTATUS' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'formiservicereport/:id',
      component: FormIServiceReportComponent,
      data: { title: 'FormIServiceReport', breadcrumb: 'FORMISERVICEREPORT' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'formivreport',
      component: FormIvReportComponent,
      data: { title: 'FormIvReport', breadcrumb: 'FORMIVREPORT' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'dashboardchart',
     // component: FormIAccessDelegationComponent,
      component:  LineChartComponent,
      data: { title: 'DashboardChart', breadcrumb: 'DASHBOARDCHART' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'dwiseanalysis',
     // component: FormIAccessDelegationComponent,
      component:  DepartmentWiseAnalysisComponent,
      data: { title: 'DepartmentWiseAnalysis', breadcrumb: 'DEPARTMENTWISEANALYSIS' }
    }]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RtpsRoutingModule { }
