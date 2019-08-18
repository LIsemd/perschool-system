import mongoose from 'mongoose'

mongoose.connect('mongodb://localhost/college', {useNewUrlParser: true})

mongoose.connection.on('open', () => {
    console.log('数据库连接成功！')
})
mongoose.connection.on('error', err => {
    throw err
})


// 创建轮播图模式对象
const sowingSchema = mongoose.Schema({
    // 图片名称
    image_title: {type: String, required: true},
    // 图片地址
    image_url: {type: String, required: true},
    // 跳转链接
    image_link: {type: String, required: true},
    // 上架时间
    s_time: {type: String, required: true},
    // 下架时间
    e_time: {type: String, required: true},
    // 编辑时间
    l_time: {type: Date, default: Date.now()},
    // 添加时间
    c_time: {type: Date, default: Date.now()}
})

const Sowing = mongoose.model('Sowing', sowingSchema)

export default Sowing
