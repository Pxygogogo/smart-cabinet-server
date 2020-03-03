const mongoose = require('mongoose');

const schema = mongoose.Schema({
    openid: {type:String},
    avatarUrl: {type:String},
    city: {type:String},
    country: {type:String},
    gender: {type:Number},
    language: {type:String},
    nickName: {type:String},
    province: {type:String},
    email:{type:String},
});

module.exports = mongoose.model('User',schema);