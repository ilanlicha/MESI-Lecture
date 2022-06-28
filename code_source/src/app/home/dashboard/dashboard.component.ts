import { Component, OnInit } from '@angular/core';
import { Book } from '../interfaces';
import { HomeService } from '../home.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Buffer } from 'buffer';
import { MatDialog } from '@angular/material/dialog';
import { BookDetailsDialogComponent } from '../book-details-dialog/book-details-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  books!: Book[];

  constructor(private homeService: HomeService, private sanitizer: DomSanitizer, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getBooks();
  }

  getBooks() {
    this.homeService.getBooks().subscribe(books => {
      this.books = books;
    })
  }

  couverture(buffer: Buffer) {
    return this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,'
      + Buffer.from(buffer).toString('base64'));
  }

    openDialog(book: Book) {
    const dialogRef = this.dialog.open(BookDetailsDialogComponent, {
      data: {
        book: book
      }
    });
  }

  // changeStatus(id: string, status: string){
  //   for (let i = 0; i < this.applications.length; i++) {
  //     if (this.applications[i]._id === id) {
  //       this.applications[i].status = status;
  //       break;
  //     }
  //   }
  // }

  // on(id: string){
  //   this.changeStatus(id, "Chargement");
  //   this.homeService.on(id).subscribe(response => {
  //     this.changeStatus(id, response.message);
  //   });
  // }

  // off(id: string){
  //   this.changeStatus(id, "Chargement");
  //   this.homeService.off(id).subscribe(response => {
  //     this.changeStatus(id, response.message);
  //   });
  // }

  // acceder(id: string){
  //   for (let i = 0; i < this.applications.length; i++) {
  //     if (this.applications[i]._id === id) {
  //       window.open("http://localhost:" + this.applications[i].portFront, "_blank");
  //       break;
  //     }
  //   }
  // }
}
