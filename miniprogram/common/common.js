import appConfig from "./app_config.js";
const Api = require('../services/api/index')

var QQMapWX = require('../services/qqmap-wx-jssdk.min');
var qqmapsdk;
var locationData;
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
// 连接两点的直线距离
export const apiDistanceGet =async function (){
    var locationData = wx.getStorageSync("locationData")
    var lat = 0,lng = 0;
    if(locationData){
        lat = locationData.location.lat,
        lng = locationData.location.lng
    }
    var _this = this;
    var res = await Api.distanceGet({
        lat:lat,
        lng:lng
    })
    if(!res.success){
        wx.showModal({
            cancelColor: res.msg,
            showCancel:false
        })
        return 
    }
    return res.result.distance;
}
// 获取位置
export const getLocation = function(location='',query={}){
    locationData = wx.getStorageSync('locationData');
    return new Promise((resolve, reject)=> {
        reverseGeocoderFun(location,query,resolve,reject);
    });
}
// 设置本地存储
export const setLocation=function(province,city,district,lng=0,lat=0){
    var location={
        'province':province,
        'city':city,
        'district':district,
        'location':{
            'lng':lng,
            'lat':lat
        }
    }
    wx.setStorageSync('locationData', location);
}
function reverseGeocoderFun(location,query,resolve,reject){
    if( !qqmapsdk ){
        qqmapsdk = new QQMapWX({
            key: appConfig.txMapKey,
        });
    }
    qqmapsdk.reverseGeocoder({
        location: location,
        success:(res)=> {
            res = res.result||{};
            let ad_info = res.address_component||{};
                ad_info = {
                    city: ad_info.city,
                    district: ad_info.district,
                    province: ad_info.province,
                    location: location ? {lng:'',lat:''}: res.location, //如果是拒绝授权地理位置，不保存经纬度
                }
            // 第一次进入无条件储存数据
            if( !locationData ){
                setLocation(ad_info.province,ad_info.city,ad_info.district,ad_info.location.lng,ad_info.location.lat);
                resolve(ad_info);
                return;
            }
            // 匹配当前地址和定位是否一致（按照市匹配）
            if( locationData.city!=ad_info.city ){
                wx.showModal({
                    title: '位置信息',
                    content: '当前位置发生变化是否更新？',
                    success:(res)=> {
                        if( res.confirm ){
                            // 本地更新地理位置信息
                            setLocation(ad_info.province,ad_info.city,ad_info.district,ad_info.location.lng,ad_info.location.lat);
                            resolve(ad_info);
                        }
                    }
                });
            }else{
                // 不更新本地数据，返回最新数据
                resolve(ad_info);
            }
        },
        fail:(err)=> {
            console.error('地理位置授权出错',err);
            // 没有获取过地理位置（默认北京地区）
            if( !locationData ){
                reverseGeocoderFun('39.92054,116.39579',query,resolve,reject);
                return;
            }else{
                // 返回本地数据
                resolve(locationData);
            }
        },
        complete:(res)=> { }
    });




    
}
module.exports = {
    getTime: getTime,
    getNewTime: getNewTime,
    getTimeToTimeDay: getTimeToTimeDay,
    getDayEndTime: getDayEndTime,
    getCustomString: getCustomString,
    createImgName: createImgName,
    getLocation:getLocation,
    setLocation:setLocation,
    apiDistanceGet:apiDistanceGet
}