const express=require('express')
const router=express.Router()
const User=require('../models/user')
const hmac = require('../utils/hmac')

//注册
router.post("/register", async (req, res) => {
    const {username, password} = req.body
    try{
        //1. 判断用户名是否存在
        const user = await User.findOne({ username: username })
        if(user){
            return res.json({
                code:1,
                message:'用户已经存在'
            })
        }
        //2. 如果不存在就插入数据库
        await User.insertMany({
            username:username,
            password:hmac(password),
        isAdmin:true//仅仅在生成管理员是使用
        })
        res.json({
            code: 0,
            message: '注册成功'
        })
    }catch(e){
        res.json({
            code: 1,
            message: '注册失败,服务器端错误'
        })
    }
})
router.post("/login", async (req, res) => {
    const { username, password } = req.body
    try {
        const user = await User.findOne({ username,password:hmac(password)},"-password -__v")
        if (user) {
            req.session.userInfo=user
            return res.json({
                code: 0,
                message: '用户登陆成功'
            })
        }else{
            return res.json({
                code: 1,
                message: '用户名和密码不正确'
            })            
        }
    } catch (e) {
        res.json({
            code: 1,
            message: '登陆失败,服务器端错误'
        })
    }
})
router.get("/logout", async (req, res) => {
    req.session.destroy()
    return res.json({
        code: 0,
        message: '用户退出成功'
    })    
})
module.exports = router