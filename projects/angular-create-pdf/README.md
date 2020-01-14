# angular-create-pdf
> angular5+以上的版本可以使用


## 1、开始使用
  - <a href="#install">安装</a>
  - <a href="#use">使用</a>
  
## <a name="install">安装</a>

```
npm i angular-create-pdf
```
## <a name="use">使用</a>
``AngularCreatePdfModule``需添加到使用的``module``的文件中。此处以``AppModule``为例：

```javascript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AngularCreatePdfModule } from 'angular-create-pdf';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AngularCreatePdfModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

```javascript
import { Component, OnInit } from '@angular/core';
import { AngularCreatePdfService } from 'angular-create-pdf';

@Component({
  selector: 'app-pdf-demo',
  template: `
    <div #pdfContainer>
      <p>A cookie associated with a cross-site resource at  was set without the `SameSite` attribute. A future release of Chrome will only deliver cookies with cross-site requests if they are set with `SameSite=None` and `Secure`. You can review cookies in developer tools under Application>Storage>Cookies and see more details at  and .</p>
    </div>

    <button (click)="createPdfTem(pdfContainer)">生成PDF</button>
  `
})
export class AppPadDemoComponent {
   constructor(
    private pdfService: AngularCreatePdfService,
  ) { }

  ngOnInit() {    
  }

  public createPdfTem(ele: any) {
    this.pdfService.createPdf(ele, '我的PDF');
  }

}
```
