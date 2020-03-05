import { iLoopTimer, eTimeType } from './iLoopTimer';
/**
 * 校验是否是有效的小时
 * @param item
 * @param nowTime
 */
declare function isValidByHours(item: iLoopTimer, nowTime: Date): boolean;
/**
 * 校验传入的时间是否有效
 * @param time 用户传入的时间格式
 * @param lastTime 用户上一次执行过的时间, 可能是上一次的分,秒,小时,天,周,月
 * @param nowTime 现在的时间, 跟lastTime的类型要匹配上, 可以是分,秒,小时,天,周,月
 * @param reg 根据分,秒,小时,天,周,月 所以传入的正则也动态变化
 */
declare function isValidTime(time: string, lastTime: number, nowTime: number, reg: RegExp, type: eTimeType): boolean;
export { isValidByHours, isValidTime };
