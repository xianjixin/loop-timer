# loop-timer

模拟 linux Crontab 的 js 定时任务,可以指定时间来执行任务,由于 JS 是单线程,所以如果指定的任务是个大计算量的任务,有可能会导致其他任务被延时执行,如果对时间准确性要求很高的,请慎用.

### 使用方法

1.  使用了单例设计,获取实例对象

        let timer = LoopTimer.getInstance();

2.  通过这个实例对象,则可以将事件注册到定时器里,根据使用者指定的时间来调用事件.

        //nodejs中使用
        const loopTimer = require('loop-timer').default;
        function log(){
            console.log('timer run:', new Date().getTime());
        }
        loopTimer.registry(log,  {
            seconds: '*/10',
            minutes: '*',
            hour: '*'
        }, true, (code, data) => {
            console.log(code, data);
        });
        //---------------------------------------------------------
        //vuejs中使用
        mounted(){
            let timer = LoopTimer.getInstance();
            timer.registry(this.log, {
                seconds: '10',
                minutes: '*',
                hour: '*'
            }, false, (code, data) => {
                console.log(code, data);
            });
        },
        methods: {
            log(){
                console.log('timer run:', new Date().getTime());
            }
        },

        //代码解释
        // nodejs那份代码意思是 隔10秒执行一次任务,
        // vuejs的示例中代表, 每次的第10秒的时候,执行任务.
        // 是否轮询一直执行任务呢, 就看第二个参数是true还是false,如果为true 一直执行,如果为false则只执行一次
        // 新增了结果回调, 执行的方法如果有返回值,则会将返回值通过匿名函数的方式传回给调用者

### 传参的参数说明

        /**
        * 注册轮询事件, 注册以后返回一个Symbol, 可以通过该Symbol参数来取消注册的事件
        * @param func 要执行的方法, 支持普通函数,匿名函数,异步函数
        * @param frequency 执行的频率
        * @param isLoop 是否轮询,不停执行, 默认是false,只执行一次
        * @param callback 回调结果 请根据回调结果的code先判断下是否返回值符合预期
        */
        registry<T>(func: Function, frequency?: iTiming, isLoop?: boolean, callback?: {
        (code: eResultCode, data?: T): Symbol;

> eResultCode的接口定义

        export enum eResultCode {
            /**
            * 任务执行成功,
            */
            SUCCESS = 0,
            /**
            * 任务执行完毕,但是结果不尽如人意(async函数才可能会有该警告提示, 就是结果走到了Promise的then函数的err回调)
            */
            WRANING = 1,
            /**
            * 任务执行发生错误
            */
            ERROR = 2
        }

> iTiming 传值参考了 linux Crontab 的定时任务 '\* \* \* \* \*'->分、时、日、月、周五种, 暂时只支持到了小时,如果有前端朋友不懂 linux 的 Crontab 的参数含义,请看下面的接口说明和示例, 或者自行查询 linux 的 Crontab

        export interface iTiming {
            /**
            * 秒级,
            * 传值示例->
            * '*': 每秒,
            * '10':第10秒,
            * '* /2': 每隔2秒 注意,星号与斜杠间无空格
            */
            seconds: string;
            /**
            * 分钟级,
            * 传值示例->
            * '*': 每分钟,
            * '10':第10分钟,
            * '* /2': 每隔2分钟 注意,星号与斜杠间无空格
            */
            minutes: string;
            /**
            * 小时级,
            * 传值示例->
            * '*': 每小时,
            * '10':第10小时,
            * '* /2': 每隔2小时 注意,星号与斜杠间无空格
            */
            hour: string;
        }

**注:**

**1. 暂时只支持了秒,分,小时, 后续会陆续完善添加天,周,月的支持.**

**2. 参考 Crontab, 继续完善参数类型的支持,比如 3,15 8-11/1 \* \* 1 .**
