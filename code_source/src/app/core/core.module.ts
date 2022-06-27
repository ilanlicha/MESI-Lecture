import { CoreComponent } from './core.component';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../material.module';

import { CoreRoutingModule } from './core-routing.module';

import { AboutComponent } from './about/about.component';
import { HeaderComponent } from './header/header.component';
import { ThemeSwitcherComponent } from './theme-switcher/theme-switcher.component';

const coreModules = [
  AboutComponent,
  HeaderComponent,
  ThemeSwitcherComponent,
]

@NgModule({
  declarations: [
    CoreComponent,
    coreModules,
  ],
  imports: [
    CommonModule,
    CoreRoutingModule,
    MaterialModule
  ],
  exports: [
    coreModules
  ],
  providers: [
    ThemeSwitcherComponent
  ],
  bootstrap: [CoreComponent]
})
export class CoreModule { }
