import { iLoopTimer, iTiming, eTimeType } from './iLoopTimer';
import { isValidTime } from './TimeNodeUtils';

class LoopTimer {
  private static instance: LoopTimer;
  private interval: number;
  private events: Map<String, iLoopTimer> = new Map();

  constructor() {
    this.executeEvent();
    this.interval = setInterval(() => {
      this.executeEvent();
    }, 1000);
  }

  /**
   * 执行事件
   */
  private executeEvent() {
    let date = new Date();
    let time = date.getTime();
    let deleteEvent: iLoopTimer[] = [];
    this.events.forEach(info => {
      let flag = this.getNextExcuteTime(info, date);

      if (flag) {
        info.func();
        info.lastTime = time;
        info.isExecute = true;
      }

      if (info.isExecute === false) return; //如果任务还没有执行过,则不进入删除逻辑
      //以下两个判断都是为了将只执行一次的任务都放进数组,
      //事件执行以后,就从事件循环里删除掉.

      if (!info.isLoop) {
        deleteEvent.push(info);
      }
    });
    if (deleteEvent.length > 0) {
      deleteEvent.forEach(item => {
        if (this.events.has(item.func.name)) {
          this.events.delete(item.func.name);
        }
      });
    }
  }

  /**
   * 获取下一次执行任务的时间点
   * @param info
   */
  private getNextExcuteTime(item: iLoopTimer, nowTime: Date): boolean {
    let info = item.frequency;
    //每秒执行任务的判断
    // if (info.seconds === '*' && info.minutes === '*' && info.hour === '*' && info.day === '*' && info.week === '*' && info.month === '*') {
    //   if (nowTime.getTime() - item.lastTime >= 1000) {
    //     return true;
    //   }
    // }
    if (info.seconds === '*' && info.minutes === '*' && info.hour === '*') {
      if (nowTime.getTime() - item.lastTime >= 1000) {
        return true;
      }
    }
    //TODO 判断月 暂时不做
    //TODO 判断星期 暂时不做
    //TODO 判断天 暂时不做
    //判断小时,

    // if (isValidByHours(item, nowTime)) {
    if (isValidTime(info.hour, new Date(item.lastTime).getHours(), nowTime.getHours(), /^\*\/[1-9]$|^\*\/[1-2][0-4]$/, eTimeType.HOUR)) {
      //再判断分钟是否有效  分钟的 斜线类型是  */0-59
      if (isValidTime(info.minutes, new Date(item.lastTime).getMinutes(), nowTime.getMinutes(), /^\*\/[1-9]$|^\*\/[1-5][0-9]$/, eTimeType.MINUTES)) {
        //再判断秒数是否有效 秒级的 斜线类型是  */0-59
        return isValidTime(info.seconds, new Date(item.lastTime).getSeconds(), nowTime.getSeconds(), /^\*\/[1-9]$|^\*\/[1-5][0-9]$/, eTimeType.SECONDS);
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
  /**
   * 注册轮询事件
   * @param func 要执行的方法
   * @param isLoop 是否轮询,不停执行
   * @param frequency 执行的频率
   */
  // registry(func: Function, isLoop: boolean = false, frequency: iTiming = { seconds: '*', minutes: '*', hour: '*', day: '*', week: '*', month: '*' }) {
  registry(func: Function, isLoop: boolean = false, frequency: iTiming = { seconds: '*', minutes: '*', hour: '*'}) {
    if (!func.name) throw 'LoopTimer的registry方法: 不支持匿名函数';

    this.events.set(func.name, {
      lastTime: new Date().getTime(),
      func,
      frequency,
      isLoop,
      isExecute: false,
    });
  }
  /**
   * 移除注册到轮询事件的方法
   * @param func 要取消的方法
   */
  unRegister(func: Function) {
    if (this.events.has(func.name)) {
      this.events.delete(func.name);
    }
  }
  /**
   * 停止定时器
   */
  stopLoopTimer() {
    clearInterval(this.interval);
  }
}

export default LoopTimer;
