import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './shared/components/layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './shared/components/layouts/auth-layout/auth-layout.component';
import { AuthGuard } from './shared/services/auth/auth.guard';


export const rootRouterConfig: Routes = [
  { 
    path: '', 
    redirectTo: 'home', 
    pathMatch: 'full' 
  },
  {
    path: 'home',
    loadChildren: () => import('./library/home/home.module').then(m => m.HomeModule),
    data: { title: 'Purosathi' }
  },
  {
    path: '', 
    component: AuthLayoutComponent,
    children: [
      { 
        path: 'sessions', 
        loadChildren: () => import('./library/sessions/sessions.module').then(m => m.SessionsModule),
        data: { title: 'Session'} 
      }
    ]
  },
  {
    path: '', 
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'rtps', 
        loadChildren: () => import('./library/rtps/rtps.module').then(m => m.RtpsModule), 
        data: { title: 'Rtps', breadcrumb: 'RTPS'}
      },
      {
        path: 'courtcase', 
        loadChildren: () => import('./library/court-case/court-case.module').then(m => m.CourtCaseModule), 
        data: { title: 'CourtCase', breadcrumb: 'COURTCASE'}
      },
      {
        path: 'covidi9', 
        loadChildren: () => import('./library/covid-i9/covid-i9.module').then(m => m.CovidI9Module), 
        data: { title: 'CovidI9', breadcrumb: 'COVIDI9'}
      },
      {
        path: 'administration', 
        loadChildren: () => import('./library/administration/administration.module').then(m => m.AdministrationModule), 
        data: { title: 'Administration', breadcrumb: 'ADMINISTRATION'}
      },
      {
        path: 'others', 
        loadChildren: () => import('./library/others/others.module').then(m => m.OthersModule), 
        data: { title: 'Others', breadcrumb: 'OTHERS'}
      }
    ]
  },
 
  { 
    path: '**', 
    redirectTo: 'sessions/404'
  }
 
];

