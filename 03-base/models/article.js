const mongoose = require('mongoose')
const pagination = require('../utils/pagination')
const moment=require('moment')
const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    intro: {
        type: String,
        default: ''
    },
    content:{
        type: String,
        default: ''       
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category'
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    click:{
        type:Number,
        default:0
    }
})


articleSchema.statics.findPaginationArticles = function (req,query) {
    const options = {
        page: req.query.page,
        projection: '-__v',
        sort: { order: 1 },
        model: this,
        query:query,
        populates: [{ path: 'user', select: 'username' }, { path: 'category', select: 'name' }]
    }
    return pagination(options)
}

articleSchema.virtual('createdTime').get(function(){
    return moment(this.createdAt).format('YYYY-MM-DD HH:mm:ss')
})
const Article = mongoose.model('article', articleSchema)
module.exports = Article