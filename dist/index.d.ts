import { iTiming } from './iLoopTimer';
declare class LoopTimer {
    private static instance;
    private interval;
    private events;
    constructor();
    /**
     * 执行事件
     */
    private executeEvent;
    /**
     * 获取下一次执行任务的时间点
     * @param info
     */
    private getNextExcuteTime;
    /**
     * 获取轮询实例对象
     */
    static getInstance(): LoopTimer;
    /**
     * 注册轮询事件
     * @param func 要执行的方法
     * @param isLoop 是否轮询,不停执行
     * @param frequency 执行的频率
     */
    registry(func: Function, isLoop?: boolean, frequency?: iTiming): void;
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
