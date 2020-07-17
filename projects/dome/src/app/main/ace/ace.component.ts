import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ace',
  templateUrl: './ace.component.html',
  styleUrls: ['./ace.component.css']
})
export class AceComponent implements OnInit {
  public aclOptions = {
    // enableBasicAutocompletion: true,
    // enableSnippets: true,
    // enableLiveAutocompletion: true,
    // showGutter: false,
    // maxLines: 3,
    // minLines: 4,
    // autoScrollEditorIntoView: false,
  };

  public aceText = '';
  constructor() { }

  ngOnInit() {
  }

  public change(value): void {
    console.log(value);
  }

}
