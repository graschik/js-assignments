'use strict';

/********************************************************************************************
 *                                                                                          *
 * Документация к прочтению перед выполнением задания:                             *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Numbers_and_dates#Date_object
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date    *
 *                                                                                          *
 ********************************************************************************************/


/**
 * Преобразует строку типа rfc2822 в дату
 * О строках типа rfc2822 можно прочесть в спецификации : http://tools.ietf.org/html/rfc2822#page-14
 *
 * @param {string} value
 * @return {date}
 *
 * @example:
 *    'December 17, 1995 03:24:00'    => Date()
 *    'Tue, 26 Jan 2016 13:48:02 GMT' => Date()
 *    'Sun, 17 May 1998 03:00:00 GMT+01' => Date()
 */
function parseDataFromRfc2822(value) {
    return new Date(value);
}

/**
 * Преобразует строку типа ISO 8601 в дату
 * О строках типа ISO 8601 можно прочесть в спецификации : https://en.wikipedia.org/wiki/ISO_8601
 *
 * @param {string} value
 * @return {date}
 *
 * @example :
 *    '2016-01-19T16:07:37+00:00'    => Date()
 *    '2016-01-19T08:07:37Z' => Date()
 */
function parseDataFromIso8601(value) {
    return new Date(value);
}


/**
 * Возвращает true, если указанная дата находится в высокосном году и false в противном случае.
 * Об алгоритме определения высокосного года : https://en.wikipedia.org/wiki/Leap_year#Algorithm
 *
 * @param {date} date
 * @return {bool}
 *
 * @example :
 *    Date(1900,1,1)    => false
 *    Date(2000,1,1)    => true
 *    Date(2001,1,1)    => false
 *    Date(2012,1,1)    => true
 *    Date(2015,1,1)    => false
 */
function isLeapYear(date) {
    var  temp_date = new Date(date);
    var temp_year = temp_date.getFullYear();

    if (temp_year % 4 != 0) return false;
    else if ( temp_year % 100 != 0) return true;
    else if (temp_year % 400 != 0) return false;
    else return true;
}


/**
 * Возвращает строковое представление промежутка времени между двумя датами.
 * Формат строки на выходе : "HH:mm:ss.sss"
 *
 * @param {date} startDate
 * @param {date} endDate
 * @return {string}
 *
 * @example:
 *    Date(2000,1,1,10,0,0),  Date(2000,1,1,11,0,0)   => "01:00:00.000"
 *    Date(2000,1,1,10,0,0),  Date(2000,1,1,10,30,0)       => "00:30:00.000"
 *    Date(2000,1,1,10,0,0),  Date(2000,1,1,10,0,20)        => "00:00:20.000"
 *    Date(2000,1,1,10,0,0),  Date(2000,1,1,10,0,0,250)     => "00:00:00.250"
 *    Date(2000,1,1,10,0,0),  Date(2000,1,1,15,20,10,453)   => "05:20:10.453"
 */
function timeSpanToString(startDate, endDate) {
    var hours_res = (endDate.getHours() - startDate.getHours()).toString();
    if (hours_res.length < 2)  hours_res = "0" + hours_res;

    var minutes_res = (endDate.getMinutes() - startDate.getMinutes()).toString();
    if (minutes_res.length < 2)  minutes_res = "0" + minutes_res;

    var second_res = (endDate.getSeconds() - startDate.getSeconds()).toString();
    if ( second_res.length < 2 )  second_res = "0" + second_res;

    var mili_res = (endDate.getMilliseconds() - startDate.getMilliseconds()).toString();
    if (mili_res.length == 1) mili_res = "00" + mili_res;
    else if (mili_res.length == 2) mili_res = "0" + mili_res;

    return hours_res + ":" + minutes_res + ":" + second_res + "." + mili_res;
}


/**
 * Возвращает угол (в радианах) между часовыми стрелками двух аналоговых часов для указанного времени по Гринвичу.
 * При возникновениии проблем, посмотрите : https://en.wikipedia.org/wiki/Clock_angle_problem
 * 
 * @param {date} date
 * @return {number}
 *
 * @example:
 *    Date.UTC(2016,2,5, 0, 0) => 0
 *    Date.UTC(2016,3,5, 3, 0) => Math.PI/2
 *    Date.UTC(2016,3,5,18, 0) => Math.PI
 *    Date.UTC(2016,3,5,21, 0) => Math.PI/2
 */
function angleBetweenClockHands(date) {
    date = new Date(date);
    let mod = 0.5*(60*date.getUTCHours() + date.getUTCMinutes()) - 6*date.getUTCMinutes();
    mod %= 360;
    mod = mod < 0 ? mod + 360 : mod;
    mod = mod > 180 ? 360 - mod : mod;
    let r = mod * Math.PI / 180;
    return r;
}


module.exports = {
    parseDataFromRfc2822: parseDataFromRfc2822,
    parseDataFromIso8601: parseDataFromIso8601,
    isLeapYear: isLeapYear,
    timeSpanToString: timeSpanToString,
    angleBetweenClockHands: angleBetweenClockHands
};
