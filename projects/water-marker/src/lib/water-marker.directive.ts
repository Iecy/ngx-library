import { Directive, Input, OnInit, ElementRef, NgZone } from '@angular/core';
import { WaterMarkerOption } from './water-marker.model';

@Directive({
  selector: '[cWaterMarker]',
  exportAs: 'c-water-marker'
})
export class WaterMarkerDirective implements OnInit {
  @Input() public cWaterMarker: WaterMarkerOption;
  private originSize: { width: number; height: number };
  private defaultConfig: WaterMarkerOption;

  constructor(private elementRef: ElementRef, private ngZone: NgZone) {
    this.originSize = {
      width: this.elementRef.nativeElement.offsetWidth,
      height: this.elementRef.nativeElement.offsetHeight
    };
    this.defaultConfig = {
      text: '加密信息',
      setting: {
        fontSize: 20,
        rotate: 30,
        gap: 60,
        color: '#cc0000'
      }
    };
  }

  ngOnInit(): void {
    this.cWaterMarker.text = (this.cWaterMarker && this.cWaterMarker.text) || this.defaultConfig.text;
    this.cWaterMarker.setting = this.cWaterMarker ?
      Object.assign({}, this.defaultConfig.setting, this.cWaterMarker.setting) :
      this.defaultConfig.setting;
    this.ngZone.runOutsideAngular(() => {
      if (this.elementRef.nativeElement !== null) {
        setTimeout(() => {
          this.renderWater();
        }, 130);
      }
    });
  }

  private renderWater(): void {
    const native = this.elementRef.nativeElement;
    this.originSize.height = native.offsetHeight < 400 ? 400 : native.offsetHeight;
    this.originSize.width = native.offsetWidth < 500 ? 200 : native.offsetWidth;
    const water = document.createElement('canvas');
    const parentElement = this.elementRef.nativeElement as HTMLElement;
    parentElement.appendChild(water);
    water.width = this.originSize.width;
    water.height = this.originSize.height;
    water.style.display = 'none';

    const content = water.getContext('2d');
    let horizontalWidth = content.measureText(this.cWaterMarker.text).width;
    horizontalWidth = Math.sqrt(horizontalWidth * horizontalWidth / 2) + this.cWaterMarker.setting.fontSize;

    content.font = `${this.cWaterMarker.setting.fontSize}px Microsoft JhengHei`;
    content.fillStyle = 'rgba(245, 245, 245, 1)';

    const draw = (x, y) => {
      content.save();
      content.translate(x, y);
      content.rotate(-this.cWaterMarker.setting.rotate * Math.PI / 180);
      content.fillText(this.cWaterMarker.text, 0, 0);
      content.restore();
    };

    for (let i = 0; i < this.originSize.width; i += horizontalWidth + this.cWaterMarker.setting.gap) {
      for (let j = 0; j < this.originSize.height; j += horizontalWidth + this.cWaterMarker.setting.gap) {
        draw(i, j);
      }
    }

    const image = water.toDataURL('image/png');
    parentElement.style.backgroundImage = `url(${image})`;
    water.remove();
  }
}
