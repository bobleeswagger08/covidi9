import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CourtMasterComponent } from './court-master/court-master.component';
import { CourtMasterListComponent } from './court-master-list/court-master-list.component';
import { LawyerMasterComponent } from './lawyer-master/lawyer-master.component';
import { LawyerMasterListComponent } from './lawyer-master-list/lawyer-master-list.component';
import { LawyerPanelComponent } from './lawyer-panel/lawyer-panel.component';
import { CourtCaseMasterComponent } from './court-case-master/court-case-master.component';
import { CourtCaseMasterListComponent } from './court-case-master-list/court-case-master-list.component';
import { CourtCaseOrderComponent } from './court-case-order/court-case-order.component';
import { CourtCaseOrderListComponent } from './court-case-order-list/court-case-order-list.component';
import { LawyerAssignmentComponent } from './lawyer-assignment/lawyer-assignment.component';


const routes: Routes = [{
  path: '',
  children: [{
    path: 'courtmaster/:id',
    component: CourtMasterComponent,
    data: { title: 'CourtMaster', breadcrumb: 'COURTMASTER' }
  }]
},
{
  path: '',
  children: [{
    path: 'courtmasterlist',
    component: CourtMasterListComponent,
    data: { title: 'CourtMasterList', breadcrumb: 'COURTMASTERLIST' }
  }]
},
{
  path: '',
  children: [{
    path: 'lawyermaster/:id',
    component: LawyerMasterComponent,
    data: { title: 'LawyerMaster', breadcrumb: 'LAWYERMASTER' }
  }]
},
{
  path: '',
  children: [{
    path: 'lawyermasterlist',
    component: LawyerMasterListComponent,
    data: { title: 'LawyerMasterList', breadcrumb: 'LAWYERMASTERLIST' }
  }]
},
{
  path: '',
  children: [{
    path: 'lawyerpanel',
    component: LawyerPanelComponent,
    data: { title: 'LawyerPanel', breadcrumb: 'LAWYERPANEL' }
  }]
},
{
  path: '',
  children: [{
    path: 'courtcasemaster/:id',
    component: CourtCaseMasterComponent,
    data: { title: 'CourtCaseMaster', breadcrumb: 'COURTCASEMASTER' }
  }]
},
{
  path: '',
  children: [{
    path: 'courtcasemasterlist',
    component: CourtCaseMasterListComponent,
    data: { title: 'CourtCaseMasterList', breadcrumb: 'COURTCASEMASTERLIST' }
  }]
},
{
  path: '',
  children: [{
    path: 'courtcaseorder/:isIncoming/:id',
    component: CourtCaseOrderComponent,
    data: { title: 'CourtCaseOrder', breadcrumb: 'COURTCASEORDER' }
  }]
},
{
  path: '',
  children: [{
    path: 'courtcaseorderlist/:isIncoming',
    component: CourtCaseOrderListComponent,
    data: { title: 'CourtCaseOrderList', breadcrumb: 'COURTCASEORDERLIST' }
  }]
},
{
  path: '',
  children: [{
    path: 'lawyerassign',
    component: LawyerAssignmentComponent,
    data: { title: 'LawyerAssignment', breadcrumb: 'LAWYERASSIGNMENT' }
  }]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CourtCaseRoutingModule { }
