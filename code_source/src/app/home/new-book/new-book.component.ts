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

  url!: any;

  createForm = this.formBuilder.group({
    name: ['', [Validators.required]],
    auteur: [''],
    description: ['']
  });

  livre!: File;
  couverture!: File;

  constructor(private formBuilder: FormBuilder, private homeService: HomeService,
    private snackBar: MatSnackBar, private router: Router) { }

  ngOnInit(): void { }

  create() {
    let name = this.createForm.value.name;
    let auteur = this.createForm.value.auteur;
    let description = this.createForm.value.description;

    this.homeService.create(name, auteur, description, this.livre, this.couverture === undefined ? null : this.couverture).pipe(
      catchError(err => of(this.openSnackBar(err.error.message, err.error.status)))
    ).subscribe(res => {
      this.openSnackBar(JSON.parse(JSON.stringify(res)).message, JSON.parse(JSON.stringify(res)).status);
      this.router.navigate(['/']);
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

  onDragOver(event: any) {
    event.preventDefault();
  }

  onDropSuccess(event: any, type: string) {
    this.save(event.dataTransfer.files[0], type);
    event.preventDefault();
  }

  preUpload(event: any, type: string) {
    this.save(event.target.files[0], type);
  }

  save(file: File, type: string) {
    if (type === 'livre') {
      if (file.type.includes('epub')) {
        this.livre = file;
        this.openSnackBar("Livre enregistré !", 201);
      } else {
        this.openSnackBar("Le fichier n'est pas un livre (epub) !", 400);
      }
    } else {
      if (file.type.includes('jpeg') || file.type.includes('png')) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (_event) => {
          this.url = reader.result;
        }
        this.couverture = file;
      } else {
        this.openSnackBar("Le fichier n'est pas une image !", 400);
      }
    }
  }
}
