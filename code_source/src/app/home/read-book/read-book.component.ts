import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HomeService } from '../home.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSliderChange } from '@angular/material/slider';
@Component({
  selector: 'app-read-book',
  templateUrl: './read-book.component.html',
  styleUrls: ['./read-book.component.scss']
})
export class ReadBookComponent implements OnInit {

  name!: string;
  contenu!: string[];
  mot!: string;
  index: number = 0;
  speed: number = 500;

  intervalId = 0;
  intervalStarted: boolean = false;

  constructor(private route: ActivatedRoute, private homeService: HomeService, private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.name = params['name'];
    })

    this.homeService.getContent(this.name).subscribe(content => {
      this.contenu = content.message.split(' ');
      this.mot = this.contenu[this.index];
    });
  }

  start() {
    if (this.intervalStarted === false) {
      this.intervalStarted = true;
      this.intervalId = window.setInterval(() => {
        this.mot = this.contenu[this.index];
        this.index == this.contenu.length - 1 ? this.index = 0 : this.index++;
      }, this.speed);
    }
  }

  pause() {
    if (this.intervalStarted === true) {
      this.intervalStarted = false;
      clearInterval(this.intervalId);
    }
  }

  restart() {
    if (this.intervalStarted === true) {
      this.pause();
      this.start();
    }
  }

  onInputChange(event: MatSliderChange) {
    switch (event.value) {
      case 0:
        this.speed = 500;
        this.restart();
        break;
      case 1:
        this.speed = 300;
        this.restart();
        break;
      case 2:
        this.speed = 200;
        this.restart();
        break;
    }
  }
}
