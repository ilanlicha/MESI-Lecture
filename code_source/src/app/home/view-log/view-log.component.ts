import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HomeService } from '../home.service';

@Component({
  selector: 'app-view-log',
  templateUrl: './view-log.component.html',
  styleUrls: ['./view-log.component.scss']
})
export class ViewLogComponent implements OnInit {

  id!: string;
  logs!: string;
  uploadProgress!: number;
  appName!: string;

  constructor(private route: ActivatedRoute, private homeService: HomeService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
      this.homeService.getAppNameById(this.id).subscribe(response => {
        this.appName = response.message;
      });
    });

    this.homeService.getLogs(this.id).subscribe(response => {
      response.message ? this.logs = response.message : this.logs = "Pas de log";
      setTimeout(() => {
        this.goDown();
      }, 1);
    });
  }

  goUp() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }

  goDown() {
    document.body.scrollTop = document.documentElement.scrollTop = document.documentElement.scrollHeight;
  }
}
