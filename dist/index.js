"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const iLoopTimer_1 = require("./iLoopTimer");
const TimeNodeUtils_1 = require("./TimeNodeUtils");
class LoopTimer {
    constructor() {
        this._events = new Map();
        this._executeEvent();
        this._interval = setInterval(() => {
            this._executeEvent();
        }, 1000);
    }
    /**
     * 执行事件
     */
    _executeEvent() {
        let date = new Date();
        let deleteEvent = [];
        this._events.forEach(info => {
            let flag = this._getNextExcuteTime(info, date);
            if (flag) {
                this._executeFunc(info);
            }
            if (info.executeStatus !== iLoopTimer_1.eExcuteStatus.END)
                return; //如果任务还没有执行过,则不进入删除逻辑
            //以下两个判断都是为了将只执行一次的任务都放进数组,
            //事件执行以后,就从事件循环里删除掉.
            if (!info.isLoop) {
                deleteEvent.push(info);
            }
        });
        if (deleteEvent.length > 0) {
            deleteEvent.forEach(item => {
                if (this._events.has(item.func.key)) {
                    this._events.delete(item.func.key);
                }
            });
        }
    }
    _executeFunc(info) {
        /**
         * 任务如果是异步任务, 并且任务的状态是未执行状态或者是需要一直轮询且已经执行完毕过一次的任务,才能再次执行
         */
        if (info.func.value.constructor.name === "AsyncFunction" &&
            (info.executeStatus === iLoopTimer_1.eExcuteStatus.UNEXECUTED ||
                info.executeStatus === iLoopTimer_1.eExcuteStatus.END)) {
            info.executeStatus = iLoopTimer_1.eExcuteStatus.PENDING;
            info.func
                .value()
                .then((res) => {
                info.lastTime = new Date().getTime();
                info.executeStatus = iLoopTimer_1.eExcuteStatus.END;
                if (info.callback) {
                    info.callback(iLoopTimer_1.eResultCode.SUCCESS, res);
                }
            }, (err) => {
                if (info.callback) {
                    info.callback(iLoopTimer_1.eResultCode.WRANING, err);
                }
                info.lastTime = new Date().getTime();
                info.executeStatus = iLoopTimer_1.eExcuteStatus.END;
            })
                .catch((err) => {
                if (info.callback) {
                    info.callback(iLoopTimer_1.eResultCode.ERROR, err);
                }
                info.lastTime = new Date().getTime();
                info.executeStatus = iLoopTimer_1.eExcuteStatus.END;
            });
        }
        else if (info.func.value.constructor.name === "Function") {
            let result = info.func.value();
            if (info.callback) {
                info.callback(iLoopTimer_1.eResultCode.SUCCESS, result);
            }
            info.lastTime = new Date().getTime();
            info.executeStatus = iLoopTimer_1.eExcuteStatus.END;
        }
    }
    /**
     * 获取当前任务是否可以执行了, 通过比对当前的时间和任务要求执行的时间来比对
     * @param info
     */
    _getNextExcuteTime(item, nowTime) {
        let info = item.frequency;
        //每秒执行任务的判断
        // if (info.seconds === '*' && info.minutes === '*' && info.hour === '*' && info.day === '*' && info.week === '*' && info.month === '*') {
        //   if (nowTime.getTime() - item.lastTime >= 1000) {
        //     return true;
        //   }
        // }
        if (info.seconds === "*" && info.minutes === "*" && info.hour === "*") {
            if (nowTime.getTime() - item.lastTime >= 1000) {
                return true;
            }
        }
        //TODO 判断月 暂时不做
        //TODO 判断星期 暂时不做
        //TODO 判断天 暂时不做
        //判断小时,
        // if (isValidByHours(item, nowTime)) {
        if (TimeNodeUtils_1.isValidTime(info.hour, new Date(item.lastTime).getHours(), nowTime.getHours(), /^\*\/[1-9]$|^\*\/[1-2][0-4]$/, iLoopTimer_1.eTimeType.HOUR)) {
            //再判断分钟是否有效  分钟的 斜线类型是  */0-59
            if (TimeNodeUtils_1.isValidTime(info.minutes, new Date(item.lastTime).getMinutes(), nowTime.getMinutes(), /^\*\/[1-9]$|^\*\/[1-5][0-9]$/, iLoopTimer_1.eTimeType.MINUTES)) {
                //再判断秒数是否有效 秒级的 斜线类型是  */0-59
                return TimeNodeUtils_1.isValidTime(info.seconds, new Date(item.lastTime).getSeconds(), nowTime.getSeconds(), /^\*\/[1-9]$|^\*\/[1-5][0-9]$/, iLoopTimer_1.eTimeType.SECONDS);
            }
        }
        return false;
    }
    /**
     * 获取轮询实例对象
     */
    static getInstance() {
        if (!this.instance) {
            this.instance = new LoopTimer();
        }
        return this.instance;
    }
    // registry(func: Function, isLoop: boolean = false, frequency: iTiming = { seconds: '*', minutes: '*', hour: '*', day: '*', week: '*', month: '*' }) {
    /**
     * 注册轮询事件, 注册以后返回一个Symbol, 可以通过该Symbol参数来取消注册的事件
     * @param func 要执行的方法, 支持普通函数,匿名函数,异步函数
     * @param frequency 执行的频率
     * @param isLoop 是否轮询,不停执行, 默认是false,只执行一次
     * @param callback 回调结果
     */
    registry(func, frequency = { seconds: "*", minutes: "*", hour: "*" }, isLoop = false, callback) {
        // if (!func.name) throw "LoopTimer的registry方法: 不支持匿名函数";
        let s = Symbol();
        let data = {
            key: s,
            value: func
        };
        this._events.set(s, {
            lastTime: new Date().getTime(),
            func: data,
            frequency,
            isLoop,
            executeStatus: iLoopTimer_1.eExcuteStatus.UNEXECUTED,
            callback
        });
        return s;
    }
    /**
     * 移除注册到轮询事件的方法
     * @param func 要取消的方法
     */
    unRegister(s) {
        if (this._events.has(s)) {
            this._events.delete(s);
        }
    }
    /**
     * 停止定时器
     */
    stopLoopTimer() {
        clearInterval(this._interval);
    }
}
exports.default = LoopTimer;
