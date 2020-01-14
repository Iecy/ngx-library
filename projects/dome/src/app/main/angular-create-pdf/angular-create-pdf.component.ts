import { Component, OnInit } from '@angular/core';
import { AngularCreatePdfService } from 'angular-create-pdf';
@Component({
  selector: 'angular-create-pdf',
  templateUrl: './angular-create-pdf.component.html',
})
export class AngularCreatePdfComponent implements OnInit {
  constructor(
    private pdfService: AngularCreatePdfService,
  ) { }

  ngOnInit() {    
  }

  public createPdfTem(ele: any) {
    this.pdfService.createPdf(ele, '我的PDF');
  }

}
