import { Component, Input, Output, EventEmitter } from "@angular/core";
import { SelectOption } from './config';

@Component({
  selector: 'icy-editor-toolbar',
  templateUrl: './editor-toolbar.component.html',
  styleUrls: ['./editor-toolbar.component.scss']
})
export class EditorToolbarComponent {
  @Input() id: string;
  @Input() uploadUrl: string;
  @Input() showToolbar: boolean;
  @Input() hiddenButtons: string[][];

  @Output() execute: EventEmitter<string> = new EventEmitter<string>();

  public block = 'default';
  public htmlMode = false;

  public headings: SelectOption[] = [
    {label: '默认', value: 'default'},
    {label: '标准', value: 'div'},
    {label: '预定义', value: 'pre'},
    {label: '标题1', value: 'h1'},
    {label: '标题2', value: 'h2'},
    {label: '标题3', value: 'h3'},
    {label: '标题4', value: 'h4'},
    {label: '标题5', value: 'h5'},
    {label: '标题6', value: 'h6'},
    {label: '标题7', value: 'h7'}
  ];

  constructor() {}

  public triggerCommand(command: string): void {
    this.execute.emit(command);
    console.log(command, 'this is triggerCommand.');
  }
  /** 验证button是否隐藏 */
  public isButtonHidden(name: string): boolean {
    if (!name) return false;
    if (!(this.hiddenButtons instanceof Array)) {
      return false;
    }
    let result: any;
    for (const arr of this.hiddenButtons) {
      if (arr instanceof Array) {
        result = arr.find(item => item === name)
      }
      if (result) {
        break;
      }
    }
    return result !== undefined;
  }
}
