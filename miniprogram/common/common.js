const formatMoney = function (value) {
    value = Number(value)
    if (isNaN(value)) {
        return '--'
    }
    value = (value / 100).toFixed(2)
    if (Math.abs(value) < 1000) {
        return value
    }
    return value.replace(/./g, (c, i, a) => i && c !== '.' && !((a.length - i) % 3) ? ',' + c : c);
}

// 获取当前时间 YYYY-MMMM-DDDD
const getTime = function (dates) {
    dates = dates || new Date();
    const year = dates.getFullYear()
    const month = dates.getMonth() + 1
    const day = dates.getDate()
    const hour = dates.getHours()
    const minute = dates.getMinutes()
    const second = dates.getSeconds()

    var formatNumber = n => {
        n = n.toString()
        return n[1] ? n : '0' + n
    }
    return [year, month, day].map(formatNumber).join('-')

}
// 获取当前时间 YYYY-MMMM-DDDD hh:mm:ss
const getNewTime = function () {
    var date = new Date();

    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDate();

    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();

    //这样写显示时间在1~9会挤占空间；所以要在1~9的数字前补零;
    if (hour < 10) {
        hour = '0' + hour;
    }
    if (minute < 10) {
        minute = '0' + minute;
    }
    if (second < 10) {
        second = '0' + second;
    }

    var x = date.getDay();//获取星期
    var time = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
    return time
}
// 计算两个时间的间隔天数
const getTimeToTimeDay = function ($time1, $time2) {
    var time1 = arguments[0], time2 = arguments[1];
    time1 = Date.parse(time1) / 1000;
    time2 = Date.parse(time2) / 1000;
    var time_ = time1 - time2;
    return (time_ / (3600 * 24));
}
// 计算结束 如期 
/**
 * day 天数
 * oldTime 开始时间 YYYY-MMMM-DDDD
 * time2  结束时间  YYYY-MMMM-DDDD
 */
const getDayEndTime = function (day, oldTime) {
    var date1 = new Date(oldTime);
    var date2 = new Date(oldTime);
    date2.setDate(date1.getDate() + day - 1);
    var time2 = date2.getFullYear() + "-" + (date2.getMonth() + 1) + "-" + date2.getDate();
    return time2;
}
const getCustomString = function (day, oldTime) {
    var date1 = new Date(oldTime);
    var date2 = new Date(oldTime);
    date2.setDate(date1.getDate() + day);
    var time2 = date2.getFullYear() + "" + (date2.getMonth() + 1) + "" + date2.getDate();
    return time2;
}
/**
 * 生成图片名称
 * dir 文件前缀
 * suffix 图片类型
 */
const createImgName = function (dir, suffix) {
    var name = '';
    name = dir + '_' + new Date().getTime() + '.' + (suffix || 'png')

    return name;
}
module.exports = {
    getTime: getTime,
    getNewTime: getNewTime,
    getTimeToTimeDay: getTimeToTimeDay,
    getDayEndTime: getDayEndTime,
    getCustomString: getCustomString,
    createImgName: createImgName
}