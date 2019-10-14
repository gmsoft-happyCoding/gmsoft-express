/**
 * 执行表达式
 */
import { isBoolean, isString, memoize } from 'lodash';

import {
  ExpressionTransMark,
  LOGIC_TRANS_OR,
  LOGIC_TRANS_AND,
  COMPARE_TRANS_MARKS,
  EXPRESSION_TRANS_FUNC_MAP,
} from './configs/marks';
import compose from './utils/compose';
import { transExpression } from './translate';

/** 基础数据类型 */
type BasicDataType = string | boolean;

/** 是否是 基础数据类型 */
const isBasicData = (data: any): data is boolean | string => isBoolean(data) || isString(data);

/** 执行域 */
interface ExeGroupItem {
  exeFunc: ExpressionTransMark;
  paramA: BasicDataType | ExeGroupItem;
  paramB: BasicDataType | ExeGroupItem;
}

/**
 * 定位 string 中 目标str[] 最先出现的 str 及 index
 * @param str
 * @param marks
 */
const findFirstMarkIndex = <T extends string = string>(
  str: string,
  marks: T[]
): [undefined, -1] | [T, number] => {
  let result: [undefined, -1] | [T, number] = [undefined, -1];

  if (str && str.length && marks && marks.length) {
    marks.map(mark => {
      const ci = str.indexOf(mark);
      if (ci !== -1 && ((result[1] !== -1 && ci < result[1]) || result[1] === -1)) {
        result = [mark, ci];
      }
    });
  }

  return result;
};

/** 分割参数 */
const getParams = (str: string, mark: string) => str.split(mark);

/**
 * 获取 执行组结构
 * @param str
 */
export const getExeGroup = (str: string): ExeGroupItem => {
  // 1 处理 逻辑或 ||
  if (str.includes(LOGIC_TRANS_OR)) {
    const [paramA, paramB] = getParams(str, LOGIC_TRANS_OR);
    return {
      exeFunc: LOGIC_TRANS_OR,
      paramA: getExeGroup(paramA),
      paramB: getExeGroup(paramB),
    };
  }
  // 2 处理 逻辑与 &&
  if (str.includes(LOGIC_TRANS_AND)) {
    const [paramA, paramB] = getParams(str, LOGIC_TRANS_AND);
    return {
      exeFunc: LOGIC_TRANS_AND,
      paramA: getExeGroup(paramA),
      paramB: getExeGroup(paramB),
    };
  }

  // 3 处理 比较运算符
  const [compareMark] = findFirstMarkIndex(str, COMPARE_TRANS_MARKS);

  if (compareMark) {
    const [paramA, paramB] = getParams(str, compareMark);
    // 再次尝试取值，如果还能取到比较运算符则报错
    const [moreCompareMark] = findFirstMarkIndex(paramB, COMPARE_TRANS_MARKS);
    if (moreCompareMark) {
      throw Error(`解释器错误，${str} 含有多余比较运算符： ${moreCompareMark}`);
    }
    return {
      exeFunc: compareMark,
      paramA,
      paramB,
    };
  }

  throw Error(`解释器错误，${str} 没有支持解析的运算符`);
};

/** 按分组结构执行 */
const doExeGroup = (group: ExeGroupItem) =>
  EXPRESSION_TRANS_FUNC_MAP[group.exeFunc](
    isBasicData(group.paramA) ? group.paramA : doExeGroup(group.paramA),
    isBasicData(group.paramB) ? group.paramB : doExeGroup(group.paramB)
  );

const exeExpressBase = (rule: string) =>
  compose<boolean | any>(
    doExeGroup,
    getExeGroup,
    transExpression
  )(rule);

/** 执行比较 */
export const exeExpress = memoize(exeExpressBase);

export type CompareStaticMap = Map<string, Set<string>>;

/**
 * 统计、分类操作符
 * @param group
 * @param staticMap
 */
const getMarksStatic = (group: ExeGroupItem, staticMap?: CompareStaticMap): CompareStaticMap => {
  let result = staticMap ? new Map(staticMap) : new Map();

  const params = result.get(group.exeFunc);
  if (params) {
    const newParams = new Set(params);
    if (isBasicData(group.paramA)) {
      if (isString(group.paramA)) {
        newParams.add(group.paramA);
        result.set(group.exeFunc, newParams);
      }
    } else {
      result = getMarksStatic(group.paramA, result);
    }
    if (isBasicData(group.paramB)) {
      if (isString(group.paramB)) {
        newParams.add(group.paramB);
        result.set(group.exeFunc, newParams);
      }
    } else {
      result = getMarksStatic(group.paramB, result);
    }
  } else {
    const newParams: Set<string> = new Set(params);
    if (isBasicData(group.paramA)) {
      if (isString(group.paramA)) {
        newParams.add(group.paramA);
        result.set(group.exeFunc, newParams);
      }
    } else {
      result = getMarksStatic(group.paramA, result);
    }
    if (isBasicData(group.paramB)) {
      if (isString(group.paramB)) {
        newParams.add(group.paramB);
        result.set(group.exeFunc, newParams);
      }
    } else {
      result = getMarksStatic(group.paramB, result);
    }
  }
  return result;
};

const getExpressStaticBase = (rule: string) =>
  compose(
    getMarksStatic,
    getExeGroup,
    transExpression
  )(rule);

/** 统计操作符 */
export const getExpressStatic = memoize(getExpressStaticBase);
