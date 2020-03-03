const mongoose = require('mongoose');

const schema = mongoose.Schema({
    userId:{type:String},
    avatarImg:{type:String}, // 头像地址
    relation: {type: String}, //与本人关系
    sex: {type: String}, // 性别
    age: {type: Number}, // 年龄
    condition: {type: String}, // 身体状况
    dailyMedicine: {type: String}, // 日常用药
    taboo: {type: String}, // 个人禁忌
    recentMedicine: {type: String}, // 近期用药

});

module.exports = mongoose.model('Archive',schema);