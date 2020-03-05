const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    feedback:{type:String},
    userId:{type:String},
});

module.exports = mongoose.model('Feedback',schema);