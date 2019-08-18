import express from 'express'
import Sowing from '../models/Sowing'
import config from '../src/config'
import {basename} from 'path'
import formidable from 'formidable'
const router = express.Router({})



/***************************接口API*********************************/



/*
    往数据库插入一条新记录
 */
router.post('/back/sowing/api/add', (req, res, next) => {
    const form = new formidable.IncomingForm()
    form.uploadDir = config.uploadPath  // 上传文件放置的文件夹
    form.keepExtensions = true  // 保持文件原始扩展名
    form.parse(req, (err, fields, files) => {
        if (err) {
            return next(err)
        }
        // 1.解析上传的文件路径，取出文件名保存到数据库
        fields.image_url = basename(files.image_url.path)
        // 2.操作数据库
        const sowing = new Sowing({
            // 图片名称
            image_title: fields.image_title,
            // 图片地址
            image_url: fields.image_url,
            // 跳转链接
            image_link: fields.image_link,
            // 上架时间
            s_time: fields.s_time,
            // 下架时间
            e_time: fields.e_time,
        })
        sowing.save((err, result) => {
            if (err) {
                return next(err)
            }
            res.json({
                status: 200,
                result: '添加轮播图成功'
            })
        })
    })

    // // 1.获取数据
    // const body = req.body
    // // 操作数据库
    // const sowing = new Sowing({
    //     // 图片名称
    //     image_title: body.image_title,
    //     // 图片地址
    //     image_url: body.image_url,
    //     // 跳转链接
    //     image_link: body.image_link,
    //     // 上架时间
    //     s_time: body.s_time,
    //     // 下架时间
    //     e_time: body.e_time,
    // })
    // sowing.save((err, result) => {
    //     if (err) {
    //         return next(err)
    //     }
    //     res.json({
    //         status: 200,
    //         result: '添加轮播图成功'
    //     })
    // })
})
/*
    获取所有的轮播图列表
 */
router.get('/back/sowing/api/list', (req, res, next) => {
    Sowing.find({}, "image_title image_url image_link s_time e_time",(err, docs) => {
        if (err) {
            return next(err)
        }
        // 返回数据
        res.json({
            status: 200,
            result: docs
        })
    })
})
/*
    获取一条轮播图(id)
    : 模糊匹配
 */
router.get('/back/sowing/api/single/:sowingId', (req, res, next) => {
    Sowing.findById(req.params.sowingId, "_id image_title image_url image_link s_time e_time",(err, docs) => {
        if (err) {
            return next(err)
        }
        // 返回数据
        res.json({
            status: 200,
            result: docs
        })
    })
})
/*
    根据Id修改一张轮播图
 */
router.post('/back/sowing/api/edit', (req, res, next) => {
    const form = new formidable.IncomingForm()
    form.uploadDir = config.uploadPath  // 上传文件放置的文件夹
    form.keepExtensions = true  // 保持文件原始扩展名
    form.parse(req, (err, fields, files) => {
        if (err) {
            return next(err)
        }
        // 根据id查询文档
        Sowing.findById(fields.id, (err, sowing) => {
            if (err) {
                return next(err)
            }
            // 修改文档的内容
            sowing.image_title = fields.image_title
            sowing.image_url = fields.image_url || basename(files.image_url.path)
            sowing.image_link = fields.image_link
            sowing.s_time = fields.s_time
            sowing.e_time = fields.e_time
            sowing.l_time = Date.now()
            // 保存
            sowing.save((err, result) => {
                if (err) {
                    return next(err)
                }
                res.json({
                    status: 200,
                    result: '修改轮播图成功'
                })
            })
        })
    })
})
/*
    根据Id删除一张轮播图
 */
router.get('/back/sowing/api/remove/:sowingId', (req, res, next) => {
    Sowing.deleteOne({_id: req.params.sowingId}, (err, result) => {
        if (err) {
            return next(err)
        }
        // 返回数据
        res.json({
            status: 200,
            result: '成功删除轮播图！'
        })
    })
})



/***************************页面路由*********************************/



/*
    加载轮播图列表
 */
router.get('/back/s_list', (req, res, next) => {
    Sowing.find({}, 'image_title image_url image_link',(err, sowings) => {
        console.log(sowings)
        if (err) {
            return next(err)
        }
        res.render('back/sowing_list.html', {sowings})
    })
})

/*
    添加轮播图
 */
router.get('/back/s_add', (req, res, next) => {
    res.render('back/sowing_add.html')
})

/*
    修改轮播图
 */
router.get('/back/s_edit', (req, res, next) => {
    res.render('back/sowing_edit.html')
})

export default router
