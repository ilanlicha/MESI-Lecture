import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HomeService } from '../home.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Applications } from '../interfaces';
import { Subscription } from 'rxjs';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-view-app',
  templateUrl: './view-app.component.html',
  styleUrls: ['./view-app.component.scss']
})
export class ViewAppComponent implements OnInit {
  app!: Applications;

  uploadProgressSource!: number;
  uploadProgressConfig!: number;
  uploadSub!: Subscription;
  uploading: boolean = false;

  id!: string;
  appName!: string;
  frontEndCode!: string;
  backEndCode!: string;
  dockerComposeCode!: string;

  fileUploadingName!: string;

  constructor(private route: ActivatedRoute, private homeService: HomeService, private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
    })

    this.homeService.getAppById(this.id).subscribe(app => {
      this.app = app;
    });
  }

  deleteFile(fileName: string, type: string) {
    this.homeService.deleteFile(this.id, fileName, type).subscribe(response => {
      if (type === 'source')
        this.app.sourceFiles = response.files;
      else if (type === 'config')
        this.app.configFiles = response.files;
      this.openSnackBar("Fichier supprimé", 200);
    });
  }

  onDragOver(event: any) {
    event.preventDefault();
  }

  onDropSuccess(event: any, i: number, type: string) {
    if (!this.uploading)
      this.upload(event.dataTransfer.files[0], i, type);
    else
      this.openSnackBar("Un fichier est déjà en cours d'upload", 400)
    event.preventDefault();

  }

  preUpload(event: any, i: number, type: string) {
    this.upload(event.target.files[0], i, type);
  }

  upload(file: File, i: number, type: string) {
    this.fileUploadingName = file.name;
    if (type === 'source') {
      if (file && file.name === this.app.sourceFiles[i].name) {
        this.uploadSub = this.homeService.upload(this.id, file, type).subscribe(response => {
          if (response.type == HttpEventType.UploadProgress) {
            this.uploading = true;
            this.uploadProgressSource = Math.round(100 * (response.loaded / response.total!));
          } else if (response.type === 4) {
            this.app.sourceFiles = response.body?.files!;
            this.openSnackBar("Fichier enregistré", 200);
            this.reset();
          }
        });
      } else
        this.openSnackBar("Le nom du fichier ne correspond pas", 400);
    } else if (type === 'config') {
      if (file && file.name === this.app.configFiles[i].name) {
        this.uploadSub = this.homeService.upload(this.id, file, type).subscribe(response => {
          if (response.type == HttpEventType.UploadProgress) {
            this.uploading = true;
            this.uploadProgressConfig = Math.round(100 * (response.loaded / response.total!));
          } else if (response.type === 4) {
            this.app.configFiles = response.body?.files!;
            this.openSnackBar("Fichier enregistré", 200);
            this.reset();
          }
        });
      } else
        this.openSnackBar("Le nom du fichier ne correspond pas", 400);
    }
  }

  openSnackBar(message: string, status: number) {
    let color;
    status === 200 ? color = "mat-success" : color = "mat-danger";
    this.snackBar.open(message, 'Fermer', {
      horizontalPosition: "right",
      verticalPosition: "bottom",
      duration: 5000,
      panelClass: color
    });
  }

  cancelUpload() {
    this.uploadSub.unsubscribe();
    this.reset();
  }

  reset() {
    this.uploadProgressSource = 0;
    this.uploadProgressConfig = 0;
    this.uploadSub.unsubscribe;
    this.uploading = false;
  }

  on() {
    this.app.status = "Chargement";
    this.homeService.on(this.app._id).subscribe(response => {
      this.app.status = response.message;
    });
  }

  off() {
    this.app.status = "Chargement";
    this.homeService.off(this.app._id).subscribe(response => {
      this.app.status = response.message;
    });
  }

  acceder() {
    window.open("http://localhost:" + this.app.portFront, "_blank");
  }
}
