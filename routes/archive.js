const express = require('express');
const router = express.Router();
const Archive = require('../models/Archive');
module.exports = app =>{

  //档案路由
  router.post('/archives', async (req, res) => {
    let model;
    if(req.body._id){
      model = await Archive.findByIdAndUpdate(req.body._id,req.body).exec();
    }else {
      delete req.body._id;
      req.body.userId = req.id;
      const check = await Archive.findOne({relation:req.body.relation});
      let relation,userId;
      check ? {relation,userId}=check : relation=userId='';
      if(relation && req.id===userId){
        model = {code:-1,msg:'此关系人已存在，请勿重复添加！'}
      }else{
        model = await Archive.create(req.body);
      }
    }
    res.send(model);
  });
  router.get('/archives',async (req,res)=>{
    const data = await Archive.find({userId:req.id});
    res.send(data);
  });
  router.get('/archives:id',async (req,res)=>{
    const data = await Archive.findById(req.params.id);
    res.send(data)
  });
  router.delete('/archives',async (req,res)=>{
    const result = await Archive.findByIdAndDelete(req.body._id);
    res.send(result);
  });


  app.use('/api',router);
};