const Medicine = require('../models/Medicine');

module.exports = options=>{
    const{message} = options;
    let begin = message.indexOf("['");
    let end = message.indexOf("']");
    let strMedicineArr = message.substring(begin+2,end); //得到字符串形式的数组
    let sp1 = strMedicineArr.split("','");
    sp1.map( async item=>{
        const res = await Medicine.findOneAndUpdate({name:item},{isChecked:true},(err)=>{
            if(err) throw Error('更新药物存储状态错误');
        });
    });
};