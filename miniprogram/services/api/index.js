import request from "./request";
let api= {};

// 创建订单
api.orderCreate = function(data, isShowLoading=true){
    return request('orderadmin','order/create',data,isShowLoading);
}
// 查看订单
api.orderGet = function(data, isShowLoading=true){
    return request('orderadmin','order/get',data,isShowLoading);
}
// 订单状态管理
api.orderStatus = function(data, isShowLoading=false){
    return request('orderadmin','order/status',data,isShowLoading);
}
// 订单状态更新
api.orderUpdate = function(data, isShowLoading=true){
    return request('orderadmin','order/update',data,isShowLoading);
}
// 查看距离
api.distanceGet = function(data, isShowLoading=true){
    return request('distance','distance/get',data,isShowLoading);
}
api.orderDemo = function(data, isShowLoading=true){
    return request('orderadmin','order/demo',data,isShowLoading);
}

module.exports = api;