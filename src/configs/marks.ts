import { lte, lt, gt, gte, isStrNumEqual } from '@gmsoft/tools';

import { logicAnd, logicOr } from '../utils/logic';

/** 表达式符号 */
export type ExpressionMark = '<=' | '<' | '=' | '>=' | '>' | '&&' | '||';

/** 表达式转译符号 */
export type ExpressionTransMark =
  | '__lte__'
  | '__lt__'
  | '__equal__'
  | '__gte__'
  | '__gt__'
  | '__and__'
  | '__or__';

/** 逻辑或 转译符 */
export const LOGIC_TRANS_OR = '__or__';

/** 逻辑与 转译符 */
export const LOGIC_TRANS_AND = '__and__';

/** 表达式符号 - 转译符号 映射 */
export const EXPRESSION_TRANS_MAP = {
  '<=': '__lte__',
  '<': '__lt__',
  '=': '__equal__',
  '>=': '__gte__',
  '>': '__gt__',
  '&&': LOGIC_TRANS_AND,
  '||': LOGIC_TRANS_OR,
};

/** 表达式符号 - 正则匹配转译 映射 */
export const EXPRESSION_REG_MAP = {
  '<=': /<=/g,
  '<': /</g,
  '=': /=/g,
  '>=': />=/g,
  '>': />/g,
  '&&': /&&/g,
  '||': /\|\|/g,
};

/** 表达式转译符号 - 函数 映射 */
export const EXPRESSION_TRANS_FUNC_MAP = {
  __lte__: lte,
  __lt__: lt,
  __gte__: gte,
  __gt__: gt,
  __equal__: isStrNumEqual,
  __and__: logicAnd,
  __or__: logicOr,
};

/** 表达式转译符号 - 文字描述 映射 */
export const EXPRESSION_TRANS_MSG_MAP = {
  __lte__: '小于等于',
  __lt__: '小于',
  __gte__: '大于等于',
  __gt__: '大于',
  __equal__: '等于',
  __and__: '并且',
  __or__: '或者',
};

/** 逻辑运算符 */
export const LOGIC_MARKS = ['&&', '||'];

/** 逻辑运算符-转译 */
export const LOGIC_TRANS_MARKS: ExpressionTransMark[] = LOGIC_MARKS.map(
  item => EXPRESSION_TRANS_MAP[item]
);
/** 比较运算符 */
export const COMPARE_MARKS = ['<=', '<', '>=', '>', '='];

/** 比较运算符-转译 */
export const COMPARE_TRANS_MARKS: ExpressionTransMark[] = COMPARE_MARKS.map(
  item => EXPRESSION_TRANS_MAP[item]
);
/** 所有符号 */
export const ALL_EXPRESSIONS = [...COMPARE_MARKS, ...LOGIC_MARKS];
