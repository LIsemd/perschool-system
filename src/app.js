/***************************引入模块*********************************/

import express from 'express'
import config from './config'
import nunjucks from 'nunjucks'

/***************************引入中间件*********************************/

import bodyParser from '../middle_wares/body_parser'
import errorLog from '../middle_wares/error_log'
import loginPass from '../middle_wares/login_pass'

/***************************引入express-session*********************************/

import session from 'express-session'

/***************************引入connect-mongo*********************************/

const mongoStore = require('connect-mongo')(session)

/***************************引入路由*********************************/

import indexRouter from './../routes/index'
import sowingRouter from './../routes/sowing'
import userRouter from './../routes/user'
import sourceRouter from './../routes/source'

/***************************使用express*********************************/

const app = express()

/***************************使用session中间件*********************************/

app.use(session({
    secret: 'lisemd',
    name: 'demo',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1800000 },
    rolling: true,
    store: new mongoStore({
        url: 'mongodb://127.0.0.1/college', // 数据库地址
        touchAfter: 24*3600   // 数据库更新时间间隔
    })
}))

/***************************配置公共资源访问路径*********************************/

app.use(express.static(config.publicPath))

/***************************配置模板引擎*********************************/

nunjucks.configure(config.viewPath, {
    autoescape: true,
    express: app,
    noCache: true   // 不使用缓存
});

/***************************配置普通中间件*********************************/

app.use(bodyParser)

/***************************配置拦截中间件*********************************/

app.use(loginPass)

/***************************配置路由*********************************/

app.use(indexRouter)
app.use(sowingRouter)
app.use(userRouter)
app.use(sourceRouter)

/***************************配置错误处理中间件*********************************/

app.use(errorLog)

/***************************配置404页面*********************************/

app.use((req, res) => {
    res.render('404.html')
})

/***************************配置监听端口*********************************/

app.listen(3000, () => {
    console.log('服务器启动成功！')
})
