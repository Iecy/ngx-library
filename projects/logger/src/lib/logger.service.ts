import { Injectable, Optional, Inject } from '@angular/core';
import { ENABLE_CONSOLE } from './logger.token';

@Injectable()
export class LoggerService {
  constructor(@Optional() @Inject(ENABLE_CONSOLE) private enable: boolean) { }
  /**
   * 输出信息
   */
  get log(): Function {
    if (this.enable) {
      return console.log.bind(console);
    }
    return () => {};
  }
  /**
   * log别名，输出信息
   */
  get info(): Function {
    if (this.enable) {
      return console.info.bind(console);
    }
    return () => {};
  }

  get debug(): Function {
    if (this.enable) {
      return console.debug.bind(console);
    }
    return () => {};
  }
  /**
   * 输出信息时，在最前面加一个红色的叉，表示出错，同时会显示错误发生的堆栈。
   */
  get error(): Function {
    if (this.enable) {
      return console.error.bind(console);
    }
    return () => {};
  }
  /**
   * 输出警告信息
   */
  get warn(): Function {
    if (this.enable) {
      return console.warn.bind(console);
    }
    return () => {};
  }
  /**
   * @param boolean
   * @param string
   * @description 接受两个参数，只有当第一个参数为false，才会输出第二个参数，否则不输出任何东西
   */
  get assert(): Function {
    if (this.enable) {
      return console.assert.bind(console);
    }
    return () => {};
  }
  /**
   * 清除当前控制台的所有输出，将光标回置到第一行
   */
  get clear(): Function {
    return console.clear.bind(console);
  }
  /**
   * 用于计数，输出它被调用了多少次。
   */
  get count(): Function {
    if (this.enable) {
      return console.count.bind(console);
    }
    return () => {};
  }
  /**
   * 用于将显示的信息分组，可以把信息进行折叠和展开。
   */
  get group(): Function {
    if (this.enable) {
      return console.group.bind(console);
    }
    return () => {};
  }
  /**
   * 与group方法很类似，唯一的区别是该组的内容，在第一次显示时是收起的（collapsed），而不是展开的
   */
  get groupCollapsed(): Function {
    if (this.enable) {
      return console.groupCollapsed.bind(console);
    }
    return () => {};
  }
  /**
   * 	结束内联分组
   */
  get groupEnd(): Function {
    if (this.enable) {
      return console.groupEnd.bind(console);
    }
    return () => {};
  }
  /**
   * 将复合类型的数据转为表格显示
   */
  get table(): Function {
    if (this.enable) {
      return console.table.bind(console);
    }
    return () => {};
  }
  /**
   * 计时开始
   */
  get time(): Function {
    if (this.enable) {
      return console.time.bind(console);
    }
    return () => {};
  }
  /**
   * 计时结束
   */
  get timeEnd(): Function {
    if (this.enable) {
      return console.timeEnd.bind(console);
    }
    return () => {};
  }
  /**
   * 追踪函数的调用过程
   */
  get trace(): Function {
    if (this.enable) {
      return console.trace.bind(console);
    }
    return () => {};
  }
  /**
   * 性能分析器
   */
  get profile(): Function {
    if (this.enable) {
      return console.profile.bind(console);
    }
    return () => {};
  }
}
