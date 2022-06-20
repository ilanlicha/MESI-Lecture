import { Component, OnInit } from '@angular/core';
import { Applications } from '../interfaces';
import { HomeService } from '../home.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  applications!: Applications[];

  constructor(private homeService: HomeService) { }

  ngOnInit(): void {
    this.getApps();
  }

  getApps(){
    this.homeService.getApps().subscribe(apps => {
      this.applications = apps;
    })
  }

  changeStatus(id: string, status: string){
    for (let i = 0; i < this.applications.length; i++) {
      if (this.applications[i]._id === id) {
        this.applications[i].status = status;
        break;
      }
    }
  }

  on(id: string){
    this.changeStatus(id, "Chargement");
    this.homeService.on(id).subscribe(response => {
      this.changeStatus(id, response.message);
    });
  }

  off(id: string){
    this.changeStatus(id, "Chargement");
    this.homeService.off(id).subscribe(response => {
      this.changeStatus(id, response.message);
    });
  }

  acceder(id: string){
    for (let i = 0; i < this.applications.length; i++) {
      if (this.applications[i]._id === id) {
        window.open("http://localhost:" + this.applications[i].portFront, "_blank");
        break;
      }
    }
  }
}
