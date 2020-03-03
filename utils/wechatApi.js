const axios = require('axios');
const config = require('./config');
const instance = axios.create({
    baseURL: 'https://api.weixin.qq.com',
    timeout: 10000,
});
instance.interceptors.response.use(response=>{
    return response.data;
});

const wechatApi = {
    auth:{
        async code2Session(code){
            return await instance.get(`/sns/jscode2session?appid=${config.appId}&secret=${config.appSecret}&js_code=${code}&grant_type=authorization_code`);
        },
    },
};
module.exports = wechatApi;