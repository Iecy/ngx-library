/** 设置 */
interface Setting {
  /** 字体大小 */
  fontSize?: number;
  /** 旋转角度 */
  rotate?: number;
  /** 内容间隔 */
  gap?: number;
  /** 水印字体颜色 */
  color?: string;
}
/** 水印参数 */
export interface WaterMarkerOption {
  /** 水印文本 */
  text: string;
  /** 水印设置信息 */
  setting?: Setting;
}
