import { Component, Input, TemplateRef } from '@angular/core';

// interface PopupDataModal {
//   tabName?: string;
//   template: TemplateRef<void>;
// }

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'c-view-info',
  exportAs: 'cViewInfo',
  templateUrl: './view-info.component.html'
})
export class ViewInfoComponent {
  // @Input() tabList: Array<PopupDataModal>;
  @Input() viewInfoTemplate: TemplateRef<void>;

  constructor() {

  }
}
