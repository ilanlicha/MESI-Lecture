import { NgModule } from '@angular/core';
import { HomeRoutingModule } from './home-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from '../material.module';
import { LogHighlightComponent } from './log-highlight/log-highlight.component';

import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-log';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ConfigAppComponent } from './config-app/config-app.component';
import { NewBookComponent } from './new-book/new-book.component';
import { ViewAppComponent } from './view-app/view-app.component';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { HomeService } from './home.service';
import { HomeComponent } from './home.component';
import { AutosizeModule } from 'ngx-autosize';

const homeModules = [
  DashboardComponent,
  ConfigAppComponent,
  NewBookComponent,
  ViewAppComponent,
  LogHighlightComponent,
  DeleteDialogComponent
]

@NgModule({
  declarations: [
    HomeComponent,
    homeModules,
    DeleteDialogComponent
  ],
  imports: [
    ReactiveFormsModule,
    HomeRoutingModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    HttpClientModule,
    ReactiveFormsModule,
    MaterialModule,
    AutosizeModule
  ],
  exports: [
    homeModules
  ],
  providers: [
    HomeService
  ],
  bootstrap: [HomeComponent]
})
export class HomeModule { }
