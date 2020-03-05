"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const iLoopTimer_1 = require("./iLoopTimer");
/**
 * 校验是否是有效的小时
 * @param item
 * @param nowTime
 */
function isValidByHours(item, nowTime) {
    let info = item.frequency;
    let reg = new RegExp(/^\d+\,\d+$/);
    if (reg.test(info.hour)) {
        let [s1, s2] = info.hour.split(',');
        let h1 = Number(s1);
        let h2 = Number(s2);
        let hour = nowTime.getHours();
        if (h1 <= hour && hour <= h2) {
            return true;
        }
    }
    else if (Number(info.hour) >= 0) {
        let hour = Number(info.hour);
        return nowTime.getHours() === hour;
    }
    else if (/^\*\/[1-9]$|^\*\/[1-2][0-4]$/.test(info.hour)) {
        //每隔一定小时执行任务
        let interval = info.hour.split('/')[1];
        let intervalNum = Number(interval);
        return nowTime.getHours() - new Date(item.lastTime).getHours() <= intervalNum;
    }
    return false;
}
exports.isValidByHours = isValidByHours;
/**
 * 校验传入的时间是否有效
 * @param time 用户传入的时间格式
 * @param lastTime 用户上一次执行过的时间, 可能是上一次的分,秒,小时,天,周,月
 * @param nowTime 现在的时间, 跟lastTime的类型要匹配上, 可以是分,秒,小时,天,周,月
 * @param reg 根据分,秒,小时,天,周,月 所以传入的正则也动态变化
 */
function isValidTime(time, lastTime, nowTime, reg, type) {
    if (new RegExp(/^\d+\,\d+$/).test(time)) {
        let [s1, s2] = time.split(',');
        let h1 = Number(s1);
        let h2 = Number(s2);
        return h1 <= nowTime && nowTime <= h2;
    }
    else if (Number(time) >= 0) {
        return nowTime === Number(time);
    }
    else if (reg.test(time)) {
        //每隔一定时间执行任务
        let interval = time.split('/')[1];
        let intervalNum = Number(interval);
        //如果时间是秒和分钟  进制是60
        if (type === iLoopTimer_1.eTimeType.SECONDS || type === iLoopTimer_1.eTimeType.MINUTES) {
            if (lastTime > nowTime) {
                return nowTime + 60 - lastTime >= intervalNum;
            }
            else {
                return nowTime - lastTime >= intervalNum;
            }
            //如果时间是小时， 进制是24
        }
        else if (type === iLoopTimer_1.eTimeType.HOUR) {
            if (lastTime > nowTime) {
                return nowTime + 24 - lastTime >= intervalNum;
            }
            else {
                return nowTime - lastTime >= intervalNum;
            }
        }
        return nowTime - lastTime >= intervalNum;
    }
    else if (time === '*')
        return true;
    return false;
}
exports.isValidTime = isValidTime;
