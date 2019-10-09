/**
 * 数组工具函数
 * @param arr
 */
import { lt, gt } from 'gmsoft-tools';

export const getArrMin = (arr: string[]) => {
  let min = arr[0];
  arr.map(item => {
    if (lt(item, min)) {
      min = item;
    }
  });
  return min;
};
export const getArrMax = (arr: string[]) => {
  let max = arr[0];
  arr.map(item => {
    if (gt(item, max)) {
      max = item;
    }
  });
  return max;
};
