import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'dome';

  public isCollapsed = false;
  public menuList = [
    {
      attributes: {
        outsideIcon: null,
        router: '/main',
        title: '工具'
      },
      children: [
        {
          attributes: {
            router: '/main/main',
            title: 'cookie'
          },
          children: []
        },
        {
          attributes: {
            router: '/main/logger',
            title: 'logger'
          }
        }
      ]
    },
    {
      attributes: {
        outsideIcon: null,
        router: '/water-marker',
        title: '水印'
      },
      children: [
        {
          attributes: {
            outsideIcon: 'water-marker',
            router: '/water-marker/main',
            title: '水印使用'
          },
          children: []
        }
      ]
    },
  ];
  public leftMenu = [];
  logoConfig = {
    title: '权限管理',
    outsideIcon: 'menu',
    logoImg: '../assets/logo.png'
  };

  clickm(res) {
    setTimeout(() => {
      this.leftMenu = res.children;
    }, 30);
  }
}
