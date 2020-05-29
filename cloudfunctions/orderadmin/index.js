// 云函数入口文件
const cloud = require('wx-server-sdk');
const TcbRouter = require('tcb-router');
const rq = require('request');
cloud.init();

const db = cloud.database();
const _ = db.command;
const $ = db.command.aggregate

const common = require('./common');
const config = require('./config.json');

// 云函数入口函数
exports.main =  (event, context) => {
    const app = new TcbRouter({
        event
    });
    // 订单状态
    app.router('order/status',(ctx)=>{
        let { OPENID} = cloud.getWXContext()
        ctx.body = new Promise(resolve => {
            resolve({
                errcode:200,
                msg: "操作成功",
                result:config,
                success:true,
                timestamp:new Date().getTime()
            })
        });
    })
    // 创建订单
    app.router('order/create', (ctx) => {
        let { OPENID} = cloud.getWXContext();
        ctx.body = new Promise((resolve,reject) => {
            let header = event.header;
            let q = event.data;
            var data={};
            data = Object.assign(data,header)
            data.out_order_id = common.random_No();
            
            data.openId = OPENID;
            data.status = 100 ;
            data.create_time = db.serverDate()
            data.updata_time = db.serverDate()
            // return data
            db.collection('user_order_list').add({
                data:data
            }).then(res=>{
                resolve({
                    errcode:200,
                    msg: "操作成功",
                    result:res,
                    success:true,
                    timestamp:new Date().getTime()
                })
            }).catch(err=>{
                var error_type = common.error_type(err.errCode);
                resolve({
                    errcode:404,
                    msg: error_type.type,
                    result:err,
                    success:false,
                    timestamp:new Date().getTime()
                })
            })
        });
    });
    // 获取订单列表
    app.router('order/get', async (ctx) => {
        let { OPENID} = cloud.getWXContext();
        ctx.body = new Promise(resolve => {
            let parame = event.data;
            // 全部订单
            if(parame.type==-1){
                var where_data = {
                    openId:OPENID,
                    status: _.or([_.eq(100), _.eq(101), _.eq(102), _.eq(103), _.eq(301), _.eq(302), _.eq(303), _.eq(304), _.eq(305), _.eq(401), _.eq(402), _.eq(501), _.eq(502), _.eq(601), _.eq(602), _.eq(603), _.eq(701)])
                }
            // 未支付
            }else if(parame.type==0){
                var where_data = {
                    openId:OPENID,
                    status: _.or([_.eq(100)])
                }
            // 已支付
            }else if(parame.type==1){
                var where_data = {
                    openId:OPENID,
                    status: _.or([_.eq(101),_.eq(102),_.eq(103)])
                }
            // 已发货
            }else if(parame.type==2){
                var where_data = {
                    openId:OPENID,
                    status: _.or([_.eq(201),_.eq(301),_.eq(302),_.eq(303),_.eq(304),_.eq(305)])
                }
            // 已收货
            }else if(parame.type==3){
                var where_data = {
                    openId:OPENID,
                    status: _.or([_.eq(401)])
                }
            // 已评价
            }else if(parame.type==4){
                var where_data = {
                    openId:OPENID,
                    status: _.or([_.eq(402)])
                }
            // 已取消
            }else if(parame.type==5){
                var where_data = {
                    openId:OPENID,
                    status: _.or([_.eq(501),_.eq(502)])
                }
            // 申请退款
            }else if(parame.type==6){
                var where_data = {
                    openId:OPENID,
                    status: _.or([_.eq(601),_.eq(602),_.eq(603)])
                }
            // 借用--已归还
            }else if(parame.type==7){
                var where_data = {
                    openId:OPENID,
                    status: _.or([_.eq(701)])
                }
            }
            
            db.collection('user_order_list').where(where_data)
            .limit(1000) // 限制返回数量为 10 条
            .get()
            .then(res=>{
                resolve({
                    errcode:200,
                    msg: "操作成功",
                    result:res,
                    success:true,
                    timestamp:new Date().getTime()
                })
            }).catch(err=>{
                var error_type = common.error_type(err.errCode);
                resolve({
                    errcode:404,
                    msg: error_type.type,
                    result:err,
                    success:false,
                    timestamp:new Date().getTime()
                })
            })
        });
    });
    app.router('del', async (ctx) => {
        let { OPENID} = cloud.getWXContext()

        ctx.body = new Promise(resolve => {
            resolve({
                errcode:200,
                msg: "操作成功",
                result:{
                    a:1
                },
                success:true,
                timestamp:new Date().getTime()
            })
        });
    });
    app.router('add', async (ctx) => {
        let { OPENID} = cloud.getWXContext()

        ctx.body = new Promise(resolve => {
            resolve({
                errcode:200,
                msg: "操作成功",
                result:{
                    a:1
                },
                success:true,
                timestamp:new Date().getTime()
            })
        });
    });
    // 更新订单状态
    app.router('order/updata', (ctx) => {
        let { OPENID} = cloud.getWXContext()
        let header = event.header;
        let parame = event.data;
        var data={}
        data[parame.name] = parame.value;
        data['updata_time'] = db.serverDate();
        ctx.body = new Promise(resolve => {
            try {
                db.collection('user_order_list').where({
                    openId:OPENID
                }).update({
                    data:data
                })
                resolve({
                    errcode:200,
                    msg: "操作成功!",
                    result:{},
                    success:true,
                    timestamp:new Date().getTime()
                })
            } catch (err) {
                var error_type = common.error_type(err.errCode);
                resolve({
                    errcode:404,
                    msg: error_type.type,
                    result:err,
                    success:false,
                    timestamp:new Date().getTime()
                })
            }
        });
    });
    // 聚合
    app.router('order/demo', (ctx) => {
        let { OPENID} = cloud.getWXContext()
        ctx.body = new Promise(async resolve => {
            try {
                var res =  await db.collection('db_user_info').aggregate()
                    // ***********分组 
                    .group({
                        _id: '$gender',
                        num: $.sum(1),//计数  累加 sum
                    }).end()
                    // **************为每条记录添加子端
                    // .addFields({
                    //   totalHomework: $.sum('$gender'),
                    //   totalQuiz: $.sum('$gender')
                    // })
                    // .addFields({
                    //   totalScore: $.add(['$totalHomework', '$totalQuiz', '$extraCredit'])
                    // })
                    // .end()

                resolve({
                    errcode:200,
                    msg: "操作成功!",
                    result:res,
                    success:true,
                    timestamp:new Date().getTime()
                })
            } catch (err) {
                var error_type = common.error_type(err.errCode);
                resolve({
                    errcode:404,
                    msg: error_type.type,
                    result:err,
                    success:false,
                    timestamp:new Date().getTime()
                })
            }
        });
    });
    return app.serve();
}