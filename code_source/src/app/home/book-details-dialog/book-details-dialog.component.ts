import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Book } from '../interfaces';
import { Buffer } from 'buffer';

export interface DialogBook {
  book: Book;
}

export interface Tile {
  cols: number;
  rows: number;
  text: string;
  index: number;
}

@Component({
  selector: 'app-book-details-dialog',
  templateUrl: './book-details-dialog.component.html',
  styleUrls: ['./book-details-dialog.component.scss']
})
export class BookDetailsDialogComponent implements OnInit {

  book: Book;
  tiles!: Tile[];

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogBook, private sanitizer: DomSanitizer) {this.book = data.book }

  ngOnInit(): void {
    this.tiles = [
      { text: this.book.description, cols: 3, rows: 2, index: 1 },
      { text: 'Image', cols: 1, rows: 3, index: 2 }
    ];
  }

  couverture(buffer: Buffer) {
    return this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,'
      + Buffer.from(buffer).toString('base64'));
  }
}
