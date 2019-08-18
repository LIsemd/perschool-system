// 引入
import express from 'express'
import Source from './../models/Source'
import config from './../src/config'
import {basename} from 'path'
import formidable from 'formidable'
import Sowing from "../models/Sowing";
const router = express.Router({});

/**************************接口API********************************/
/*图片上传uploads文件夹*/
router.post('/back/source/api/add_img', (req, res, next)=>{
    const form = new formidable.IncomingForm();
    form.uploadDir = config.uploadPath;  // 上传图片放置的文件夹
    form.keepExtensions = true; // 保持文件的原始扩展名
    form.parse(req, (err, fields, files)=>{
        if(err){
            return next(err);
        }

        if(files.image_url){
            console.log(files.image_url.path);
            let image_url = 'http://localhost:3000/uploads/' + basename(files.image_url.path);
            res.json({
               status: 200,
               result: image_url
            });
        }else {
            res.json({
                status: 1,
                result: '删除图片路径出现问题!'
            });
        }
    });
});

/*往数据库中插入一条新纪录*/
router.post('/back/source/api/add', (req, res, next)=>{
    const form = new formidable.IncomingForm();
    form.uploadDir = config.uploadPath;  // 上传图片放置的文件夹
    form.keepExtensions = true; // 保持文件的原始扩展名
    form.parse(req, (err, fields, files)=>{
        if(err){
            return next(err);
        }
        // 解析上传的文件路径, 取出文件名保存到数据库
        fields.small_img = basename(files.small_img.path);
        // 操作数据库
        const source = new Source({
            title: fields.title,
            author: fields.author,
            small_img: fields.small_img,
            price: fields.price,
            content: fields.content,
        });
        source.save((err, result)=>{
            if(err){
                return next(err);
            }
            res.json({
                status: 200,
                result: '添加轮播图成功'
            })
        });
    });
});

/*获取一条轮播图 (id)*/
router.get('/back/source/api/single/:sourceId', (req, res, next)=>{
    Source.findById(req.params.sourceId, (err, docs)=>{
        if(err){
            return next(err);
        }
        // 数据返回
        res.json({
            status: 200,
            result: docs
        })
    })
});

/*根据id去修改一篇文章*/
router.post('/back/source/api/edit', (req, res, next)=>{
    const form = new formidable.IncomingForm();
    form.uploadDir = config.uploadPath;  // 上传图片放置的文件夹
    form.keepExtensions = true; // 保持文件的原始扩展名
    form.parse(req, (err, fields, files)=>{
        if(err){
            return next(err);
        }
        // 1. 取出普通字段
        let body = fields;
        // 2. 根据id查询文档
        Source.findById(body.id, (err, source)=>{
            if(err){
                return next(err);
            }
            // 2.1 修改文档的内容
            source.title = body.title;
            source.author = body.author;
            source.small_img = body.small_img || basename(files.small_img.path);
            source.price = body.price;
            source.content = body.content;
            // 2.2 保存
            source.save((err, result)=>{
                if(err){
                    return next(err);
                }
                res.json({
                    status: 200,
                    result: '修改轮播图成功!'
                })
            });
        });
    });
});

/**
 * 根据id删除一篇文章
 */
router.get('/back/source/api/remove/:sourceId', (req, res, next)=>{
    Source.deleteOne({_id: req.params.sourceId}, (err, result)=>{
        if(err){
            return next(err);
        }
        // 数据返回
        res.json({
            status: 200,
            result: '成功删除资源文章!'
        })
    })
});


/*获取总页数*/
router.get('/back/source/api/count', (req, res, next)=>{
    Source.countDocuments((err, count)=>{
        if(err){
            return next(err);
        }
        // 数据返回
        res.json({
            status: 200,
            result: count
        })
    })
});

/* 获取列表页面数据*/
router.get('/back/source/api/list', (req, res, next)=>{
    // 接收两个参数
    let page = Number.parseInt(req.query.page, 10) || 1;
    let pageSize = Number.parseInt(req.query.pageSize, 10) || 10;

    // 查询所有的数据
    Source.find().skip((page - 1) * pageSize ).limit(pageSize).exec((err, sources)=>{
        if(err){
            return next(err);
        }
        res.json({
            status: 200,
            result: sources
        });
    });
});

/**************************接口API-end********************************/


/**************************页面路由-start********************************/
/**
 * 加载资源文章列表
 */
router.get('/back/source_list', (req, res, next)=>{
    // 查询所有的数据
    Source.find((err, sources)=>{
        if(err){
            return next(err);
        }
        res.render('back/source_list.html', {sources});
    });

})

/*
router.get('/back/source_list', (req, res, next)=>{
    // 接收两个参数
    let page = Number.parseInt(req.query.page, 10) || 1;
    let pageSize = Number.parseInt(req.query.pageSize, 10) || 3;
    /!*
      (page - 1) * pageSize
    *!/
    // 查询所有的数据
    Source.find().skip((page - 1) * pageSize ).limit(pageSize).exec((err, sources)=>{
        if(err){
            return next(err);
        }

        // 查询数据库中总记录数
        Source.countDocuments((err, count)=>{
            if(err){
                return next(err);
            }

            // 总页码
            let totalPage = Math.ceil(count / pageSize);
            // 当前页码
            res.render('back/source_list.html', {sources, totalPage, page});
        });
    });
});
*/

/**
 * 加载添加资源文章页面
 */
router.get('/back/source_add', (req, res, next)=>{
    res.render('back/source_add.html');
});

/**
 * 加载编辑资源文章页面
 */
router.get('/back/source_edit', (req, res, next)=>{
    res.render('back/source_edit.html');
});

/**************************页面路由-end********************************/


// 输出
export default router;
