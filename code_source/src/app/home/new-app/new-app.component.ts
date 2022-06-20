import { HttpClient, } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { HomeService } from '../home.service';

@Component({
  selector: 'app-new-app',
  templateUrl: './new-app.component.html',
  styleUrls: ['./new-app.component.scss']
})
export class NewAppComponent implements OnInit {

  createForm = this.formBuilder.group({
    name: ['', [Validators.required]],
    ins: ['', [Validators.required]],
    description: ['']
  });

  constructor(private formBuilder: FormBuilder, private homeService: HomeService,
    private snackBar: MatSnackBar, private router: Router, private http: HttpClient) {  }

  ngOnInit(): void { }

  create() {
    let name = this.createForm.value.name;
    let ins = this.createForm.value.ins;
    let description = this.createForm.value.description;

    this.homeService.create(name, ins, description).pipe(
      catchError(err => of(this.openSnackBar(err.error.message, err.error.status)))
    ).subscribe(res => {
      this.openSnackBar(JSON.parse(JSON.stringify(res)).message, JSON.parse(JSON.stringify(res)).status);
      this.homeService.getAppByName(name).subscribe(response => {
        this.router.navigate(['/config'], { queryParams: { id: response._id } });
      })
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
