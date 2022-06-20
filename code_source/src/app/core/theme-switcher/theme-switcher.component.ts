import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-theme-switcher',
  template: `<mat-icon>light_mode</mat-icon>
  <mat-slide-toggle (click)="themeSwitcher()" checked="true" *ngIf="themeColor == 'dark-theme'"></mat-slide-toggle>
  <mat-slide-toggle (click)="themeSwitcher()" checked="false" *ngIf="themeColor == 'light-theme'"></mat-slide-toggle>
  <mat-icon>dark_mode</mat-icon>`
})
export class ThemeSwitcherComponent implements OnInit {

  themeColor: any = 'dark-theme';

  constructor() { }

  ngOnInit() {
    this.setDefaultTheme();
  }

  setDefaultTheme() {
    if (localStorage.getItem('pxTheme')) {

      this.themeColor = localStorage.getItem('pxTheme');

      const body = document.getElementsByTagName('body')[0];
      body.classList.add(this.themeColor);
    }
  }

  themeSwitcher() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove(this.themeColor);

    (this.themeColor == 'light-theme') ? this.themeColor = 'dark-theme' : this.themeColor = 'light-theme';

    body.classList.add(this.themeColor);

    localStorage.setItem('pxTheme', this.themeColor);
  }

}
