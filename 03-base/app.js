const express = require('express')
const swig = require('swig')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require("connect-mongo")(session)
const app = express()

mongoose.connect('mongodb://localhost/blog', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
    throw new Error('DB error')
})

db.once('open',  () => {
    console.log('DB connected')
})

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

swig.setDefaults({
    cache: false
})
app.engine('html', swig.renderFile);
app.set('views', './views')
app.set('view engine', 'html')
app.use(session({
    name: 'bloguser',
    secret: 'abc123',
    resave: true,
    saveUninitialized: true,
    rolling: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}))

app.use((req,res,next)=>{  
    req.userInfo = req.session.userInfo || {}
    next()
})
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))
app.use('/admins',require('./routes/admins'))
app.use('/categories',require('./routes/categories'))
app.use('/articles',require('./routes/articles'))

app.listen(3000,()=>{
    console.log('server is running at http://127.0.0.1:3000')
})