const cloud = require('wx-server-sdk');
const {
  WXPay,
  WXPayUtil
} = require('wx-js-utils');

cloud.init();


const appId = 'wx1314c40d5e143385'           // 小程序appid
const mchId = '152*******';                   // 商户号
const key = '****************************';   // 商户密钥
const timeout = 10000;                        // 超时时间

let wxpay = new WXPay({
  appId,
  mchId,
  key,
  timeout: 10000,
  signType: 'MD5',
  useSandbox: false       // 不使用沙箱环境
});

exports.main = async(event, context) => {
  const curTime = Date.now();
  const tradeNo = `${event.userInfo.openId.substr(-5)}-${curTime}`; // 生成订单号
  const body = '测试订单';   // 订单商品名称
  const spbill_create_ip = '127.0.0.1';   // 发起支付的IP
  const notify_url = 'http://www.qq.com'; // 回调地址
  const total_fee = event.price * 100;    // 支付金额，单位为分
  const time_stamp = '' + Math.ceil(Date.now() / 1000);
  const out_trade_no = `${tradeNo}`;
  let orderParam = {
    body,
    spbill_create_ip,
    notify_url,
    out_trade_no,
    total_fee,
    openid: event.userInfo.openId,
    trade_type: 'JSAPI',
    timeStamp: time_stamp,
  };
  const {
    return_code,
    result_code,
    ...restData
  } = await wxpay.unifiedOrder(orderParam); // 统一下单
  if (return_code === 'SUCCESS' && result_code === 'SUCCESS') {
    const {
      prepay_id,
      nonce_str
    } = restData;
    const sign = WXPayUtil.generateSignature({
      appId,
      nonceStr: nonce_str,
      package: `prepay_id=${prepay_id}`,
      signType: 'MD5',
      timeStamp: time_stamp
    }, key); // 签名
    return {
      code: 0,
      data: {
        out_trade_no,
        time_stamp,
        ...restData,
        sign
      }
    }
  }
  return {
    code: -1
  }
};