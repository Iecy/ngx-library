import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';

const testLayout = [
  { "x": 0, "y": 0, "w": 2, "h": 2, "i": "0", minW: 3, resizable: false, draggable: false, static: false },
  { "x": 2, "y": 0, "w": 2, "h": 4, "i": "1", resizable: false, draggable: false, static: false },
  { "x": 4, "y": 0, "w": 2, "h": 5, "i": "2", resizable: false, draggable: false, static: false },
  { "x": 6, "y": 0, "w": 2, "h": 3, "i": "3", resizable: false, draggable: false, static: false },
  { "x": 8, "y": 0, "w": 2, "h": 3, "i": "4", resizable: false, draggable: false, static: false },
  { "x": 10, "y": 0, "w": 2, "h": 3, "i": "5", resizable: false, draggable: false, static: false },
  { "x": 0, "y": 5, "w": 2, "h": 5, "i": "6", resizable: false, draggable: false, static: false },
  { "x": 2, "y": 5, "w": 2, "h": 5, "i": "7", resizable: false, draggable: false, static: false },
  { "x": 4, "y": 5, "w": 2, "h": 5, "i": "8", resizable: false, draggable: false, static: false },
  { "x": 6, "y": 3, "w": 2, "h": 4, "i": "9", resizable: false, draggable: false, static: true },
  { "x": 8, "y": 4, "w": 2, "h": 4, "i": "10", resizable: false, draggable: false, static: false },
  { "x": 10, "y": 4, "w": 2, "h": 4, "i": "11", resizable: false, draggable: false, static: false },
  { "x": 0, "y": 10, "w": 2, "h": 5, "i": "12", resizable: false, draggable: false, static: false },
  { "x": 2, "y": 10, "w": 2, "h": 5, "i": "13", resizable: false, draggable: false, static: false },
  { "x": 4, "y": 8, "w": 2, "h": 4, "i": "14", resizable: false, draggable: false, static: false },
  { "x": 6, "y": 8, "w": 2, "h": 4, "i": "15", resizable: false, draggable: false, static: false },
  { "x": 8, "y": 10, "w": 2, "h": 5, "i": "16", resizable: false, draggable: false, static: false },
  { "x": 10, "y": 4, "w": 2, "h": 2, "i": "17", resizable: false, draggable: false, static: false },
  { "x": 0, "y": 9, "w": 2, "h": 3, "i": "18", resizable: false, draggable: false, static: false },
  { "x": 2, "y": 6, "w": 2, "h": 2, "i": "19", resizable: false, draggable: false, static: false }
];

@Component({
  selector: 'app-grid-layout',
  templateUrl: './grid-layout.component.html',
  styleUrls: ['./grid-layout.component.css']
})
export class GridLayoutComponent implements OnInit {
  @ViewChild('content') public contentEl: ElementRef;
  public layout = JSON.parse(JSON.stringify(testLayout));
  public index: number = 0;
  public draggable = true;
  public resizable = true;
  public mirrored = false;
  public responsive = true;
  public useCssTransform = true;
  public preventCollision = false;
  public rowHeight = 30;
  public colNum = 12;
  public cols = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 };

  constructor(
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    this.index = this.layout.length;
    console.log(this.layout, 'this is demo init layout');
  }

  layoutChanged(layout: any): void {
    console.log('LAYOUT CHANGED:', layout);
  }

  layoutReady(layout: any): void {
    console.log('LAYOUT READY: ', layout);
  }

  containerResized(layoutItem: any): void {
    console.log('CONTAINER RESIZED:', layoutItem);
  }

  public decreaseWidth(): void {
    const conentHtml: HTMLElement = this.contentEl.nativeElement;
    let width = conentHtml.offsetWidth;
    width -= 20;
    this.renderer.setStyle(this.contentEl.nativeElement, 'width', `${width}px`);
  }

  public increaseWidth(): void {
    const conentHtml: HTMLElement = this.contentEl.nativeElement;
    let width = conentHtml.offsetWidth;
    width += 20;
    this.renderer.setStyle(this.contentEl.nativeElement, 'width', `${width}px`);
  }

  public addItem(): void {
    const item = { "x": 0, "y": 0, "w": 2, "h": 2, "i": this.index + "", whatever: "bbb" };
    this.index++;
    this.layout = [...this.layout, item];
  }

  onChangeModel(e: any): void {
    if (e) {
      this.cols = { lg: 2, md: 2, sm: 2, xs: 2, xxs: 2 };
    } else {
      this.cols = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 };
    }
    console.log(e, 'this is onChangeModel.')
  }
  trackByFn(index) { return index }
}
