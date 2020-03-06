# loop-timer

模拟linux Crontab 的js定时任务,可以指定时间来执行任务,由于JS是单线程,所以如果指定的任务是个大计算量的任务,有可能会导致其他任务被延时执行,如果对时间准确性要求很高的,请慎用.

### 使用方法

1. 使用了单例设计,获取实例对象

        let timer = LoopTimer.getInstance();

2. 通过这个实例对象,则可以将事件注册到定时器里,根据使用者指定的时间来调用事件.

        //nodejs中使用
        const loopTimer = require('loop-timer').default;
        function log(){
            console.log('timer run:', new Date().getTime());
        }
        loopTimer.registry(log, true, {
            seconds: '*/10',
            minutes: '*',
            hour: '*'
        });
        //---------------------------------------------------------
        //vuejs中使用
        mounted(){
            let timer = LoopTimer.getInstance();
            timer.registry(this.log, false, {
                seconds: '10',
                minutes: '*',
                hour: '*'
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

### 传参的参数说明

        /**
        * 注册轮询事件
        * @param func 要执行的方法
        * @param isLoop 是否轮询,不停执行
        * @param frequency 执行的频率
        */
        registry(func: Function, isLoop?: boolean, frequency?: iTiming): void;

> iTiming 传值参考了linux Crontab的定时任务 '* * * * *'->分、时、日、月、周五种, 暂时只支持到了小时,如果有前端朋友不懂linux的Crontab的参数含义,请看下面的接口说明和示例, 或者自行查询linux的Crontab

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

**2. 参考Crontab, 继续完善参数类型的支持,比如 3,15 8-11/1 * * 1 .**
 