import { isString, isObject, memoize } from 'lodash';

import compose from './utils/compose';
import { transMsgExpression, transExpression } from './translate';

export function fillLimit(limit: string, sign: { [key: string]: string }): string;

export function fillLimit(limit: string, sign: string, signVal: string): string;

/**
 * 填充规则不等式
 * @param limit
 * @param sign
 * @param signVal
 * @example
 * // => '2000<=1'
 * fillLimit('sum<=1','sum','2000')
 * @example
 * // => '1000<=1&&2>=10'
 * fillLimit('sum<=1&&amount>=10',{sum:'1000',amount:'2'})
 */
export function fillLimit(limit, sign, signVal?) {
  let res = limit;
  if (isString(sign) && isString(signVal) && res.includes(limit)) {
    // 单个
    res = res.replace(new RegExp(sign, 'g'), signVal);
  } else if (isObject(sign)) {
    Object.keys(sign).map(key => {
      res = res.replace(new RegExp(key, 'g'), sign[key]);
    });
  }
  return res;
}

function limitToMsgBase(limit: string, sign: { [key: string]: string }): string;

function limitToMsgBase(limit: string, sign: string, signVal: string): string;

/**
 * 语义化表达式
 * @param limit
 * @param sign
 * @param signVal
 * @example
 * // => '采购金额小于等于1'
 * limitToMsg('sum<=1','sum','采购金额')
 * @example
 * // => '采购金额<=1并且数量大于等于10'
 * limitToMsg('sum<=1&&amount>=10',{sum:'采购金额',amount:'数量'})
 */
function limitToMsgBase(limit, sign, signVal?) {
  return fillLimit(
    compose(
      transMsgExpression,
      transExpression
    )(limit),
    sign,
    signVal
  );
}

export const limitToMsg = memoize(limitToMsgBase, (...agrs) => JSON.stringify(agrs));
