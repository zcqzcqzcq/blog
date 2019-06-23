const express = require('express')
const app = express()
const mysql = require('mysql')
const moment = require('moment')
const conn = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'blog'
})
const bodyParser = require('body-parser')

// 设置 默认采用的模板引擎名称
app.set('view engine', 'ejs')

// 设置模板页面的存放路径
app.set('views', './views')

app.use('/node_modules', express.static('node_modules'))

app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    res.render('index', {})
})

app.get('/login', (req, res) => {
    res.render('./user/login.ejs')
})


// get post 一个是引入数据 一个是获取数据
app.get('/register', (req, res) => {
    //注意：当在调用模板引擎的res.render函数的时候，./相对路径，是相对于app.set（'views'）指定的目录，来进行查找的
    res.render('./user/register.ejs')
})

app.post('/register', (req, res) => {
    // TODO: 完成用户注册的业务逻辑
    const body = req.body

    if (body.username.trim().length <= 0 || body.password.trim().length <= 0 || body.nickname.trim().length <= 0) {
        // console.log(0);
        return res.send({ msg: '请填写完整的表单数据后再注册用户！', status: 501 })
    }

    // 查询用户名是否重复
    const sql1 = 'select count(*) as count from users where username = ?'
    conn.query(sql1, body.username, (err, result) => {
        if (err) return res.send({ msg: '注册新用户失败！', status: 502 })
        if (result[0].count !== 0) return res.send({ msg: '请更换其他用户名后重新注册！', status: 503 })

    })

    body.ctime = moment().format('YYYY-MM-DD MM:mm:ss')

    const sql2 = 'insert into users set ?'
    conn.query(sql2, body, (err, result) => {
        if (err) return res.send({ msg: '注册新用户失败！', status: 504 })

        if (result.affectedRows !== 1) return res.send({ msg: '注册新用户失败！', status: 505 })
        res.send({ msg: '注册新用户成功！', status: 200 })
    })
})


app.post('/login', (req, res) => {
    const body = req.body
    const sql1 = 'select * from users where username = ? and password = ?'
    conn.query(sql1, [body.username, body.password], (err, result) => {
        if (err) return res.send({ msg: '用户登陆失败', status: 501 })

        if (result.length != 1) return res.send({ msg: '用户登录失败', status: 502 })
        res.send({ msg: 'ok', status: 200 })
    })
})



app.listen(3000, () => {
    console.log("服务器运行成功……")
})