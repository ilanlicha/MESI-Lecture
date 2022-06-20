import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogHighlightComponent } from './log-highlight.component';

describe('LogHighlightComponent', () => {
  let component: LogHighlightComponent;
  let fixture: ComponentFixture<LogHighlightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogHighlightComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogHighlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
