import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { HomeService } from '../home.service';
import { Buffer } from 'buffer';
import { MatSliderChange } from '@angular/material/slider';
import { Book } from '../interfaces';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { Epub } from '@gxl/epub-parser/lib/parseEpub';


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
  contenu: Array<any> = [];
  mot!: string;
  pageIndex!: number;
  motIndex!: number;
  tmpMotIndex!: number;
  tmpPageIndex!: number;
  speed: number = 500;
  nbPages!: number;
  nbMotDansPageActuelle!: number;

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

  async ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
    })

    this.homeService.getBookById(this.id).subscribe(book => {
      this.book = book;
      this.pageIndex = book.pageIndex;
      this.tmpPageIndex = book.pageIndex;
      this.motIndex = book.motIndex;
      this.tmpMotIndex = book.motIndex;
      this.tiles = [
        { text: this.book.description, cols: 3, rows: 2, index: 1 },
        { text: 'Image', cols: 1, rows: 2, index: 2 }
      ];

      this.homeService.getContent(this.book._id).subscribe(content => {
        content.book.sections.forEach((section: any) => {
          if (section.htmlString.includes("type=\"chapter\"") || section.htmlString.includes("type=\"subchapter\""))
            this.contenu.push(section);
        });

        this.nbPages = this.contenu.length;

        this.contenu.forEach((page, index) => {
          this.contenu[index].htmlString = this.htmlToText(page.htmlString.substring(page.htmlString.indexOf("</div></div></div>") + 18, page.htmlString.length)).split(' ');;
        });
        console.log(this.contenu);
        this.nbMotDansPageActuelle = this.contenu[this.pageIndex].htmlString.length;
        this.mot = this.contenu[this.pageIndex].htmlString[this.motIndex];
      });
    });
  }

  htmlToText(html: any) {
    var tmp = document.createElement('DIV');
    html = html.replaceAll(/["'\n+]/g, "");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }

  start() {
    if (this.intervalStarted === false) {
      this.intervalStarted = true;
      this.intervalId = window.setInterval(() => {
        if (this.motIndex === this.nbMotDansPageActuelle) {
          if (this.pageIndex + 1 === this.nbPages) {
            this.reset();
            this.dialog.open(DialogLectureFinie);
          } else {
            this.mot = this.contenu[this.pageIndex].htmlString[this.motIndex];
            this.pageIndex++;
            this.motIndex = 0;
          }
        } else {
          this.mot = this.contenu[this.pageIndex].htmlString[this.motIndex];
          this.motIndex++;
        }
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
    this.pageIndex = 0;
    this.motIndex = 0;
    this.mot = this.contenu[this.pageIndex].htmlString[this.motIndex];
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
    if (this.pageIndex !== this.tmpPageIndex || this.motIndex !== this.tmpMotIndex) {
      this.homeService.updateReadIndex(this.book._id, this.pageIndex,
        this.motIndex === 0 ? this.motIndex : this.motIndex - 1).subscribe();
    }
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