/**
 * cookie参数
 * @description
 * @param path 路径
 * @param domain cookie作用到的域
 * @param expires 失效时长
 * @param httpOnly 是否只读
 * @param storeUnencoded 如果是“true”，那么cookie值将不会被编码，而是按照提供的方式存储。
 */
export interface CookieOptions {
  path?: string;
  domain?: string;
  expires?: string|Date;
  secure?: boolean;
  httpOnly?: boolean;
  storeUnencoded?: boolean;
}
