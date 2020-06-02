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
        router: '/tools',
        title: '工具'
      },
      children: [
        {
          attributes: {
            router: null,
            title: 'cookie 目录很长目录很长目录很长目录很长目录很长目录很长',
            notLink: true,
            iconImage: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTcxNjQzMzU5ODYyIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEyODAgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjI5MTExIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgd2lkdGg9IjI1MCIgaGVpZ2h0PSIyMDAiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTY0MC4wMDIyNCAyNTZtLTY0IDBhNjQgNjQgMCAxIDAgMTI4IDAgNjQgNjQgMCAxIDAtMTI4IDBaIiBwLWlkPSIyOTExMiIgZmlsbD0iIzY3NzI4YyI+PC9wYXRoPjxwYXRoIGQ9Ik0xMDI0LjAwMjI0IDY0MG0tNjQgMGE2NCA2NCAwIDEgMCAxMjggMCA2NCA2NCAwIDEgMC0xMjggMFoiIHAtaWQ9IjI5MTEzIiBmaWxsPSIjNjc3MjhjIj48L3BhdGg+PHBhdGggZD0iTTI1Ni4wMDIyNCA2NDBtLTY0IDBhNjQgNjQgMCAxIDAgMTI4IDAgNjQgNjQgMCAxIDAtMTI4IDBaIiBwLWlkPSIyOTExNCIgZmlsbD0iIzY3NzI4YyI+PC9wYXRoPjxwYXRoIGQ9Ik0zMjMuMjAyMjQgMzIzLjJhNjQgNjQgMCAxIDAgOTAuNTYgMCA2NCA2NCAwIDAgMC05MC41NiAwek05NTYuODAyMjQgMzIzLjJhNjQgNjQgMCAxIDAgMCA5MC41NiA2NCA2NCAwIDAgMCAwLTkwLjU2eiIgcC1pZD0iMjkxMTUiIGZpbGw9IiM2NzcyOGMiPjwvcGF0aD48cGF0aCBkPSJNMTA5Mi40ODIyNCAxODcuNTJBNjQwIDY0MCAwIDAgMCAwLjAwMjI0IDY0MGE2MzQuODggNjM0Ljg4IDAgMCAwIDEyOCAzODRsOTEuNTItOTEuNTJBNTEyIDUxMiAwIDAgMSAxMDAxLjkyMjI0IDI3OC4wOGE1MTIgNTEyIDAgMCAxIDU4LjI0IDY1NC40TDExNTIuMDAyMjQgMTAyNGE2NDAgNjQwIDAgMCAwLTU5LjUyLTgzNi40OHoiIHAtaWQ9IjI5MTE2IiBmaWxsPSIjNjc3MjhjIj48L3BhdGg+PHBhdGggZD0iTTU1Ni44MDIyNCA3NTJhOTYgOTYgMCAwIDAgMTY2LjQgOTZjMjYuNTYtNDUuNzYgOTIuOC0zNTIgOTIuOC0zNTJzLTIzMi42NCAyMTAuMjQtMjU5LjIgMjU2eiIgcC1pZD0iMjkxMTciIGZpbGw9IiM2NzcyOGMiPjwvcGF0aD48L3N2Zz4='
          },
          children: [
            {
              attributes: {
                router: '/tools/cookie',
                title: 'cookie',
                iconImage: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTcxNjQzMzU5ODYyIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEyODAgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjI5MTExIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgd2lkdGg9IjI1MCIgaGVpZ2h0PSIyMDAiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTY0MC4wMDIyNCAyNTZtLTY0IDBhNjQgNjQgMCAxIDAgMTI4IDAgNjQgNjQgMCAxIDAtMTI4IDBaIiBwLWlkPSIyOTExMiIgZmlsbD0iIzY3NzI4YyI+PC9wYXRoPjxwYXRoIGQ9Ik0xMDI0LjAwMjI0IDY0MG0tNjQgMGE2NCA2NCAwIDEgMCAxMjggMCA2NCA2NCAwIDEgMC0xMjggMFoiIHAtaWQ9IjI5MTEzIiBmaWxsPSIjNjc3MjhjIj48L3BhdGg+PHBhdGggZD0iTTI1Ni4wMDIyNCA2NDBtLTY0IDBhNjQgNjQgMCAxIDAgMTI4IDAgNjQgNjQgMCAxIDAtMTI4IDBaIiBwLWlkPSIyOTExNCIgZmlsbD0iIzY3NzI4YyI+PC9wYXRoPjxwYXRoIGQ9Ik0zMjMuMjAyMjQgMzIzLjJhNjQgNjQgMCAxIDAgOTAuNTYgMCA2NCA2NCAwIDAgMC05MC41NiAwek05NTYuODAyMjQgMzIzLjJhNjQgNjQgMCAxIDAgMCA5MC41NiA2NCA2NCAwIDAgMCAwLTkwLjU2eiIgcC1pZD0iMjkxMTUiIGZpbGw9IiM2NzcyOGMiPjwvcGF0aD48cGF0aCBkPSJNMTA5Mi40ODIyNCAxODcuNTJBNjQwIDY0MCAwIDAgMCAwLjAwMjI0IDY0MGE2MzQuODggNjM0Ljg4IDAgMCAwIDEyOCAzODRsOTEuNTItOTEuNTJBNTEyIDUxMiAwIDAgMSAxMDAxLjkyMjI0IDI3OC4wOGE1MTIgNTEyIDAgMCAxIDU4LjI0IDY1NC40TDExNTIuMDAyMjQgMTAyNGE2NDAgNjQwIDAgMCAwLTU5LjUyLTgzNi40OHoiIHAtaWQ9IjI5MTE2IiBmaWxsPSIjNjc3MjhjIj48L3BhdGg+PHBhdGggZD0iTTU1Ni44MDIyNCA3NTJhOTYgOTYgMCAwIDAgMTY2LjQgOTZjMjYuNTYtNDUuNzYgOTIuOC0zNTIgOTIuOC0zNTJzLTIzMi42NCAyMTAuMjQtMjU5LjIgMjU2eiIgcC1pZD0iMjkxMTciIGZpbGw9IiM2NzcyOGMiPjwvcGF0aD48L3N2Zz4='
              },
              children: [
              ]
            }
          ]
        },
        {
          attributes: {
            router: null,
            title: 'logger',
            iconImage: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTcxNjQzMzU5ODYyIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEyODAgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjI5MTExIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgd2lkdGg9IjI1MCIgaGVpZ2h0PSIyMDAiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTY0MC4wMDIyNCAyNTZtLTY0IDBhNjQgNjQgMCAxIDAgMTI4IDAgNjQgNjQgMCAxIDAtMTI4IDBaIiBwLWlkPSIyOTExMiIgZmlsbD0iIzY3NzI4YyI+PC9wYXRoPjxwYXRoIGQ9Ik0xMDI0LjAwMjI0IDY0MG0tNjQgMGE2NCA2NCAwIDEgMCAxMjggMCA2NCA2NCAwIDEgMC0xMjggMFoiIHAtaWQ9IjI5MTEzIiBmaWxsPSIjNjc3MjhjIj48L3BhdGg+PHBhdGggZD0iTTI1Ni4wMDIyNCA2NDBtLTY0IDBhNjQgNjQgMCAxIDAgMTI4IDAgNjQgNjQgMCAxIDAtMTI4IDBaIiBwLWlkPSIyOTExNCIgZmlsbD0iIzY3NzI4YyI+PC9wYXRoPjxwYXRoIGQ9Ik0zMjMuMjAyMjQgMzIzLjJhNjQgNjQgMCAxIDAgOTAuNTYgMCA2NCA2NCAwIDAgMC05MC41NiAwek05NTYuODAyMjQgMzIzLjJhNjQgNjQgMCAxIDAgMCA5MC41NiA2NCA2NCAwIDAgMCAwLTkwLjU2eiIgcC1pZD0iMjkxMTUiIGZpbGw9IiM2NzcyOGMiPjwvcGF0aD48cGF0aCBkPSJNMTA5Mi40ODIyNCAxODcuNTJBNjQwIDY0MCAwIDAgMCAwLjAwMjI0IDY0MGE2MzQuODggNjM0Ljg4IDAgMCAwIDEyOCAzODRsOTEuNTItOTEuNTJBNTEyIDUxMiAwIDAgMSAxMDAxLjkyMjI0IDI3OC4wOGE1MTIgNTEyIDAgMCAxIDU4LjI0IDY1NC40TDExNTIuMDAyMjQgMTAyNGE2NDAgNjQwIDAgMCAwLTU5LjUyLTgzNi40OHoiIHAtaWQ9IjI5MTE2IiBmaWxsPSIjNjc3MjhjIj48L3BhdGg+PHBhdGggZD0iTTU1Ni44MDIyNCA3NTJhOTYgOTYgMCAwIDAgMTY2LjQgOTZjMjYuNTYtNDUuNzYgOTIuOC0zNTIgOTIuOC0zNTJzLTIzMi42NCAyMTAuMjQtMjU5LjIgMjU2eiIgcC1pZD0iMjkxMTciIGZpbGw9IiM2NzcyOGMiPjwvcGF0aD48L3N2Zz4='
          },
          children: [
            {
              attributes: {
                router: '/tools/logger',
                title: 'logger',
                iconImage: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTcxNjQzMzU5ODYyIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEyODAgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjI5MTExIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgd2lkdGg9IjI1MCIgaGVpZ2h0PSIyMDAiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTY0MC4wMDIyNCAyNTZtLTY0IDBhNjQgNjQgMCAxIDAgMTI4IDAgNjQgNjQgMCAxIDAtMTI4IDBaIiBwLWlkPSIyOTExMiIgZmlsbD0iIzY3NzI4YyI+PC9wYXRoPjxwYXRoIGQ9Ik0xMDI0LjAwMjI0IDY0MG0tNjQgMGE2NCA2NCAwIDEgMCAxMjggMCA2NCA2NCAwIDEgMC0xMjggMFoiIHAtaWQ9IjI5MTEzIiBmaWxsPSIjNjc3MjhjIj48L3BhdGg+PHBhdGggZD0iTTI1Ni4wMDIyNCA2NDBtLTY0IDBhNjQgNjQgMCAxIDAgMTI4IDAgNjQgNjQgMCAxIDAtMTI4IDBaIiBwLWlkPSIyOTExNCIgZmlsbD0iIzY3NzI4YyI+PC9wYXRoPjxwYXRoIGQ9Ik0zMjMuMjAyMjQgMzIzLjJhNjQgNjQgMCAxIDAgOTAuNTYgMCA2NCA2NCAwIDAgMC05MC41NiAwek05NTYuODAyMjQgMzIzLjJhNjQgNjQgMCAxIDAgMCA5MC41NiA2NCA2NCAwIDAgMCAwLTkwLjU2eiIgcC1pZD0iMjkxMTUiIGZpbGw9IiM2NzcyOGMiPjwvcGF0aD48cGF0aCBkPSJNMTA5Mi40ODIyNCAxODcuNTJBNjQwIDY0MCAwIDAgMCAwLjAwMjI0IDY0MGE2MzQuODggNjM0Ljg4IDAgMCAwIDEyOCAzODRsOTEuNTItOTEuNTJBNTEyIDUxMiAwIDAgMSAxMDAxLjkyMjI0IDI3OC4wOGE1MTIgNTEyIDAgMCAxIDU4LjI0IDY1NC40TDExNTIuMDAyMjQgMTAyNGE2NDAgNjQwIDAgMCAwLTU5LjUyLTgzNi40OHoiIHAtaWQ9IjI5MTE2IiBmaWxsPSIjNjc3MjhjIj48L3BhdGg+PHBhdGggZD0iTTU1Ni44MDIyNCA3NTJhOTYgOTYgMCAwIDAgMTY2LjQgOTZjMjYuNTYtNDUuNzYgOTIuOC0zNTIgOTIuOC0zNTJzLTIzMi42NCAyMTAuMjQtMjU5LjIgMjU2eiIgcC1pZD0iMjkxMTciIGZpbGw9IiM2NzcyOGMiPjwvcGF0aD48L3N2Zz4='
              }
            }
          ]
        },
        {
          attributes: {
            router: '/tools/full-screen',
            title: 'full-screen'
          }
        },
        {
          attributes: {
            router: '/tools/view-info',
            title: 'view-info'
          }
        },
        {
          attributes: {
            router: '/tools/angular-create-pdf',
            title: 'angular-create-pdf'
          }
        },
        {
          attributes: {
            router: 'https://www.baidu.com',
            title: '外部链接',
            outSideRouter: true,
            target: '_blank'
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
