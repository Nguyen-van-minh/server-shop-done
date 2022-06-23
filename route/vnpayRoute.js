const express = require('express')
const router = express.Router()
const dateFormat = require('dateformat');
const querystring = require('qs');
const crypto = require('crypto');
require('dotenv').config()


function sortObject(obj) {
    var sorted = {};
    var str = [];
    var key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
    }
    return sorted;
}


router.post('/', async (req, res) => {
    let Total = req.body.total

    try {
        let ipAddr =
            req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

        let vnpUrl = process.env.vnp_Url;
        const date = new Date();

        const createDate = dateFormat(date, 'yyyymmddHHmmss');
        // const orderId = order._id.toString();
        var orderId = dateFormat(date, 'HHmmss');


        var locale = 'vn';
        var currCode = 'VND';
        var vnp_Params = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = process.env.vnp_TmnCode;

        vnp_Params['vnp_Locale'] = locale;
        vnp_Params['vnp_CurrCode'] = currCode;
        vnp_Params['vnp_TxnRef'] = orderId;
        vnp_Params['vnp_OrderInfo'] = 'Thanh toán hóa đơn';
        vnp_Params['vnp_OrderType'] = 'billpayment';
        vnp_Params['vnp_Amount'] = Total * 100;
        vnp_Params['vnp_ReturnUrl'] = process.env.VNPAY_RETURN_URL;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = createDate;
        vnp_Params['vnp_BankCode'] = 'NCB';

        vnp_Params = sortObject(vnp_Params);
        const secretKey = process.env.vnp_HashSecret;
        var signData = querystring.stringify(vnp_Params, { encode: false });

        var hmac = crypto.createHmac('sha512', secretKey);
        var signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');
        vnp_Params['vnp_SecureHash'] = signed;
        const query = '?' + querystring.stringify(vnp_Params, { encode: false });
        vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
        // console.log('🚀 ~ file: order.js ~ line 80 ~ vnpUrl', vnpUrl);

        res.status(200).json({ code: '00', data: vnpUrl, query });
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'server error' })
    }
})



module.exports = router