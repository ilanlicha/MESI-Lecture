import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogDelete {
  name: string;
}

@Component({
  selector: 'app-delete-dialog',
  template: `<mat-dialog-content class="mat-typography">
  Supprimer l'application {{data.name}} ?
</mat-dialog-content>
<mat-dialog-actions align="end">
<button mat-button mat-dialog-close color="danger">Annuler</button>
<button mat-button [mat-dialog-close]="true" cdkFocusInitial color="success">Supprimer</button>
</mat-dialog-actions>
`
})
export class DeleteDialogComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogDelete) { }

  ngOnInit(): void {}
}
