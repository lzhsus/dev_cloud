//app.js
const common = require('./common/common')
App({
    onLaunch: function () {
        
        if (!wx.cloud) {
            console.error('请使用 2.2.3 或以上的基础库以使用云能力')
            } else {
            wx.cloud.init({
                // env 参数说明：
                //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
                //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
                //   如不填则使用默认环境（第一个创建的环境）
                // env: 'my-env-id',
                traceUser: true,
            })
        }
        this.globalData = {}
        this.common = common;
        common.getLocation()
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
