const {parse, } = require('url');
const {parse:qsParse} = require('querystring');
const express = require('express');
const WebSocket = require('ws');
const auth = require('./middlewares/auth');
const app = express();
const updateMedicineStatus = require('./utils/updateMedicineStatus');
app.set('jwtKey', 'smart-cabinet');
app.ws = {};


const wss = new WebSocket.Server({
    port: 3001,
});

wss.on('connection', function connection(ws, req) {
    console.log('connection');
    const query = qsParse(parse(req.url).query);
    app.ws[query.client_id] = ws;
    ws.on('message', async function incoming(message) {
        await console.log('received: %s', message);
        if(message.indexOf('confirm')!==-1){
            console.log('update status')
            updateMedicineStatus({message});
        }

    });
    setTimeout(()=>{
        console.log('send 1');
        ws.send(1);
    },1000)
    // ws.on('done', function done() {
    //     console.log('send success');
    //     ws.send('add done');
    // });
});



app.use(auth({app}));
//解析post数据
app.use(express.json());
//静态文件托管
app.use('/uploads', express.static(__dirname + '/uploads'));


require('./routes/index')(app);
require('./routes/health')(app);
require('./routes/archive')(app);
require('./routes/notice')(app);
require('./plugins/db')(app);


app.listen(3000, () => {
    console.log('http://localhost:3000')
});
