import { Component, OnInit } from '@angular/core';

const testLayout = [
  { "x": 0, "y": 0, "w": 2, "h": 2, "i": "0", resizable: false, draggable: false, static: false },
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
  public layout = JSON.parse(JSON.stringify(testLayout));

  constructor() { }

  ngOnInit() {
  }

}
