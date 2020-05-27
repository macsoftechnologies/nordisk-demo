import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NewRequestComponent } from './Requests/new-request/new-request.component';
import { ListRequestComponent } from './Requests/list-request/list-request.component';
import { PlansComponent } from './plans/plans.component';
import { NotificationsComponent } from './notifications/notifications.component';

export const usersRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: "dashboard",
        component: DashboardComponent,
        data: { title: "dashboard", breadcrumb: "dashboard" }
        // canActivate: [UserRoleGuard],
        // data: { title: "Default", breadcrumb: "Default", roles: config.authRoles.sa }
      },
      {
        path: "new-request",
        component: NewRequestComponent,
        data: { title: "", breadcrumb: "new-request" }
      },
      {
        path: "list-request",
        component: ListRequestComponent,
        data: { title: "list-request", breadcrumb: "list-request" }
      },
      {
        path: "plans",
        component: PlansComponent,
        data: { title: "plans", breadcrumb: "plans" }
      },
      {
        path: "notifications",
        component:NotificationsComponent,
        data: { title: "notifications", breadcrumb: "notifications" }
      }
    ]
  }
];

// const routes: Routes = [
//   {
//     path: "dashboard",
//     component: DashboardComponent,
//     // canActivate: [UserRoleGuard],
//     // data: { title: "Default", breadcrumb: "Default", roles: config.authRoles.sa }
//   },
//   {
//     path: "new-request",
//     component: NewRequestComponent,
//     data: { title: "new-request", breadcrumb: "new-request" }
//   },
//   {
//     path: "list-request",
//     component: ListRequestComponent,
//     data: { title: "list-request", breadcrumb: "list-request" }
//   },
//   {
//     path: "plans",
//     component: PlansComponent,
//     data: { title: "plans", breadcrumb: "plans" }
//   },
//   {
//     path: "notifications",
//     component: Notification,
//     data: { title: "notifications", breadcrumb: "notifications" }
//   }
// ];

// @NgModule({
//   imports: [RouterModule.forChild(routes)],
//   exports: [RouterModule]
// })
// export class UsersRoutingModule { }
