module.exports = app =>{
  const mongoose = require('mongoose');
    mongoose.set('useCreateIndex', true);
    mongoose.set('useFindAndModify', false);
  mongoose.connect('mongodb://127.0.0.1:27017/smart-cabinet',{
      useNewUrlParser:true,
      useUnifiedTopology: true
  })
};