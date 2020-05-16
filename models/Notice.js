const mongoose = require('mongoose');

const schema = mongoose.Schema({
    userId:{type:String},
    time: {type:String},
    medicines: {type:Array},
    noticePerson:{type:String},
    acrtTime:{type:String},
    durationTime:{type:String}
});

module.exports = mongoose.model('Notice',schema);