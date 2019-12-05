import { Component, OnInit } from '@angular/core';
import { LoggerService } from 'logger';
@Component({
  selector: 'app-logger',
  templateUrl: './logger.component.html',
  styleUrls: ['./logger.component.css']
})
export class LoggerComponent implements OnInit {
  public logger: string;
  constructor(private loggerService: LoggerService) { }

  ngOnInit() {
    this.loggerService.log('%c这就输出了。', 'color: green');
    this.loggerService.error('我是错误的输出。');
  }

  setLogger(): void {
    this.loggerService.log(`%c${this.logger}`, 'color: orange');
  }

}
