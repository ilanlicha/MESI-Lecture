import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HomeService } from '../home.service';
import { Buffer } from 'buffer';
import { MatSliderChange } from '@angular/material/slider';
import { Book } from '../interfaces';
import { DomSanitizer } from '@angular/platform-browser';

export interface Tile {
  cols: number;
  rows: number;
  text: string;
  index: number;
}

@Component({
  selector: 'app-read-book',
  templateUrl: './read-book.component.html',
  styleUrls: ['./read-book.component.scss']
})
export class ReadBookComponent implements OnInit {

  name!: string;
  book!: Book;
  contenu!: string[];
  mot!: string;
  index: number = 0;
  speed: number = 500;

  intervalId = 0;
  intervalStarted: boolean = false;

  tiles!: Tile[];
  constructor(private route: ActivatedRoute, private homeService: HomeService, private sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.name = params['name'];
    })

    this.homeService.getBookByName(this.name).subscribe(book => {
      this.book = book;
      this.tiles = [
        { text: this.book.description, cols: 3, rows: 2, index: 1 },
        { text: 'Image', cols: 1, rows: 2, index: 2 }
      ];
    });

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

  reset() {
    this.index = 0;
    this.mot = this.contenu[this.index];
    this.pause();
  }

  onInputChange(event: MatSliderChange) {
    switch (event.value) {
      case 0:
        this.speed = 500;
        this.restart();
        break;
      case 1:
        this.speed = 350;
        this.restart();
        break;
      case 2:
        this.speed = 200;
        this.restart();
        break;
    }
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.key) {
      case ' ':
        this.intervalStarted === true ? this.pause() : this.start();
        break;
      case 'ArrowRight':
        switch (this.speed) {
          case 500:
            this.speed = 350;
            this.restart();
            break;
          case 350:
            this.speed = 200;
            this.restart();
            break;
        }
        break;
      case 'ArrowLeft':
        switch (this.speed) {
          case 200:
            this.speed = 350;
            this.restart();
            break;
          case 350:
            this.speed = 500;
            this.restart();
            break;
        }
        break;
    }
  }

  couverture(buffer: Buffer) {
    return this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,'
      + Buffer.from(buffer).toString('base64'));
  }
}
