const express = require('express');
const router = express.Router();
const axios = require('axios');

module.exports = app => {
    router.get('/health-news', async (req, res) => {
        const {page} = req.query;
        const {code,data,msg} = await axios.get(`https://common.itv.cctv.com/publicPush/DataList?column=3029&tid=29&page=${page}&limit=10`);
        res.send(data.data);
    });
    router.get('/detail',async(req,res)=>{
        const {id} = req.query;
        const{code,data,msg} = await axios.get(`https://api.itv.cctv.com/publicPush/Detail?id=${id}`);
        const REG = /<video[^>]+>/g;
        let result = data.data.content.replace(REG,"");
        res.send(result);
    });

    app.use('/api', router);
};