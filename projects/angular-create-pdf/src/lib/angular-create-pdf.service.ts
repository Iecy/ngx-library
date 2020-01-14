import { Injectable } from '@angular/core';
import html2canvas from 'html2canvas';
import * as jsPDF from 'jspdf';

@Injectable()
export class AngularCreatePdfService {
  constructor() { }

  public createPdf(ele: HTMLElement, name: string) {
		this._create(ele, name);
  }


	private _create(ele: HTMLElement, name: string) {
		const pdf = new jsPDF();
		const h = ele.clientHeight;
		const w = ele.clientWidth;
		html2canvas(ele).then(canvas => {
      const contentWidth = canvas.width;
      const contentHeight = canvas.height;
      const pageHeight = contentWidth / 592.28 * 841.89;
      let leftHeight = contentHeight;
      let position =  0;
      const imgWidth = 595.28;
      const imgHeight = 592.28 / contentWidth * contentHeight;
      const pageData = canvas.toDataURL('image/jpeg', 1.0 );
      const pdf = new jsPDF('p', 'pt', 'a4');

      if (leftHeight < pageHeight) {
        pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight);
      } else {
        while (leftHeight > 0) {
          pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight);
          leftHeight -= pageHeight;
          position -= 841.89;
          // 避免添加空白页
          if (leftHeight > 0) {
            pdf.addPage();
          }
        }
      }
      pdf.save(name + '.pdf');
    });
	}

}
