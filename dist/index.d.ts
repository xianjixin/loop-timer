import { iTiming, eResultCode } from "./iLoopTimer";
declare class LoopTimer {
    private static instance;
    private _interval;
    private _events;
    private _isForever;
    constructor();
    private _init;
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
     * 注册轮询事件, 注册以后返回一个Symbol, 可以通过该Symbol参数来取消注册的事件
     * @param func 要执行的方法
     * @param frequency 执行的频率
     * @param isLoop 是否轮询,不停执行, 默认是false,只执行一次
     * @param callback 回调结果
     */
    registry<T>(func: Function, frequency?: iTiming, isLoop?: boolean, callback?: {
        (code: eResultCode, data?: T): void;
    }): Symbol;
    /**
     * 移除注册到轮询事件的方法
     * @param func 要取消的方法
     */
    unRegister(s: Symbol): void;
    /**
     * 停止定时器
     * @param forever 是否永久停止计时器, 如果是false, 则计时器在注册了新的事件后, 将会重新开启计时器, 如果是true, 再永远不会再启动计时器
     */
    stopLoopTimer(forever?: boolean): void;
}
export default LoopTimer;
