import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NewBookComponent } from './new-book/new-book.component';
import { ConfigAppComponent } from './config-app/config-app.component';
import { ReadBookComponent } from './read-book/read-book.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'creer', component: NewBookComponent },
  { path: 'config', component: ConfigAppComponent },
  { path: 'read', component: ReadBookComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
