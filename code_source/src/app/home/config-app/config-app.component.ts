import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
// import { DeleteDialogComponent } from '../book-details-dialog/delete-dialog.component';
import { Files } from '../interfaces';
import { HomeService } from '../home.service';

@Component({
  selector: 'app-config-app',
  templateUrl: './config-app.component.html',
  styleUrls: ['./config-app.component.scss']
})
export class ConfigAppComponent implements OnInit {

  configForm = this.formBuilder.group({
    name: ['', [Validators.required]],
    ins: ['', [Validators.required]],
    description: [''],
    portFront: [''],
    frontEnd: [''],
    portBack: [''],
    backEnd: ['']
  });

  id!: string;
  appName!: string;
  configFiles: Files[];
  sourceFiles: Files[];

  constructor(private route: ActivatedRoute, private router: Router, private formBuilder: FormBuilder,
    private snackBar: MatSnackBar, private homeService: HomeService, public dialog: MatDialog) {
    this.configFiles = [];
    this.sourceFiles = [];
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
    });

    // this.homeService.getAppById(this.id).subscribe(app => {
    //   this.appName = app.name;
    //   this.configForm.controls['name'].setValue(app.name);
    //   this.configForm.controls['ins'].setValue(app.ins);
    //   this.configForm.controls['description'].setValue(app.description);
    //   this.configForm.controls['portFront'].setValue(app.portFront);
    //   this.configForm.controls['frontEnd'].setValue(app.frontEnd);
    //   this.configForm.controls['portBack'].setValue(app.portBack);
    //   this.configForm.controls['backEnd'].setValue(app.backEnd);
    //   this.sourceFiles = app.sourceFiles;
    //   this.configFiles = app.configFiles;
    // });
  }

  // edit() {
  //   let value = this.configForm.value;
  //   this.homeService.edit(this.id, value.name, value.ins, value.description,
  //     value.portFront, value.frontEnd, value.portBack, value.backEnd)
  //     .subscribe(response => {
  //       this.openSnackBar(response.message, response.status);
  //       this.router.navigate(['/view'], { queryParams: { id: this.id } });
  //     });
  // }

  // addFile(fileName: string, type: string) {
  //   fileName = fileName.trim()
  //   if (type === 'source') {
  //     let exists: boolean = false;
  //     this.sourceFiles.forEach(value => {
  //       if (value.name === fileName) {
  //         this.openSnackBar("Ce fichier existe déjà", 400);
  //         exists = true;
  //       }
  //     });

  //     if (fileName && !exists) {
  //       this.homeService.addFile(this.id, fileName, type).subscribe(response => {
  //         this.sourceFiles = response.files;
  //         this.openSnackBar("Fichier source ajouté", 200);
  //       });
  //     }
  //   }
  //   else if (type === 'config') {
  //     let exists: boolean = false;
  //     this.configFiles.forEach(value => {
  //       if (value.name === fileName) {
  //         this.openSnackBar("Ce fichier existe déjà", 400);
  //         exists = true;
  //       }
  //     });

  //     if (fileName && !exists) {
  //       this.homeService.addFile(this.id, fileName, type).subscribe(response => {
  //         this.configFiles = response.files;
  //         this.openSnackBar("Fichier de configuration ajouté", 200);
  //       });
  //     }
  //   }
  // }

  // removeFile(fileName: string, type: string) {
  //   this.homeService.removeFile(this.id, fileName, type).subscribe(response => {
  //     if (type === 'source') {
  //       this.sourceFiles = response.files;
  //       this.openSnackBar("Fichier source enlevé", 200);
  //     } else if (type === 'config') {
  //       this.configFiles = response.files;
  //       this.openSnackBar("Fichier de configuration enlevé", 200);
  //     }
  //   });
  // }

  // openSnackBar(message: string, status: number) {
  //   let color;
  //   status === 200 ? color = "mat-success" : color = "mat-danger";
  //   this.snackBar.open(message, 'Fermer', {
  //     horizontalPosition: "right",
  //     verticalPosition: "bottom",
  //     duration: 5000,
  //     panelClass: color
  //   });
  // }

  // openDialog() {
  //   const dialogRef = this.dialog.open(DeleteDialogComponent, {
  //     data: {
  //       name: this.appName
  //     }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       this.homeService.delete(this.id).subscribe(response => {
  //         this.openSnackBar(response.message, response.status);
  //         this.router.navigate(['/']);
  //       });
  //     }
  //   });
  // }
}
