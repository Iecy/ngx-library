import { Component, OnInit } from '@angular/core';

import { CookieService } from 'cookie';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor(private cookieService: CookieService) { }

  ngOnInit() {
    this.cookieService.set('cookieTest', 'cookie test');
  }

}
