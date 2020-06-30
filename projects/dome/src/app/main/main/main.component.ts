import { Component, OnInit } from '@angular/core';

import { CookieService } from 'cookie';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  public cookieValue: string;
  constructor(private cookieService: CookieService) { }

  ngOnInit() {
    this.cookieValue = this.cookieService.get('cookieTest');
    this.cookieService.set('cookieTest', 'cookie test');
  }

  public setCookie(): void {
    if (this.cookieValue) {
      this.cookieService.set('cookieTest', this.cookieValue);
    }
  }

  public deleteCookie(): void {
    this.cookieService.remove('cookieTest');
  }

}
