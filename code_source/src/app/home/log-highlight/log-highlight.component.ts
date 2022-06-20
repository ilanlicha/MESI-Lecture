import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as Prism from 'prismjs';

@Component({
  selector: 'app-log-highlight',
  template: `<pre  *ngIf="language" class="language-{{ language }}" class="line-numbers">
  <code #codeEle class="language-{{ language }}">{{code}}</code></pre>`
})
export class LogHighlightComponent implements OnInit {

  ngOnInit(): void {
  }

  @ViewChild('codeEle') codeEle!: ElementRef;
  @Input() code?: string;
  @Input() language?: string;

  constructor() { }

  ngAfterViewInit() {
    Prism.highlightElement(this.codeEle.nativeElement);
  }
  
  ngOnChanges(changes: any): void {
    if (changes?.code) {
      if (this.codeEle?.nativeElement) {
        this.codeEle.nativeElement.textContent = this.code;
        Prism.highlightElement(this.codeEle.nativeElement);
      }
    }
  }
}
