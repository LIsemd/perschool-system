import querystring from 'querystring'

// 处理 Post 请求
export default (req, res, next) => {
    // 过滤 get 请求
    if (req.method.toLowerCase() === 'get') {
        return next()
    }

    // 如果是普通的表单提交，要处理application/x-www-form-urlencoded
    // 如果有文件（图片，音视频，...），不处理 multipart/form-data
    if (req.headers['content-type'].startsWith('multipart/form-data')) {
        return next()
    }
    // 数据流拼接
    let data = ''
    req.on('data', (chunk) => {
        data += chunk
    })
    req.on('end', () => {
        req.body = querystring.parse(data)
        next()
    })
}
