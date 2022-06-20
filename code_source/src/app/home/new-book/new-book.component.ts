import { HttpClient, } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { HomeService } from '../home.service';

@Component({
  selector: 'app-new-book',
  templateUrl: './new-book.component.html',
  styleUrls: ['./new-book.component.scss']
})
export class NewBookComponent implements OnInit {

  createForm = this.formBuilder.group({
    name: ['', [Validators.required]],
    auteur: [''],
    description: [''],
    contenu: ['']
  });

  constructor(private formBuilder: FormBuilder, private homeService: HomeService,
    private snackBar: MatSnackBar, private router: Router) { }

  ngOnInit(): void { }

  create() {
    let name = this.createForm.value.name;
    let auteur = this.createForm.value.auteur;
    let description = this.createForm.value.description;
    let contenu = this.createForm.value.contenu;

    this.homeService.create(name, auteur, description, contenu).pipe(
      catchError(err => of(this.openSnackBar(err.error.message, err.error.status)))
    ).subscribe(res => {
      this.openSnackBar(JSON.parse(JSON.stringify(res)).message, JSON.parse(JSON.stringify(res)).status);
      // this.homeService.getBookByName(name).subscribe(response => {
      this.router.navigate(['/']);
      // })
    });

  }

  openSnackBar(message: string, status: number) {
    let color;
    status === 201 ? color = "mat-success" : color = "mat-danger";
    this.snackBar.open(message, 'Fermer', {
      horizontalPosition: "right",
      verticalPosition: "bottom",
      duration: 5000,
      panelClass: color
    });
  }

}
