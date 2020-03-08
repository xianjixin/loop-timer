export interface iLoopTimer {
  /**
   * 任务最后一次执行的时间
   */
  lastTime: number;
  /**
   * 定时时间到了以后,需要执行的任务
   */
  func: Function;
  /**
   * 执行频率,或者说设定的时间点
   */
  frequency: iTiming;
  /**
   * 是否轮询
   */
  isLoop: boolean;
  /**
   * 任务的执行状态
   */
  executeStatus: eExcuteStatus;
  /**
   * 回调通知任务的执行结果
   */
  callback?: {
    (code: eResultCode, data?: any): void;
  };
}
export interface iTiming {
  /**
   * 秒级,
   * 传值示例->
   * '*': 每秒,
   * '10':第10秒,
   * '* /2': 每隔2秒 注意,星号与斜杠间无空格
   * '1,20': 第1秒和第20秒
   */
  seconds: string;
  /**
   * 分钟级,
   * 传值示例->
   * '*': 每分钟,
   * '10':第10分钟,
   * '* /2': 每隔2分钟 注意,星号与斜杠间无空格
   * '1,20': 第1分钟和第20分钟
   */
  minutes: string;
  /**
   * 小时级,
   * 传值示例->
   * '*': 每小时,
   * '10':第10小时,
   * '* /2': 每隔2小时 注意,星号与斜杠间无空格
   *
   * '1,20': 第1小时和第20小时
   */
  hour: string;
  /**
   * 暂未支持
   */
  day?: string;
  /**
   * 暂未支持
   */
  week?: string;
  /**
   * 暂未支持
   */
  month?: string;
}
export enum eTimeType {
  SECONDS = 0,
  MINUTES = 1,
  HOUR = 2,
  DAY = 3,
  WEEK = 4,
  MONTH = 5
}
export enum eResultCode {
  /**
   * 任务执行成功,
   */
  SUCCESS = 0,
  /**
   * 任务执行完毕,但是结果不尽如人意
   */
  WRANING = 1,
  /**
   * 任务执行发生错误
   */
  ERROR = 2
}
export enum eExcuteStatus  {
  UNEXECUTED = 0,
  PENDING = 1,
  END = 2
}