import { Component, EventEmitter, Output, ElementRef, Input, forwardRef, OnInit, OnDestroy, NgZone } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

declare var ace: any;

@Component({
  selector: 'c-ngx-ace',
  template: '',
  styles: [':host { display:block;width:100%;box-sizing: content-box;}'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NgxAceComponent),
    multi: true
  }]
})
export class NgxAceComponent implements ControlValueAccessor, OnInit, OnDestroy {

  @Output() textChanged = new EventEmitter();
  @Output() textChange = new EventEmitter();
  @Input() placeholder = '请输入内容';
  @Input() style: any = {};
  // tslint:disable-next-line:variable-name
  _options: any = {};
  // tslint:disable-next-line:variable-name
  _readOnly = false;
  // tslint:disable-next-line:variable-name
  _theme = 'monokai';
  // tslint:disable-next-line:variable-name
  _mode: any = 'sql';
  // tslint:disable-next-line:variable-name
  _autoUpdateContent = true;
  // tslint:disable-next-line:variable-name
  _editor: any;
  // tslint:disable-next-line:variable-name
  _durationBeforeCallback = 0;
  // tslint:disable-next-line:variable-name
  _text = '';
  oldText: any;
  timeoutSaving: any;

  constructor(private elementRef: ElementRef, private zone: NgZone) {
    const el = elementRef.nativeElement;
    this.zone.runOutsideAngular(() => {
      // tslint:disable-next-line:no-string-literal
      this._editor = ace['edit'](el);
    });
    this._editor.setOptions({
      enableBasicAutocompletion: true,
      enableSnippets: true,
      enableLiveAutocompletion: true,
      minLines: 1,
      maxLines: Infinity,
    });
    this._editor.$blockScrolling = Infinity;
    this._editor.setShowPrintMargin(false);
  }

  ngOnInit() {
    this.init();
    this.initEvents();
  }

  ngOnDestroy() {
    this._editor.destroy();
  }

  init() {
    this.setOptions(this._options || {});
    this.setTheme(this._theme);
    this.setMode(this._mode);
    this.setReadOnly(this._readOnly);
  }

  initEvents() {
    this._editor.on('change', () => this.updateText());
    this._editor.on('paste', () => this.updateText());
  }

  updateText() {
    const newVal = this._editor.getValue();
    if (newVal === this.oldText) {
      return;
    }
    if (!this._durationBeforeCallback) {
      this._text = newVal;
      this.zone.run(() => {
        this.textChange.emit(newVal);
        this.textChanged.emit(newVal);
      });
      this._onChange(newVal);
    } else {
      if (this.timeoutSaving) {
        clearTimeout(this.timeoutSaving);
      }

      this.timeoutSaving = setTimeout(() => {
        this._text = newVal;
        this.zone.run(() => {
          this.textChange.emit(newVal);
          this.textChanged.emit(newVal);
        });
        this.timeoutSaving = null;
      }, this._durationBeforeCallback);
    }
    this.oldText = newVal;
    this.emptyMessage();
  }

  @Input() set options(options: any) {
    this.setOptions(options);
  }

  setOptions(options: any) {
    this._options = options;
    this._editor.setOptions(options || {});
  }

  @Input() set readOnly(readOnly: any) {
    this.setReadOnly(readOnly);
  }

  setReadOnly(readOnly: any) {
    this._readOnly = readOnly;
    this._editor.setReadOnly(readOnly);
  }

  @Input() set theme(theme: any) {
    this.setTheme(theme);
  }

  setTheme(theme: any) {
    this._theme = theme;
    this._editor.setTheme(`ace/theme/${theme}`);
  }

  @Input() set mode(mode: any) {
    this.setMode(mode);
  }

  setMode(mode: any) {
    this._mode = mode;
    if (typeof this._mode === 'object') {
      this._editor.getSession().setMode(this._mode);
    } else {
      this._editor.getSession().setMode(`ace/mode/${this._mode}`);
    }
  }

  get value() {
    return this.text;
  }

  @Input()
  set value(value: string) {
    this.setText(value);
  }

  writeValue(value: any) {
    this.setText(value);
  }

  // tslint:disable-next-line:variable-name
  private _onChange = (_: any) => {
  }

  registerOnChange(fn: any) {
    this._onChange = fn;
  }

  // tslint:disable-next-line:variable-name
  private _onTouched = () => {
  }

  registerOnTouched(fn: any) {
    this._onTouched = fn;
  }

  get text() {
    return this._text;
  }

  @Input()
  set text(text: string) {
    this.setText(text);
  }

  setText(text: any) {
    if (text === null || text === undefined) {
      text = '';
    }
    if (this._text !== text && this._autoUpdateContent === true) {
      this._text = text;
      this._editor.setValue(text);
      this._onChange(text);
      this._editor.clearSelection();
    }
    this.emptyMessage();
  }

  @Input() set autoUpdateContent(status: any) {
    this.setAutoUpdateContent(status);
  }

  setAutoUpdateContent(status: any) {
    this._autoUpdateContent = status;
  }

  @Input() set durationBeforeCallback(num: number) {
    this.setDurationBeforeCallback(num);
  }

  setDurationBeforeCallback(num: number) {
    this._durationBeforeCallback = num;
  }

  /** 为空时增加placeholder提示信息 */
  private emptyMessage(): void {
    console.log(this._text, 'this is emptyMessage.');
    const shouldShow = !this._text.length;
    let node = this._editor.renderer.emptyMessageNode;
    if (!shouldShow && node) {
      this._editor.renderer.scroller.removeChild(this._editor.renderer.emptyMessageNode);
      this._editor.renderer.emptyMessageNode = null;
    } else if (shouldShow && !node) {
      node = this._editor.renderer.emptyMessageNode = document.createElement('div');
      node.textContent = this.placeholder;
      node.className = 'ace_emptyMessage';
      node.style.padding = '0 9px';
      node.style.position = 'absolute';
      node.style.zIndex = 9;
      node.style.opacity = 0.5;
      this._editor.renderer.scroller.appendChild(node);
    }
  }

  getEditor() {
    return this._editor;
  }

}
