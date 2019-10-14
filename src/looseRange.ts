/**
 * 获取表达式的宽泛区间
 */
import { isArray, memoize } from 'lodash';
import { lt, gt, lte, gte } from 'gmsoft-tools';

import { transExpression } from './translate';
import { EXPRESSION_TRANS_MAP } from './configs/marks';
import { getExpressStatic, CompareStaticMap } from './exeExpress';
import { getArrMin, getArrMax } from './utils/arrayTools';

const getMarkSides = (str: string, mark: string, type: 'right' | 'left') => {
  let res: string[] = [];
  if (str.includes(mark)) {
    const splitArr = str.split(mark);
    res = [
      splitArr[type === 'left' ? 0 : 1],
      ...getMarkSides(splitArr[type === 'left' ? 1 : 0], mark, type),
    ];
  }
  return res;
};

const getMinOrMaxInExpressionTools = (type: 'left' | 'right') =>
  type === 'left' ? getArrMin : getArrMax;

export const getMinOrMaxInExpression = (str: string, type: 'right' | 'left') =>
  getMinOrMaxInExpressionTools(type)([
    ...getMarkSides(transExpression(str), EXPRESSION_TRANS_MAP[type === 'left' ? '<' : '>'], type),
    ...getMarkSides(
      transExpression(str),
      EXPRESSION_TRANS_MAP[type === 'left' ? '<=' : '>='],
      type
    ),
  ]);

/**
 * 汇总所有不等式
 * @param str
 */
const getCompareStaticMap = (str: string | string[]) => {
  let compareStaticMap: CompareStaticMap = new Map();
  if (isArray(str)) {
    str.map(istr => {
      const curMap = getExpressStatic(istr);
      [...curMap.keys()].map(key => {
        const compareItem = compareStaticMap.get(key);
        if (compareItem) {
          const newSet: Set<string> = new Set(compareItem);
          const curSet = curMap.get(key);
          if (curSet) {
            [...curSet].map(csItem => {
              newSet.add(csItem);
            });
          }
          compareStaticMap.set(key, newSet);
        } else {
          const newSet: Set<string> = new Set();
          const curSet = curMap.get(key);
          if (curSet) {
            [...curSet].map(csItem => {
              newSet.add(csItem);
            });
          }
          compareStaticMap.set(key, newSet);
        }
      });
    });
  } else {
    compareStaticMap = getExpressStatic(str);
  }
  return compareStaticMap;
};

/**
 * 按不等式，取出
 * <|<= 最小值
 * >|>= 最大值
 * @param compareStaticMap
 * @param fill
 */
const getCompareMaxMinValueMap = (compareStaticMap: CompareStaticMap, fill: string) => {
  const staticObj: { [key: string]: string } = {};
  /* eslint-disable no-restricted-syntax */
  /* eslint-disable prefer-const */
  for (let [key, value] of compareStaticMap) {
    if (value) {
      if (value.has(fill)) {
        value.delete(fill);
      }
      const vals = [...value];
      if (key === EXPRESSION_TRANS_MAP['<'] || key === EXPRESSION_TRANS_MAP['<=']) {
        staticObj[key] = getArrMax(vals);
      } else if (key === EXPRESSION_TRANS_MAP['>'] || key === EXPRESSION_TRANS_MAP['>=']) {
        staticObj[key] = getArrMin(vals);
      }
    }
  }
  /* eslint-enable no-restricted-syntax */
  /* eslint-enable prefer-const */
  return staticObj;
};

/**
 * 处理 大于、小于 和 分别含等的 宽泛区间
 * @param staticObj
 */
const fillterEqualSign = (staticObj: { [key: string]: string }) => {
  const newStaticObj: { [key: string]: string } = {};

  const ltVal = staticObj[EXPRESSION_TRANS_MAP['<']];
  const lteVal = staticObj[EXPRESSION_TRANS_MAP['<=']];
  const gtVal = staticObj[EXPRESSION_TRANS_MAP['>']];
  const gteVal = staticObj[EXPRESSION_TRANS_MAP['>=']];

  if (ltVal || lteVal) {
    if (ltVal && lteVal) {
      if (gt(ltVal, lteVal)) {
        newStaticObj[EXPRESSION_TRANS_MAP['<']] = ltVal;
      } else {
        newStaticObj[EXPRESSION_TRANS_MAP['<=']] = lteVal;
      }
    } else if (ltVal) {
      newStaticObj[EXPRESSION_TRANS_MAP['<']] = ltVal;
    } else if (lteVal) {
      newStaticObj[EXPRESSION_TRANS_MAP['<=']] = lteVal;
    }
  }

  if (gtVal || gteVal) {
    if (gtVal && gteVal) {
      if (lt(gtVal, gteVal)) {
        newStaticObj[EXPRESSION_TRANS_MAP['>']] = gtVal;
      } else {
        newStaticObj[EXPRESSION_TRANS_MAP['>=']] = gteVal;
      }
    } else if (gtVal) {
      newStaticObj[EXPRESSION_TRANS_MAP['>']] = gtVal;
    } else if (gteVal) {
      newStaticObj[EXPRESSION_TRANS_MAP['>=']] = gteVal;
    }
  }
  return newStaticObj;
};

const getExpressionLooseRangeBase = (str: string | string[], fill: string) =>
  fillterEqualSign(getCompareMaxMinValueMap(getCompareStaticMap(str), fill));

/**
 * 取出表达式的宽松区间
 * @param str 表达式
 */
export const getExpressionLooseRange = memoize(getExpressionLooseRangeBase, (...agrs) =>
  JSON.stringify(agrs)
);

/**
 * 将值 与 区间 进行比较
 * 只支持 && 的情况
 * @param range
 * @param value
 */
const doCompareWithExpressionRangeBase = (
  range: {
    [key: string]: string;
  },
  value: string
) => {
  const ltVal = range[EXPRESSION_TRANS_MAP['<']];
  const lteVal = range[EXPRESSION_TRANS_MAP['<=']];
  const gtVal = range[EXPRESSION_TRANS_MAP['>']];
  const gteVal = range[EXPRESSION_TRANS_MAP['>=']];
  if (ltVal || lteVal || gtVal || gteVal) {
    if (ltVal && gte(value, ltVal)) {
      return false;
    }
    if (lteVal && gt(value, lteVal)) {
      return false;
    }
    if (gtVal && lte(value, gtVal)) {
      return false;
    }
    if (gteVal && lt(value, gteVal)) {
      return false;
    }
    return true;
  }
  return false;
};
/**
 * 将值 与 区间 进行比较
 * 只支持 && 的情况
 * @param range
 * @param value
 */
export const doCompareWithExpressionRange = memoize(doCompareWithExpressionRangeBase, (...agrs) =>
  JSON.stringify(agrs)
);
