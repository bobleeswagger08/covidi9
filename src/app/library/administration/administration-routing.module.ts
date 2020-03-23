import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserListComponent } from './user-list/user-list.component';
import { UserComponent } from './user/user.component';
import { RoleMasterListComponent } from './role-master-list/role-master-list.component';
import { RoleMasterComponent } from './role-master/role-master.component';
import { UserRoleAssignmentComponent } from './user-role-assignment/user-role-assignment.component';
import { UserRolePermissionComponent } from './user-role-permission/user-role-permission.component';
import { RoleAccessUiComponent } from './role-access-ui/role-access-ui.component';
import { UnlockUserComponent } from './unlock-user/unlock-user.component';
import { OfficeListComponent } from './office-list/office-list.component';
import { OfficeComponent } from './office/office.component';
import { DepartmentListComponent } from './department-list/department-list.component';
import { DepartmentMasterComponent } from './department-master/department-master.component';
import { ChangePasswordComponent } from './change-password/change-password.component';


const routes: Routes = [
  {
    path: '',
    children: [{
      path: 'userlist',
      component: UserListComponent,
      data: { title: 'UserList', breadcrumb: 'USERLIST' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'user/:id',
      component: UserComponent,
      data: { title: 'User', breadcrumb: 'USER' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'rolemasterlist',
      component: RoleMasterListComponent,
      data: { title: 'RoleMasterList', breadcrumb: 'ROLEMASTERLIST' }
    }]
  },{
    path: '',
    children: [{
      path: 'rolemaster/:id',
      component: RoleMasterComponent,
      data: { title: 'RoleMaster', breadcrumb: 'ROLEMASTER' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'userroleassignment',
      component: UserRoleAssignmentComponent,
      data: { title: 'UserRoleAssignment', breadcrumb: 'UserRoleAssignment' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'userrolepermission',
      component: UserRolePermissionComponent,
      data: { title: 'UserRolePermission', breadcrumb: 'userrolepermission' }
    }]
  } ,
  {
    path: '',
    children: [{
      path: 'rolepermission',
      component: RoleAccessUiComponent,
      data: { title: 'UserRolePermission', breadcrumb: 'USERROLEPERMISSION' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'unlockuser',
      component: UnlockUserComponent,
      data: { title: 'UnlockUser', breadcrumb: 'UNLOCKUSER' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'officelist',
      component: OfficeListComponent,
      data: { title: 'OfficeList', breadcrumb: 'OFFICELIST' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'office/:Id',
      component: OfficeComponent,
      data: { title: 'Office', breadcrumb: 'OFFICE' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'departmentlist',
      component: DepartmentListComponent,
      data: { title: 'DepartmentList', breadcrumb: 'DEPARTMENTLIST' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'department/:id',
      component: DepartmentMasterComponent,
      data: { title: 'DepartmentMaster', breadcrumb: 'DEPARTMENTMASTER' }
    }]
  },
  {
    path: '',
    children: [{
      path: 'changepassword/:id',
      component: ChangePasswordComponent,
      data: { title: 'ChangePassword', breadcrumb: 'CHANGEPASSWORD' }
    }]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrationRoutingModule { }
