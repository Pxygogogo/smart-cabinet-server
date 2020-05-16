const express = require('express');
const router = express.Router();
const Notice = require('../models/Notice');
const User = require('../models/User');

module.exports = app => {

    router.post('/notices', async (req, res) => {
        if (req.body._id) {
            const model = await Notice.findByIdAndUpdate(req.body._id, req.body).exec();
            res.send(model)
        } else {
            delete req.body._id;
            req.body.userId = req.id;
            const {email} = await User.findById(req.id, {email: 1});
            const result = await Notice.create(req.body);
            const data = {
                ...result._doc,
                emailAddr: email,
            };
            //给树莓派发送提醒
            if (data && app.ws['test']) {
                console.log('send notice');
                console.log('notice' + JSON.stringify(data));
                app.ws['test'].send('notice' + JSON.stringify(data));
            }
            res.send(result);
        }

    });
    router.get('/notices', async (req, res) => {
        const data = await Notice.find({userId: req.id});
        res.send(data);
    });
    router.get('/notices:id', async (req, res) => {
        const data = await Notice.findById(req.params.id);
        res.send(data)
    });
    router.delete('/notices', async (req, res) => {
        const result = await Notice.findByIdAndDelete(req.body._id);
        if (result && app.ws['test']) {
            console.log('send delete notice');
            app.ws['test'].send('deletenotc' + JSON.stringify(result));
        }
        res.send(result);
    });
    app.use('/api', router);
};