import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, Input, TemplateRef } from '@angular/core';

@Component({
  selector: '[c-grid-body]',
  exportAs: 'cGridBody',
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './grid-body.component.html'
})
export class GridBodyComponent implements OnInit {
  @Input() content: TemplateRef<void>;
  constructor() { }

  ngOnInit() {
  }

}
