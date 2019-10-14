/**
 * 表达式正则校验 函数
 */
import { isString, isArray } from 'lodash';

import { EXPRESS_REG } from './configs/expressReg';

export function getCustomExpressReg(mark: string): RegExp;

export function getCustomExpressReg(mark: [string, string]): RegExp;

/**
 * 获取自定义标靶的正则表达式
 * @param mark
 * @example
 * // => /^(amount(<|<=|>|>=|=)\d+)((&&|\|\|)(amount(<|<=|>|>=|=)\d+))*$/
 * getCustomExpressReg('amount')
 * @example
 * // => /^(amount(<|<=|>|>=|=)\d+)((&&|\|\|)(sum(<|<=|>|>=|=)\d+))*$/
 * getCustomExpressReg(['amount','sum'])
 */
export function getCustomExpressReg(mark) {
  if (isString(mark)) {
    return new RegExp(`^(${mark}(<|<=|>|>=|=)\\\d+)((&&|\\|\\|)(${mark}(<|<=|>|>=|=)\\\d+))*$`);
  }
  if (isArray(mark)) {
    return new RegExp(
      `^(${mark[0]}(<|<=|>|>=|=)\\\d+)((&&|\\|\\|)(${mark[1]}(<|<=|>|>=|=)\\\d+))*$`
    );
  }
  throw Error('getCustomExpressReg 传入的参数非法');
}

/**
 * 使用默认 正则 校验表达式
 * @param rule
 */
export const checkExpress = (rule: string): boolean => EXPRESS_REG.test(rule);
