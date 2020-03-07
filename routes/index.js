const express = require('express');
const multer = require('multer');
const Medicine = require('../models/Medicine');
const User = require('../models/User');
const Feedback = require('../models/Feedback');
const wechatApi = require('../utils/wechatApi');
const jwt = require('jsonwebtoken');

module.exports = app => {
    const router = express.Router();

    //药品
    router.post('/medicines', async (req, res) => {
        let model;
        if (req.body._id) {
            model = await Medicine.findByIdAndUpdate(req.body._id, req.body).exec();
        } else {
            delete req.body._id;
            req.body.userId = req.id;
            const check = await Medicine.findOne({name: req.body.name});
            let name, userId;
            check ? {name, userId} = check : name = userId = '';
            if (name && req.id === userId) {
                model = {code: -1, msg: '药物已存在，请勿重复添加！'}
            } else {
                model = await Medicine.create(req.body);
            }
        }
        res.send(model);
    });
    router.get('/medicines', async (req, res) => {
        let data;
        if (JSON.stringify(req.query) !== "{}" && req.query.query !== '全部药品') {
            const reg = `${req.query.query}`;
            data = await Medicine.find({
                userId: req.id,
                $or: [
                    {name: {$regex: reg}},
                    {type: {$regex: reg}},
                    {effectiveDate: {$regex: reg}},
                    {beforeEat: {$regex: reg}},
                    {package: {$regex: reg}},
                    {time: {$regex: reg}},
                ]
            });
        } else {
            data = await Medicine.find({userId: req.id});
        }

        res.send(data)
    });
    router.get('/medicines:id', async (req, res) => {
        const data = await Medicine.findById(req.params.id);
        res.send(data)
    });
    router.get('/query', async (req, res) => {
        const reg = `${req.query.query}`;
        const data = await Medicine.find({
            userId: req.id,
            $or: [
                {name: {$regex: reg}},
                {type: ['感冒用药']},
                {effectiveDate: {$regex: reg}},
                {beforeEat: [false]},
            ]
        });
        res.send(data)
    });
    router.delete('/medicines', async (req, res) => {
        const result = await Medicine.findByIdAndDelete(req.body._id);
        if (result && app.ws['test']) {
            console.log('send delete medicines');
            app.ws['test'].send('deletemedc' + JSON.stringify(result));
        }
        res.send(result);
    });
    router.post('/adddone', async (req, res) => {
        if (req.body.message === "add done") {
            if (app.ws['test']) {
                app.ws['test'].send(`addone${req.id}`);
            }
            res.send('ok');
        } else {
            res.send('failed');
        }
    });


    //处理图片上传
    const upload = multer({dest: __dirname + '/../uploads'});
    router.post('/upload', upload.single('file'), async (req, res) => {
        const file = req.file;
        file.url = `http://118.25.110.129:3000/uploads/${file.filename}`;
        res.send(file);
    });

    //登录
    router.post('/auth/login', async (req, res) => {
        const {code, userInfo} = req.body;
        if (!code || !userInfo) throw Error('缺少参数');
        const result = await wechatApi.auth.code2Session(code);
        if (typeof result.openid === 'undefined') throw  Error('登录失败');
        let user = await User.findOne({openid: result.openid});
        if (!user) {
            user = await User.create({
                openid: result.openid,
                email: '',
                ...userInfo,
            })
        }
        const token = jwt.sign({
            id: user._id
        }, app.get('jwtKey'));
        res.send({
            code: 0,
            token,
            user,
        })
    });

    //绑定邮箱
    router.post('/email', async (req, res) => {
        const {email, _id} = req.body;
        if (!email || !_id) throw Error('缺少参数');
        const model = await User.findByIdAndUpdate(_id, {email}).exec();
        res.send(model);
    });
    router.get('/email', async (req, res) => {
        const email = await User.findById(req.query._id, {email: 1});
        res.send(email);
    });
    //意见反馈
    router.post('/feedback',async(req,res)=>{
        const {feedback, _id} = req.body;
        if (!feedback || !_id) throw Error('缺少参数');
        const model = await Feedback.create({feedback,userId:_id});
        res.send(model);
    });
    app.use('/api', router);
};