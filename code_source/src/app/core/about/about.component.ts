import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  template: `<mat-toolbar color="primary">
  À propos
</mat-toolbar>

<mat-grid-list cols="1" rows="1" rowHeight="3:1">
  <mat-grid-tile>
      <mat-card>
          <mat-card-subtitle>A propos</mat-card-subtitle>
          <mat-card-title>Livres</mat-card-title>
          <mat-card-content>
              <p>Lire un livre mot par mot</p>
          </mat-card-content>
          <mat-divider inset></mat-divider>
          <mat-card-actions>
              <a routerLink="/" mat-raised-button color="primary">LIVRES</a>
          </mat-card-actions>
          <mat-card-footer>
              <mat-progress-bar mode="indeterminate"></mat-progress-bar>
          </mat-card-footer>
      </mat-card>
  </mat-grid-tile>
</mat-grid-list>`
})
export class AboutComponent implements OnInit {
  constructor() { }

  ngOnInit(): void { }
}
