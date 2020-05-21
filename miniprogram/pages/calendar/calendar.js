// pages/calendar/calendar.js
const app = getApp()

const db = wx.cloud.database();
const _ = db.command; //查询指令
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageShow: false,
        radioIndex: 2,
        date_time: "", //设置的时间
        starg: "未知期",
        start: "2019-01-01",
        end: "",
        periodobj: {}, //最后一个数据
        userInfo: {},
        endTime: '', // 预计结束的时间
        year: 0,
        month: 0,
        date: ['日', '一', '二', '三', '四', '五', '六'],
        dateArr: [],
        isToday: 0,
        isClickToday:-1,
        isTodayWeek: false,
        todayIndex: 0,
        dayInfoObj:{}
    },
    // 页面方法
    changeRadio() {
        var _this = this;
        if (_this.data.radioIndex == 2) {
            return
        }
        wx.showModal({
            title: '提示',
            content: '确认自行终止此次经期记录!',
            success(res) {
                if (res.confirm) {
                    db.collection('db_period_list').where({
                        _id: _this.data.periodobj._id
                    }).update({
                        // data 传入需要局部更新的数据
                        data: {
                            // 表示将 done 字段置为 true
                            period_reality_continue_long: _this.data.periodobj.new_time,
                            updata_time: app.common.getNewTime()
                        },
                        success: function (res) {
                            var periodobj = _this.data.periodobj
                            periodobj['period_reality_continue_long'] = _this.data.periodobj.new_time
                            _this.setData({
                                radioIndex: 2,
                                periodobj: periodobj
                            })
                        },
                        fail: err => {
                            wx.showModal({
                                content: err,
                                showCancel: false
                            })
                        }
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    bindTimeChange(e) {
        var data_info = {
            period_time: e.detail.value,
            openid: this.data.userInfo.openid,
            period_continue_long: this.data.periodobj.period_continue_long || 2,
            period_month_long: this.data.periodobj.period_month_long || 15,
            create_time: app.common.getNewTime()
        }
        // return
        var _this = this;
        db.collection('db_period_list').add({
            // data 字段表示需新增的 JSON 数据
            data: data_info,
            success: function (res) {
                // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
                wx.showToast({
                    title: '设置成功！',
                    icon: 'success',
                    duration: 2000
                })

                data_info.new_time = app.common.getTimeToTimeDay(app.common.getTime(), e.detail.value) + 1
                _this.setData({
                    radioIndex: 1,
                    periodobj: data_info,
                    date_time: e.detail.value,
                    endTime: app.common.getDayEndTime(data_info.period_continue_long, e.detail.value)
                })
                _this.getPeriodList();
            },
            fail: err => {
                wx.showModal({
                    content: err,
                    showCancel: false
                })
            }
        })
    },
    goMy() {
        wx.switchTab({
            url: "/pages/my/my"
        })
    },
    getPeriodList() {
        var _this = this;
        db.collection('db_period_list').where({
            openid: _this.data.userInfo.openid
        }).get({
            success: function (res) {
                // 输出 [{ "title": "The Catcher in the Rye", ... }]
                if (res.errMsg == 'collection.get:ok') {
                    let data = res.data;
                    if (data.length) {
                        const dataObj = data[data.length - 1]
                        // 当前时间
                        dataObj.new_time = app.common.getTimeToTimeDay(app.common.getTime(), dataObj.period_time) + 1
                        var radioIndex = 1
                        if (dataObj.period_reality_continue_long || dataObj.new_time > dataObj.period_continue_long) {
                            radioIndex = 2
                        }
                        console.log('radioIndex',radioIndex)
                        console.log("dataObj",dataObj)
                        _this.setData({
                            periodobj: dataObj,
                            radioIndex: radioIndex,
                            endTime: app.common.getDayEndTime(dataObj.period_continue_long, dataObj.period_time)
                        })
                        _this.init();
                    }
                } else {
                    wx.showModal({
                        content: res.errMsg,
                        showCancel: false
                    })
                }
                _this.setData({
                    pageShow: true
                })
            }
        })
    },
    getStaticTime(){
        const data = this.data;
        const userInfo = data.userInfo;
        const periodobj = data.periodobj;  //当前需要设置的数据
        const endTime = data.endTime;//预计结束
        const date_time = data.date_time;
        

        // static 0(无) 1(确) 2(预) 3(易)
        var static1=[],static2=[],static3=[],
            dateArr=this.data.dateArr;
        // 易开始
        const yi_start_time = app.common.getDayEndTime(9,endTime); //需要十天
        for(let i=0;i<10;i++){
            static3.push(app.common.getCustomString(i,yi_start_time))
        }
        // 预开始
        const yu_start_time = app.common.getDayEndTime(periodobj.period_month_long+1,periodobj.period_time)
        for(let i=0;i<periodobj.period_continue_long;i++){
            static1.push(app.common.getCustomString(i,periodobj.period_time))
            static2.push(app.common.getCustomString(i,yu_start_time))
        }
        
        dateArr.forEach(obj => {
            static1.forEach(e => {
                if(obj.isToday==e){
                    obj.static = 1;
                }
            });
            static2.forEach(e => {
                if(obj.isToday==e){
                    obj.static = 2;
                }
            });
            static3.forEach((e,i) => {
                if(obj.isToday==e){
                    obj.static = 3;
                    if(i==5){
                        obj.static = 5;
                    }
                }
            });
        });
        this.setData({
            dateArr:dateArr
        })
        this.getDayInfo()
    },

    dateInit: function (setYear, setMonth) {
        //全部时间的月份都是按0~11基准，显示月份才+1
        let dateArr = []; //需要遍历的日历数组数据
        let arrLen = 0; //dateArr的数组长度
        let now = setYear ? new Date(setYear, setMonth) : new Date();
        let year = setYear || now.getFullYear();
        let nextYear = 0;
        let month = setMonth || now.getMonth(); //没有+1方便后面计算当月总天数
        let nextMonth = (month + 1) > 11 ? 1 : (month + 1);
        let startWeek = new Date(year + ',' + (month + 1) + ',' + 1).getDay(); //目标月1号对应的星期
        let dayNums = new Date(year, nextMonth, 0).getDate(); //获取目标月有多少天
        let obj = {};
        let num = 0;
        if (month + 1 > 11) {
            nextYear = year + 1;
            dayNums = new Date(nextYear, nextMonth, 0).getDate();
        }
        arrLen = startWeek + dayNums;
        for (let i = 0; i < arrLen; i++) {
            if (i >= startWeek) {
                num = i - startWeek + 1;
                obj = {
                    isToday: '' + year + (month + 1) + num,
                    dateNum: num,
                    weight: 5
                }
            } else {
                obj = {};
            }
            dateArr[i] = obj;
        }

        this.setData({
            dateArr: dateArr
        })
        this.setIndex(setYear, setMonth)
    },
    setIndex(setYear, setMonth,day=''){
        let nowDate;
        if(day){
            nowDate = new Date(day);
        }else{
            nowDate = new Date();
        }
         
        let nowYear = nowDate.getFullYear();//当前年
        let nowMonth = nowDate.getMonth() + 1;//当前月
        let nowWeek = nowDate.getDay(); //当前周几
        let getYear = setYear || nowYear;
        let getMonth = setMonth >= 0 ? (setMonth + 1) : nowMonth;
        if(day){
            this.setData({
                isTodayWeek: true,
                todayIndex: nowWeek
            })
            return
        }
        if (nowYear == getYear && nowMonth == getMonth) {
            this.setData({
                isTodayWeek: true,
                todayIndex: nowWeek
            })
        } else {
            this.setData({
                isTodayWeek: false,
                todayIndex: -1
            })
        }
        this.getStaticTime()
    },
    /**
     * 上月切换
     */
    lastMonth: function () {
        //全部时间的月份都是按0~11基准，显示月份才+1
        let year = this.data.month - 2 < 0 ? this.data.year - 1 : this.data.year;
        let month = this.data.month - 2 < 0 ? 11 : this.data.month - 2;
        
        this.setData({
            year: year,
            month: (month + 1)
        })
        this.dateInit(year, month);
    },
    /**
     * 下月切换
     */
    nextMonth: function () {
        //全部时间的月份都是按0~11基准，显示月份才+1
        let year = this.data.month > 11 ? this.data.year + 1 : this.data.year;
        let month = this.data.month > 11 ? 0 : this.data.month;
        this.setData({
            year: year,
            month: (month + 1)
        })
        this.dateInit(year, month);
    },
    // 回到今天
    goNewDay(){
        this.init();
    },
    getDayInfo(day,set){
        var _this =this;
        day=app.common.getCustomString(0,day||app.common.getTime())
        var obj={}
        this.data.dateArr.forEach(element => {
            if(element.isToday == day){
                console.log(element)
                if(!element.static){
                    element.static_txt='安全期'
                }
                if(element.static==1){
                    element.static_txt='月经期'
                }
                if(element.static==2){
                    element.static_txt='预测期'
                }
                if(element.static==3){
                    element.static_txt='易孕期'
                }
                if(element.static==5){
                    element.static_txt='排卵期'
                }
                obj = element
            }
        });
        if(!set){
            db.collection('db_period_list').where({
                _id: _this.data.periodobj._id
            }).update({
                // data 传入需要局部更新的数据
                data: {
                    // 表示将 done 字段置为 true
                    static_txt: encodeURIComponent(obj.static_txt),
                    static_txt_c: obj.static_txt
                },
                success: function (res) {
                    _this.setData({
                        dayInfoObj : obj
                    })
                },
                fail: err => {
                    wx.showModal({
                        content: err,
                        showCancel: false
                    })
                }
            })
        }else{
            this.setData({
                dayInfoObj : obj
            })
        }
        
    },
    // 点击时期
    lookHuoDong:function(e){
        const dataset = e.currentTarget.dataset;
        var day = dataset.year+''+dataset.month+''+dataset.datenum;
        this.setIndex(dataset.year,dataset.month,dataset.year+'-'+dataset.month+'-'+dataset.datenum)
        let now = new Date();
        var blo = app.common.getCustomString(0,app.common.getTime())==app.common.getCustomString(0,dataset.year+'-'+dataset.month+'-'+dataset.datenum)
        console.log(blo)
        if(blo){
            this.init();
        }else{
            this.getDayInfo((dataset.year+'-'+dataset.month+'-'+dataset.datenum),true)
            this.setData({
                isClickToday:day
            })
        }
    },
    init(){
        let now = new Date();
        let year = now.getFullYear();
        let month = now.getMonth() + 1;
        this.setData({
            year: year,
            month: month,
            isClickToday:-1,
            isToday: '' + year + month + now.getDate()
        })
        this.dateInit();
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
        let userInfo = wx.getStorageSync('userInfo') || {};
        this.setData({
            userInfo: userInfo,
            end: app.common.getTime() //可选择的最后时间
        })
        this.getPeriodList()
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