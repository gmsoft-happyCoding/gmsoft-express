import {
  ALL_EXPRESSIONS,
  EXPRESSION_TRANS_MAP,
  EXPRESSION_TRANS_FUNC_MAP,
  EXPRESSION_TRANS_MSG_MAP,
} from './configs/marks';

/**
 * 转译 表达式
 * @param str
 */
export const transExpression = (str: string) => {
  let res = str;
  ALL_EXPRESSIONS.map(item => {
    if (res.includes(item)) {
      res = res.replace(new RegExp(item, 'g'), EXPRESSION_TRANS_MAP[item]);
    }
  });
  return res;
};
/**
 * 转译 表达式 为 提示信息
 * @param str
 */
export const transMsgExpression = (str: string) => {
  let res = str;
  Object.keys(EXPRESSION_TRANS_FUNC_MAP).map(item => {
    if (res.includes(item)) {
      res = res.replace(new RegExp(item, 'g'), EXPRESSION_TRANS_MSG_MAP[item]);
    }
  });
  return res;
};
