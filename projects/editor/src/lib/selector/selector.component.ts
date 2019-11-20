import { Component, OnInit, ViewEncapsulation, forwardRef, Input, HostBinding, Output, EventEmitter, ElementRef, Renderer2, ViewChildren, QueryList, AfterViewInit, HostListener, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

import { SelectOption, isDefined } from '../config';
import { SelectorDirective } from './selector.directive';
import { FocusKeyManager } from '@angular/cdk/a11y';
import {
  DOWN_ARROW,
  ENTER,
  LEFT_ARROW,
  RIGHT_ARROW,
  TAB,
  UP_ARROW
} from '@angular/cdk/keycodes';

@Component({
  selector: 'icy-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectorComponent),
      multi: true
    }
  ]
})
export class SelectorComponent implements OnInit, AfterViewInit, ControlValueAccessor {
  @ViewChild('labelButton') labelButton: ElementRef;
  @ViewChildren(SelectorDirective) selectorList: QueryList<SelectorDirective>;
  private managerKey: FocusKeyManager<SelectorDirective>;

  @Input() options: SelectOption[] = [];
  @Input('hidden') isHidden: boolean;
  @Input() disabled = false;

  public selectedOption: SelectOption;
  public activeIndex: number = 0;
  public opened: boolean = false;

  get label(): string {
    return this.selectedOption && this.selectedOption.hasOwnProperty('label') ? this.selectedOption.label : '请选择'
  }
  get value(): string {
    return this.selectedOption.value
  }

  @HostBinding('style.display') hidden = 'inline-block';
  @Output('change') public changeEvent = new EventEmitter();

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef,
  ) {
  }

  ngOnInit() {
    this.selectedOption = this.options[0];
    if (isDefined(this.isHidden) && this.isHidden) {
      this.hide();
    }
  }

  ngAfterViewInit(): void {
    this.managerKey = new FocusKeyManager(this.selectorList).withWrap();
    this.managerKey.setActiveItem(this.activeIndex);
  }

  onChange: any = () => { }
  onTouched: any = () => { }

  setDisabledState(isDisabled: boolean): void {
    const labelButtonElement = this.labelButton.nativeElement as HTMLElement;
    (<any>labelButtonElement).disabled = isDisabled;
    const classAction = isDisabled ? 'addClass' : 'removeClass'
    this.renderer[classAction](labelButtonElement, 'disabled');
    this.disabled = isDisabled;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(value: any): void {
    if (isDefined(value)) {
      const index = this.options.findIndex(item => item.value === value);
      this.setValue(index);
    }
  }

  private setValue(index: number): void {
    const current: any = this.options[index];
    if (!current.disabled) {
      this.activeIndex = index;
      this.selectedOption = this.options[index];
    }
  }

  public optionSelect(index: number, event: MouseEvent): void {
    event.stopPropagation();
    const current: any = this.options[index];
    if (!current.disabled) {
      this.setValue(index);
      this.onChange(this.selectedOption.value);
      this.changeEvent.emit(this.selectedOption.value);
      this.onTouched();
      this.close();
    }
  }

  private hide() {
    this.hidden = 'none';
  }

  get isOpen(): boolean {
    return this.opened;
  }

  public close(): void {
    this.opened = false;
  }

  public toggleOpen() {
    this.opened = !this.opened;
  }

  @HostListener('keydown', ['$event'])
  public keydown(event: KeyboardEvent): void {
    event.preventDefault();
    switch (event.keyCode) {
      case UP_ARROW:
      case LEFT_ARROW:
        this.managerKey.setPreviousItemActive();
        this.activeIndex = this.managerKey.activeItemIndex;
        break;
      case DOWN_ARROW:
      case RIGHT_ARROW:
      case TAB:
        this.managerKey.setNextItemActive();
        this.activeIndex = this.managerKey.activeItemIndex;
        break;
      case ENTER:
        this.setValue(this.managerKey.activeItemIndex);
        this.close();
        break;
    }
  }

  @HostListener('document:click', ['$event'])
  public onClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.close();
    }
  }
}
