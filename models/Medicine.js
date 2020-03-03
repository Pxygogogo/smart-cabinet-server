const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    userId:{type:String},
    medicineImg:{type:String}, //药物图片地址
    name:{type: String},  //药物名称
    type:{type: String}, //药物类型
    quantity:{type: String}, //储备数量
    effectiveDate:{type: String}, //有效日期
    // time:{type: String}, //一天服药次数
    package:{type: String}, //一次服药粒数
    beforeEat:{type:String}, //饭前/后
    isChecked:{type:Boolean,default:false} //是否已存到药箱里
});


module.exports = mongoose.model('Medicine',schema);