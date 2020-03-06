// pages/my/my.js
const db = wx.cloud.database();
const _ = db.command;//查询指令
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {},
        pageShow:false
    },
    goTopage(){
        if(!this.data.userInfo.openid){
            wx.showToast({
                title: '请先获取用户信息！',
                icon: 'none',
                duration: 2000
            })
            return
        }
        wx.navigateTo({
          url: '/pages/periodset/periodset',
        })
    },
    gotoBtn(){
        if(!this.data.userInfo.openid){
            wx.showToast({
                title: '请先获取用户信息！',
                icon: 'none',
                duration: 2000
            })
            return
        }
        wx.navigateTo({
          url: '/pages/recordlist/recordlist',
        })

    },  
    // 获取用户信息
    onGetUserInfo: function (e) {
        wx.showLoading({
            title:'加载中',
            mask:true
        });
        var _this = this;
        let detail = e.detail
        // 拒绝授权
        if( !detail.encryptedData ){
            wx.showModal({
                showCancel: false,
                content: '请允许获取用户信息！'
            })
            return
        }
        wx.cloud.callFunction({
            name: 'login',
            data: {},
            success: res => {
                console.log('[云函数] [login] user openid: ', res)
                res = res.result
                var data_info = {
                    avatarUrl: e.detail.userInfo.avatarUrl,
                    city: e.detail.userInfo.city,
                    country: e.detail.userInfo.country,
                    gender: e.detail.userInfo.gender,
                    language: e.detail.userInfo.language,
                    nickName: e.detail.userInfo.nickName,
                    province: e.detail.userInfo.province,
                    appid: res.appid,
                    env: res.env,
                    openid: res.openid
                }
                db.collection('db_user_info').add({
                    // data 字段表示需新增的 JSON 数据
                    data: data_info,
                    success: function(res) {
                        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
                        console.log(res)
                        wx.showToast({
                            title: '注册成功！',
                            icon: 'success',
                            duration: 2000
                        })
                        
                        wx.hideLoading()
                        _this.setData({
                            userInfo: data_info
                        })
                        wx.setStorageSync('userInfo', data_info);
                    },
                    fail:err=>{
                        wx.hideLoading();
                        wx.showModal({
                            content: err,
                            showCancel: false
                        })
                    }
                })
            },
            fail: err => {
                wx.hideLoading()
                console.error('[云函数] [login] 调用失败', err)
                wx.showModal({
                    content: err,
                    showCancel: false
                })
            }
        })
    },
    
    getUserInfoFunc(openid){
        var _this = this;
        db.collection('db_user_info').where({
            // gt 方法用于指定一个 "大于" 条件，此处 _.gt(30) 是一个 "大于 30" 的条件
            openid: _.eq(openid)
        })
        .get({
            success: function(res) {
                console.log('11111',res)
                if(res.errMsg=='collection.get:ok'){
                    var data = res.data;
                    wx.setStorageSync('userInfo', data[0]);
                    _this.setData({
                        userInfo:data[0]
                    })
                }else{
                    wx.showModal({
                        content: res.errMsg,
                        showCancel: false
                    })
                }
                wx.hideLoading()
                _this.setData({
                    pageShow:true
                })
            }
        })
    },
    init(){
        wx.showLoading({
            title:'加载中',
            mask:true
        });
        var _this =this;
        // 调用云函数
        wx.cloud.callFunction({
            name: 'login',
            data: {},
            success: res => {
                res = res.result;
                console.log('[云函数] [login] user openid: ', res)
                this.getUserInfoFunc(res.openid)
            },
            fail: err => {
                console.error('[云函数] [login] 调用失败', err)
                wx.showModal({
                    content: err,
                    showCancel: false
                })
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.init()
    },
    onShareAppMessage: function () {
        // return custom share data when user share.
        return {
            title: '记录生活，记录健康！',
            path: '/pages/home/home',
            imageUrl: "https://6465-demo-yk46q-1301447037.tcb.qcloud.la/share.png?sign=aff80ed3ed8465be8ece88121fed266a&t=1583472468",
            success: (res)=> {
              // 转发成功
            },
            fail: (res)=> {
              // 转发失败
            }
          }
    },
})