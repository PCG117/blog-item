// /routes/admins.js
const express = require('express')
const router = express.Router()

const User = require('../models/user')
const pagination=require('../utils/pagination')

//权限的验证
router.use((req,res,next)=>{
    if(req.userInfo.isAdmin){
        next()
    }else{
        return res.send('<h1>请用管理员账号登录</h1>')
    }
})

//显示管理员后台首页
router.get("/", async (req, res) => {
    //获取用户总算
    const userCount = await User.estimatedDocumentCount()

    res.render('admin/index', {
        userInfo: req.userInfo,
        userCount: userCount
    })
})

router.get('/users',async(req,res)=>{
    let page=parseInt(req.query.page)
    const limit=2
    if(isNaN(page)){
        page=1
    }
    if(page<0){
        page=1
    }
    const total=await User.estimatedDocumentCount()
    const pages=Math.ceil(total/limit)
    if(page>pages){
        page=pages
    }
    const skip=(page-1)*limit
    const list=[]
    for(let i=1;i<=pages;i++){
        list.push(i)
    }
    const users=await User.find({},'-password -__v').sort({_id:-1}).skip(skip).limit(limit)
    res.render('admin/user_list',{
        userInfo:req.userInfo,
        users:users,
        list:list,
        pages:pages,
        page:page
    })
})

router.get('/users',async(req,res)=>{
    const options={
        page:req.query.page,
        projection:'-password -__v',
        model:User
    }

    const result=await pagination(options)
    res.render('admin/user_list',{
        userInfo:req.userInfo,
        users:result.docs,
        list:result.list,
        pages:result.pages,
        page:result.page,
        url:'/admins/users'
    })
})
router.get('/password',async(req,res)=>{
    res.render('admin/password',{
        userInfo:req.userInfo
    })
})
router.post("password", async (req, res) => {
    const {password} = req.body
    try {
        await User.updateOne({ _id: req.userInfo._id }, { password: hmac(password)})
        req.session.destroy()
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '修改密码成功',
            nextUrl: '/'
        })
    } catch (e) {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '服务器端错误',
            nextUrl: '/admins/password'
        })
    }
})
module.exports = router