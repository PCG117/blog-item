const mongoose = require('mongoose')
const moment = require('moment')

const pagination = require('../utils/pagination')

const commentScheme=new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    article:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'article'
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})
commentScheme.virtual('createdTime').get(function(){
    return moment(this.createdAt).format('YYYY-MM-DD HH:mm:ss')
})
commentScheme.statics.findPaginationComments=async function(req,query){
    const options={
        page:req.query.page,
        projection:'-__v',
        model:this,
        query:query,
        populates:[{path:'user',select:'username'},{path:'article',select:'title'}]
    }
    const result=await pagination(options)
}