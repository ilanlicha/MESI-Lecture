import { Component, OnInit } from '@angular/core';
import { Book } from '../interfaces';
import { HomeService } from '../home.service';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  books!: Book[];

  constructor(private homeService: HomeService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.getBooks();
  }

  getBooks() {
    this.homeService.getBooks().subscribe(books => {
      this.books = books;
    })
  }

  couverture(buffer: Buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer.length);
    var len = bytes.byteLength;
    console.log(buffer[0]);
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
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
