import { Component, OnInit } from '@angular/core';
import { ThemeSwitcherComponent } from './core/theme-switcher/theme-switcher.component';

@Component({
  selector: 'app-root',
  template: `<app-header fullscreen></app-header>
  <router-outlet class="angular-default-theme"></router-outlet>`
})
export class AppComponent implements OnInit {
  title = 'node-express-angular';

  constructor(public themeSwitch: ThemeSwitcherComponent) { }

  ngOnInit() {
    this.themeSwitch.setDefaultTheme();
  }

}
