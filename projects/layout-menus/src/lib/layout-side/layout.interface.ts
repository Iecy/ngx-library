export interface LogoConfig {
  title: string;
  logoImg: string;
  outsideIcon: string;
}

export interface Menu {
  id?: string | number;
  attributes: Attribute;
  children: Array<Menu>;
  [propName: string]: any;
}

interface Attribute {
  /** 路由名称 */
  title: string;
  /** 路由地址 */
  router: string;
  /** 路由图标 */
  iconImage?: string;
  /** 是否展开 */
  show?: boolean;
  /** 是否第三方菜单 */
  outSideRouter?: boolean;
  /** 地方方地址打开方式 */
  target?: '_blank' | '_top' | '_parent' | '_self';
  /** 接受任意属性 */
  [propName: string]: any;
}
