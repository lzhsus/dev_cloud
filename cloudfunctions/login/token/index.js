// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise');
module.exports ={
    token
}
async function token(event, context){
    const page = event.page
    const scene = event.scene
    //appid和秘钥
    const appid = "wx1314c40d5e143385";
        secret = "daa600f6e4a7dfe76cade3268529b2d4";
    const AccessToken_options = {
        method: 'GET',
        url: 'https://api.weixin.qq.com/cgi-bin/token',
        qs: {
            appid,
            secret,
            grant_type: 'client_credential'
        },
        json: true
    };
    //获取AccessToken
    const resultValue = await rp(AccessToken_options);
    const token = resultValue.access_token;
    return token;
}