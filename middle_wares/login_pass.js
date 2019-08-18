export default (req, res, next) => {
    // 1.过滤非后端请求
    if (req.path.indexOf('/back/') === -1) {
        return next()
    }
    // 2.判断是否是处于有效登录时效
    if (req.session.token) {
        return next()
    }
    // 3.没有登录 登录失效
    // API相关
    if (req.path.indexOf('/api/') !== -1) {
        return next(new Error('非法访问！'))
    }
    // 页面相关
    res.render('back/login.html')
}
