import {
  iLoopTimer,
  iTiming,
  eTimeType,
  eResultCode,
  eExcuteStatus
} from "./iLoopTimer";
import { isValidTime } from "./TimeNodeUtils";

class LoopTimer {
  private static instance: LoopTimer;
  private _interval: number = 0;
  private _events: Map<Symbol, iLoopTimer> = new Map();
  private _isForever: boolean = false;

  constructor() {
    this._init();
  }
  private _init() {
    if (this._interval) return;
    this._executeEvent();
    this._interval = setInterval(() => {
      this._executeEvent();
    }, 1000);
  }
  /**
   * 执行事件
   */
  private _executeEvent() {
    let date = new Date();
    let deleteEvent: iLoopTimer[] = [];
    this._events.forEach(info => {
      let flag = this._getNextExcuteTime(info, date);

      if (flag) {
        this._executeFunc(info);
      }

      if (info.executeStatus !== eExcuteStatus.END) return; //如果任务还没有执行过,则不进入删除逻辑
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
    //如果已经没有注册的事件了,则将轮询器停止掉, 防止无谓的系统开销
    if (this._events.size === 0) {
      this.stopLoopTimer(false);
    }
  }
  private _executeFunc(info: iLoopTimer) {
    /**
     * 任务如果是异步任务, 并且任务的状态是未执行状态或者是需要一直轮询且已经执行完毕过一次的任务,才能再次执行
     */
    if (
      info.func.value.constructor.name === "AsyncFunction" &&
      (info.executeStatus === eExcuteStatus.UNEXECUTED ||
        info.executeStatus === eExcuteStatus.END)
    ) {
      info.executeStatus = eExcuteStatus.PENDING;
      info.func
        .value()
        .then(
          (res: any) => {
            info.lastTime = new Date().getTime();
            info.executeStatus = eExcuteStatus.END;
            if (info.callback) {
              info.callback(eResultCode.SUCCESS, res);
            }
          },
          (err: any) => {
            if (info.callback) {
              info.callback(eResultCode.WRANING, err);
            }
            info.lastTime = new Date().getTime();
            info.executeStatus = eExcuteStatus.END;
          }
        )
        .catch((err: any) => {
          if (info.callback) {
            info.callback(eResultCode.ERROR, err);
          }
          info.lastTime = new Date().getTime();
          info.executeStatus = eExcuteStatus.END;
        });
    } else if (info.func.value.constructor.name === "Function") {
      let result = info.func.value();
      if (info.callback) {
        info.callback(eResultCode.SUCCESS, result);
      }
      info.lastTime = new Date().getTime();
      info.executeStatus = eExcuteStatus.END;
    }
  }

  /**
   * 获取当前任务是否可以执行了, 通过比对当前的时间和任务要求执行的时间来比对
   * @param info
   */
  private _getNextExcuteTime(item: iLoopTimer, nowTime: Date): boolean {
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
    if (
      isValidTime(
        info.hour,
        new Date(item.lastTime).getHours(),
        nowTime.getHours(),
        /^\*\/[1-9]$|^\*\/[1-2][0-4]$/,
        eTimeType.HOUR
      )
    ) {
      //再判断分钟是否有效  分钟的 斜线类型是  */0-59
      if (
        isValidTime(
          info.minutes,
          new Date(item.lastTime).getMinutes(),
          nowTime.getMinutes(),
          /^\*\/[1-9]$|^\*\/[1-5][0-9]$/,
          eTimeType.MINUTES
        )
      ) {
        //再判断秒数是否有效 秒级的 斜线类型是  */0-59
        return isValidTime(
          info.seconds,
          new Date(item.lastTime).getSeconds(),
          nowTime.getSeconds(),
          /^\*\/[1-9]$|^\*\/[1-5][0-9]$/,
          eTimeType.SECONDS
        );
      }
    }
    return false;
  }

  /**
   * 获取轮询实例对象
   */
  static getInstance(): LoopTimer {
    if (!this.instance) {
      this.instance = new LoopTimer();
    }
    return this.instance;
  }
  // registry(func: Function, isLoop: boolean = false, frequency: iTiming = { seconds: '*', minutes: '*', hour: '*', day: '*', week: '*', month: '*' }) {
  /**
   * 注册轮询事件, 注册以后返回一个Symbol, 可以通过该Symbol参数来取消注册的事件
   * @param func 要执行的方法
   * @param frequency 执行的频率
   * @param isLoop 是否轮询,不停执行, 默认是false,只执行一次
   * @param callback 回调结果
   */
  registry<T>(
    func: Function,
    frequency: iTiming = { seconds: "*", minutes: "*", hour: "*" },
    isLoop: boolean = false,
    callback?: {
      (code: eResultCode, data?: T): void;
    }
  ): Symbol {
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
      executeStatus: eExcuteStatus.UNEXECUTED,
      callback
    });
    this._init();
    return s;
  }
  /**
   * 移除注册到轮询事件的方法
   * @param func 要取消的方法
   */
  unRegister(s: Symbol) {
    if (this._events.has(s)) {
      this._events.delete(s);
    }
  }

  /**
   * 停止定时器
   * @param forever 是否永久停止计时器, 如果是false, 则计时器在注册了新的事件后, 将会重新开启计时器, 如果是true, 再永远不会再启动计时器
   */
  stopLoopTimer(forever: boolean = true) {
    this._isForever = forever;
    if (this._interval) {
      clearInterval(this._interval);
      this._interval = 0;
    }
  }
}

export default LoopTimer;
