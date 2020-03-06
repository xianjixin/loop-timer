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
    eResultCode[eResultCode["SUCCESS"] = 0] = "SUCCESS";
    eResultCode[eResultCode["FAILED"] = 1] = "FAILED";
})(eResultCode = exports.eResultCode || (exports.eResultCode = {}));
