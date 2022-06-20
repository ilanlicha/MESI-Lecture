import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  template: `<mat-toolbar color="primary" class="mat-elevation-z8 top">
  <mat-icon>dashboard_customize</mat-icon><a class="titre" routerLink="/">Conteneurisation</a>
  <div class="spacer"></div>
  <a mat-button routerLink="/">Applications</a>
  <a mat-raised-button color="link" routerLink="/about">À propos</a>
  <app-theme-switcher style="margin-left: 15px; display:flex;"></app-theme-switcher>
</mat-toolbar>`,
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {}
}
