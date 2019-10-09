/**
 * 表达式正则
 */

/** 表达式 限额正则 */
export const EXPRESS_REG = /^(sum(<|<=|>|>=|=)\d+)((&&|\|\|)(sum(<|<=|>|>=|=)\d+))*$/;

/** 表达式 错误提示 */
export const EXPRESS_REG_ERROR_MSG = '请输入有效表达式逻辑（sum<=2000&&sum>10000）';
