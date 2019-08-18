import express from 'express'
import User from '../models/User'
import md5 from 'blueimp-md5'
import formidable from "formidable"
import config from "../src/config"
import {basename} from "path"
const router = express.Router({})

const S_KEY = '@WaLk1314?.Md5|==#'

/***********************接口API*****************************/
/*
    生成后台管理员
 */
router.post('/user/api', (req, res ,next) => {
    const user_name = req.body.user_name || ''
    const user_pwd = md5(req.body.user_pwd + S_KEY) || ''

    // 操作数据库
    const user = new User({
        // 用户名
        user_name: user_name,
        // 密码
        user_pwd: user_pwd
    })
    user.save((err, result) => {
        if (err) {
            return next(err)
        }
        res.json({
            status: 200,
            result: '添加管理员成功！'
        })
    })
})
/*
    用户名密码进行登录
 */
router.post('/user/api/login', (req, res, next) => {
    // 获取数据
    const user_name = req.body.user_name
    const user_pwd = req.body.user_pwd

    // 查询数据
    User.findOne({user_name:user_name}, (err, user) => {
        if (err) {
            return next(err)
        }
        if (user) {
            // 判断密码
            if (user.user_pwd === user_pwd) {
                // session中存token
                req.session.token = user._id
                res.json({
                    status: 200,
                    result: {
                        token: user._id
                    }
                })
            } else {
                res.json({
                    status: 101,
                    result: '输入密码有误！'
                })
            }
        } else {
            res.json({
                status: 102,
                result: '用户不存在！'
            })
        }
    })
})
/*
    退出登录
 */
router.get('/back/user/api/logout', (req, res, next) => {
    // 销毁session
    // 方式1
    req.session.cookie.maxAge = 0
    // 方式2
    // req.session.destory((err) => {
    //     return next(err)
    // })
    // 提示用户
    res.json({
        status: 200,
        result: '退出登录成功！'
    })
})
/*
    获取用户信息-部分
 */
router.get('/back/user/api/u_msg/:token', (req, res, next) => {
    User.findById(req.params.token,"-_id icon_url real_name intro_self points rank gold", (err, user) => {
        if (err) {
            return next(err)
        }
        if (user) {
            res.json({
                status: 200,
                result: user
            })
        } else {
            req.session.cookie.maxAge = 0
        }
    })
})
/*
    获取用户信息-全部
 */
router.get('/back/user/api/u_msg_all/:token', (req, res, next) => {
    User.findById(req.params.token,"-_id -user_name -user_pwd -l_edit -c_edit", (err, user) => {
        if (err) {
            return next(err)
        }
        if (user) {
            res.json({
                status: 200,
                result: user
            })
        } else {
            req.session.cookie.maxAge = 0
        }
    })
})
/*
    根据Id(token)修改用户信息
 */
router.post('/back/user/api/edit', (req, res, next) => {
    const form = new formidable.IncomingForm()
    form.uploadDir = config.uploadPath  // 上传文件放置的文件夹
    form.keepExtensions = true  // 保持文件原始扩展名
    form.parse(req, (err, fields, files) => {
        if (err) {
            return next(err)
        }
        // 根据id查询文档
        User.findById(fields.token, (err, user) => {
            if (err) {
                return next(err)
            }
            // 修改文档的内容
            user.real_name = fields.real_name
            user.icon_url = fields.icon_url || basename(files.icon_url.path)
            user.phone = fields.phone
            user.e_email = fields.e_email
            user.join_time = fields.join_time
            user.intro_self = fields.intro_self
            // 保存
            user.save((err, result) => {
                if (err) {
                    return next(err)
                }
                res.json({
                    status: 200
                })
            })
        })
    })
})
/*
    根据Id(token)修改密码
 */
router.post('/back/user/api/reset', (req, res, next) => {
    let token = req.body.token,
        old_pwd = req.body.old_pwd,
        new_pwd = req.body.new_pwd
    User.findById(token, (err, user) => {
        if (err) {
            return next(err)
        }
        if (user) {
            if (user.user_pwd === old_pwd) {
                user.user_pwd = new_pwd
                user.save((err, result) => {
                    if (err) {
                        return next(err)
                    }
                    res.json({
                        status: 200
                    })
                })

            } else {
                res.json({
                    status: 102
                })
            }
        } else {
            res.json({
                status: 101
            })
        }
    })
})
/***********************页面路由*****************************/

router.get('/back/login', (req, res, next) => {
    res.render('back/login.html')
})

router.get('/back/u_center', (req, res, next) => {
    res.render('back/user_center.html')
})

router.get('/back/u_set', (req, res, next) => {
    res.render('back/user_message.html')
})

router.get('/back/u_reset_pwd', (req, res, next) => {
    res.render('back/reset_pwd.html')
})

export default router
