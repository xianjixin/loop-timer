"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var eTimeType;
(function (eTimeType) {
    eTimeType[eTimeType["SECONDS"] = 0] = "SECONDS";
    eTimeType[eTimeType["MINUTES"] = 1] = "MINUTES";
    eTimeType[eTimeType["HOUR"] = 2] = "HOUR";
    eTimeType[eTimeType["DAY"] = 3] = "DAY";
    eTimeType[eTimeType["WEEK"] = 4] = "WEEK";
    eTimeType[eTimeType["MONTH"] = 5] = "MONTH";
})(eTimeType = exports.eTimeType || (exports.eTimeType = {}));
var eResultCode;
(function (eResultCode) {
    /**
     * 任务执行成功,
     */
    eResultCode[eResultCode["SUCCESS"] = 0] = "SUCCESS";
    /**
     * 任务执行完毕,但是结果不尽如人意
     */
    eResultCode[eResultCode["WRANING"] = 1] = "WRANING";
    /**
     * 任务执行发生错误
     */
    eResultCode[eResultCode["ERROR"] = 2] = "ERROR";
})(eResultCode = exports.eResultCode || (exports.eResultCode = {}));
var eExcuteStatus;
(function (eExcuteStatus) {
    eExcuteStatus[eExcuteStatus["UNEXECUTED"] = 0] = "UNEXECUTED";
    eExcuteStatus[eExcuteStatus["PENDING"] = 1] = "PENDING";
    eExcuteStatus[eExcuteStatus["END"] = 2] = "END";
})(eExcuteStatus = exports.eExcuteStatus || (exports.eExcuteStatus = {}));
