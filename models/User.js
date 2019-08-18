import mongoose from 'mongoose'
const userSchema = mongoose.Schema({
    // 姓名
    real_name: { type: String, default: '新用户' },
    // 用户名
    user_name: { type: String, required: true },
    // 密码
    user_pwd: { type: String, required: true },
    // 头像
    icon_url: { type: String },
    // 手机号码
    phone: { type: String },
    // 邮箱
    e_email: { type: String },
    // 加入日期
    join_time: { type: String },
    // 自我介绍
    intro_self: { type: String, default: '天赋如同自然花木，要用学习来修剪。' },
    // 积分
    points: { type: Number, default: 100 },
    // 等级
    rank: { type: Number, default: 1 },
    // 金币
    gold: { type: Number, default: 0 },
    // 当前编辑时间
    l_edit: { type: Date, default: Date.now() },
    // 最后编辑时间
    c_edit: { type: Date, default: Date.now() },
})

const User = mongoose.model('user', userSchema)
export default User
