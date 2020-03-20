import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'c-layout-side-router',
  templateUrl: './layout-side-router.component.html',
  encapsulation: ViewEncapsulation.None
})
export class LayoutSideRouterComponent implements OnInit {
  @Input() public menu: any = {};
  @Input() public cCollapsed: boolean;
  @Input() public imgSize = 16;

  constructor(
    public sanitizer: DomSanitizer,
    public route: Router
  ) { }

  ngOnInit() {}
}
