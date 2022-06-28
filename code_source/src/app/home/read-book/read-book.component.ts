import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { HomeService } from '../home.service';
import { Buffer } from 'buffer';
import { MatSliderChange } from '@angular/material/slider';
import { Book } from '../interfaces';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';

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

  id!: string;
  book!: Book;
  contenu!: string[];
  mot!: string;
  index!: number;
  tmpIndex!: number;
  speed: number = 500;

  intervalId = 0;
  intervalStarted: boolean = false;

  tiles!: Tile[];
  constructor(private route: ActivatedRoute, private homeService: HomeService, private sanitizer: DomSanitizer, private router: Router
    , public dialog: MatDialog) {
    router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        this.updateIndex();
      }
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
    })

    this.homeService.getBookById(this.id).subscribe(book => {
      this.book = book;
      this.index = book.lectureIndex;
      this.tmpIndex = book.lectureIndex;
      this.tiles = [
        { text: this.book.description, cols: 3, rows: 2, index: 1 },
        { text: 'Image', cols: 1, rows: 2, index: 2 }
      ];

      this.homeService.getContent(this.book.name).subscribe(content => {
        this.contenu = content.message.split(' ');
        this.mot = this.contenu[this.index];
      });
    });
  }

  start() {
    if (this.intervalStarted === false) {
      this.intervalStarted = true;
      this.intervalId = window.setInterval(() => {
        this.mot = this.contenu[this.index];
        if (this.index === this.contenu.length - 1) {
          this.reset();
          this.dialog.open(DialogLectureFinie);
        }
        else
          this.index++;
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

  updateIndex() {
    if (this.index !== this.tmpIndex)
      this.homeService.updateReadIndex(this.book._id, this.index === 0 ? this.index : this.index - 1).subscribe();
  }

  @HostListener('window:beforeunload', ['$event'])
  canLeavePage($event: any) {
    this.updateIndex();
  }
}

@Component({
  selector: 'dialogLectureFinie',
  template: `Lecture terminée
  <div mat-dialog-actions>
  <button mat-button mat-dialog-close>Close</button>
</div>`,
})
export class DialogLectureFinie { }