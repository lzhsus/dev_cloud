// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router');
const rq = require('request');
const utilMd5 = require('./md5.js');  
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    const app = new TcbRouter({
        event
    });

    app.router('distance/get', async (ctx) => {
        let {
            OPENID
        } = cloud.getWXContext()
        ctx.body = new Promise(resolve => {
            let parame = event.data;
            var url = "/ws/distance/v1/?from="+parame.lat+","+parame.lng+"&key=BZUBZ-3TARW-IXWRG-RZPWU-JO5TT-IZFHB&mode=walking&to=31.105297,121.40424";
            var old_sig = url+'SVXhFEOobfY2NviQK5u0mGYcD7ArwwgM'
            var sig= utilMd5.hexMD5(old_sig)
            var url2 = "https://apis.map.qq.com"+url+'&sig='+sig
            rq({
                url: url2,
                method: "GET",
                json: true,
            }, function (error, response, body) {
                if(body.status!=0){
                    resolve({
                        code: 'smsError',
                        msg: body,
                    });
                }
                resolve({
                    errcode: '200',
                    msg: "操作成功",
                    result:{
                        distance:body.result.elements[0].distance
                    },
                    success:true,
                    timestamp:new Date().getTime()
                });
            });
        })
    });
    return app.serve();
}