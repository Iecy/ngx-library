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
        title: '测试主页'
      },
      children: [
        {
          attributes: {
            outsideIcon: 'home',
            router: '/main/main',
            title: '概览数据'
          },
          children: []
        }
      ]
    },
    {
      attributes: {
        outsideIcon: null,
        router: '/home',
        title: '测试主页2'
      },
      children: [
        {
          attributes: {
            outsideIcon: 'home',
            router: '/home/main',
            title: '概览数据2'
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
    console.log(res);
    this.leftMenu = res.children;
  }
}
