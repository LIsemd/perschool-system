import express from 'express'
import Sowing from '../models/Sowing'
const router = express.Router({})

/*
    前端页面路由
 */
router.get('/', (req, res) => {
    res.redirect('/web')
})

router.get('/web', (req, res) => {
    res.render('web/index.html')
})

router.get('/web/res', (req, res) => {
    Sowing.find((err, sowings) => {
        if (err) {
            return next(err)
        }
        // 追加字段
        let tag = ['one','two','three','four']
        for(let i=0; i < tag.length; i++) {
            let sowing = sowings[i]
            sowing['image_tag'] = tag[i]
        }
        res.render('web/resources.html', {sowings})
    })
})

router.get('/web/res_c', (req, res) => {
    res.render('web/resources_content.html')
})
/*
    后端页面路由
 */
router.get('/back', (req, res) => {
    res.render('back/index.html')
})

export default router
