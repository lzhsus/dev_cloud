// pages/demo/demo.js
const Api = require('../../services/api/index');
const common = require('../../common/common');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        distance:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad (options) {
        Api.orderDemo()
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        
    },
})