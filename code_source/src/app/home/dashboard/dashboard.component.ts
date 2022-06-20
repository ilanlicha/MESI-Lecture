import { Component, OnInit } from '@angular/core';
import { Book } from '../interfaces';
import { HomeService } from '../home.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  books!: Book[];

  constructor(private homeService: HomeService) { }

  ngOnInit(): void {
    this.getBooks();
  }

  getBooks() {
    this.homeService.getBooks().subscribe(books => {
      this.books = books;
    })
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
