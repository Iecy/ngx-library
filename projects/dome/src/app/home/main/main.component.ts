import { Component, OnInit } from '@angular/core';
import { WaterMarkerOption } from 'water-marker';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  public water: WaterMarkerOption = { text: '背景水印', setting: { fontSize: 40 } };
  constructor() { }

  ngOnInit() {
  }

}
