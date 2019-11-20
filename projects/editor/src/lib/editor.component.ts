import { Component, OnInit, forwardRef, Input, AfterViewInit, OnDestroy, Renderer2, ViewChild, ElementRef, Output, EventEmitter, HostBinding, HostListener, Inject, Attribute } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { DOCUMENT } from '@angular/common';

import { defaultConfig, IcyEditorConfig, isDefined } from './config';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'icy-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EditorComponent),
      multi: true
    }
  ]
})
export class EditorComponent implements OnInit, ControlValueAccessor, AfterViewInit, OnDestroy {
  private _config: IcyEditorConfig;
  private modeVisual = true;
  private showPlaceholder = false;
  public disabled = false;
  public focused = false;
  public touched = false;
  public changed = false;

  public focusInstance: any;
  public blurInstance: any;

  @ViewChild('editor') textArea: ElementRef;
  @ViewChild('editorWrapper') editorWrapper: ElementRef;
  @ViewChild('editorToolbar') editorToolbar: ElementRef;

  @Input() id = '';
  @Input() placeholder = '';
  @Input() tabIndex: number | null;
  @Input() set config(setting: IcyEditorConfig) {
    this._config = Object.assign({}, defaultConfig, setting);
  }
  get config(): IcyEditorConfig {
    return this._config ? this._config : defaultConfig;
  }

  @Output() html;
  @Output('blur') blurEvent: EventEmitter<FocusEvent> = new EventEmitter<FocusEvent>();
  @Output('focus') focusEvent: EventEmitter<FocusEvent> = new EventEmitter<FocusEvent>();

  @HostBinding('attr.tabindex') tabindex = -1;

  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: any,
    private sanitizer: DomSanitizer,
    @Attribute('tabindex') defaultTabIndex: string,
    @Attribute('autofocus') private autoFocus: any,
  ) {
    const parsedTabIndex = Number(defaultTabIndex);
    this.tabIndex = (parsedTabIndex || parsedTabIndex === 0) ? parsedTabIndex : null;
  }

  private onChange: (value: string) => void;
  private onTouched: () => void;

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    if (isDefined(this.autoFocus)) {
      this.focus();
    }
  }

  ngOnDestroy(): void {}

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  registerOnChange(fn: any): void {
    this.onChange = e => (e === '<br>' ? fn('') : fn(e))
  }

  writeValue(value: any): void {
    console.log(value, 'this is write value.')
    if ((!value || value === '<br>' || value === '') !== this.showPlaceholder) {
      this.togglePlaceholder(this.showPlaceholder)
    }
    if (value === undefined || value === '' || value === '<br>') {
      value = null;
    }
    this.refreshView(value);
  }

  public refreshView(value: string): void {
    const normalizedValue = value === null ? '' : value;
    this.renderer.setProperty(this.textArea.nativeElement, 'innerHTML', normalizedValue);
    return;
  }

  public executeCommand(command: string): void {

  }

  private togglePlaceholder(value: boolean): void {
    console.log('this is toggle placeholder.', value);
    if (!value) {
      this.renderer.addClass(this.editorWrapper.nativeElement, 'show-placeholder');
      this.showPlaceholder = true;
    } else {
      this.renderer.removeClass(this.editorWrapper.nativeElement, 'show-placeholder');
      this.showPlaceholder = false;
    }
  }

  private focus() {
    if (this.modeVisual) {
      this.textArea.nativeElement.focus();
    } else {
      const sourceText = this.document.getElementById(`sourceText${this.id}`);
      sourceText.focus();
      this.focused = true;
    }
  }

  @HostListener('focus')
  public onFocus() {
    this.focus();
  }

}
