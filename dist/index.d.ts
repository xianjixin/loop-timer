import { iTiming, eResultCode } from "./iLoopTimer";
declare class LoopTimer {
    private static instance;
    private _interval;
    private _events;
    constructor();
    /**
     * 执行事件
     */
    private _executeEvent;
    private _executeFunc;
    /**
     * 获取当前任务是否可以执行了, 通过比对当前的时间和任务要求执行的时间来比对
     * @param info
     */
    private _getNextExcuteTime;
    /**
     * 获取轮询实例对象
     */
    static getInstance(): LoopTimer;
    /**
     * 注册轮询事件
     * @param func 要执行的方法
     * @param frequency 执行的频率
     * @param isLoop 是否轮询,不停执行, 默认是false,只执行一次
     * @param callback 回调结果
     */
    registry<T>(func: Function, frequency?: iTiming, isLoop?: boolean, callback?: {
        (code: eResultCode, data?: T): void;
    }): void;
    /**
     * 移除注册到轮询事件的方法
     * @param func 要取消的方法
     */
    unRegister(func: Function): void;
    /**
     * 停止定时器
     */
    stopLoopTimer(): void;
}
export default LoopTimer;
