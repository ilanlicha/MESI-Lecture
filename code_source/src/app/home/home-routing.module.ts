import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NewAppComponent } from './new-app/new-app.component';
import { ConfigAppComponent } from './config-app/config-app.component';
import { ViewAppComponent } from './view-app/view-app.component';
import { ViewLogComponent } from './view-log/view-log.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'creer', component: NewAppComponent },
  { path: 'config', component: ConfigAppComponent },
  { path: 'view', component: ViewAppComponent },
  { path: 'viewlogs', component: ViewLogComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
