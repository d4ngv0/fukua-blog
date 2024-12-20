// load các biến môi trường từ file .env vào process.env
require('dotenv').config()

const express = require('express')
const jsonServer = require('json-server')
const cors = require('cors')

// khởi tạo một ứng dụng Express
const app = express()

// áp dụng middleware express.json() để phân tích dữ liệu JSON, giúp server có thể đọc được dữ liệu gửi lên từ client
app.use(express.json())

// áp dụng middleware express.urlencoded() để phân tích dữ liệu từ form gửi lên từ client, extended: true để sử dụng thư viện querystring
app.use(express.urlencoded({ extended: true }))

// áp dụng middleware express.static() để phục vụ các file tĩnh như hình ảnh, CSS, JavaScript, ...
app.use(express.static('public'))

// áp dụng middleware cors() để cho phép các request từ một domain khác
app.use(
    cors({
        origin: ['http://localhost:3000'],
        methods: ['GET', 'POST', 'DELETE'], // Chỉ cho phép một số phương thức
        allowedHeaders: ['Content-Type'], // Chỉ cho phép các header nhất định
        credentials: true, // Cho phép gửi cookie
    })
)

// Đặt view engine là EJS
app.set('view engine', 'ejs')

// Đặt thư mục chứa các file view là thư mục views
app.set('views', './views')

// áp dụng middleware jsonServer.router() để sử dụng db.json như một REST API trên đường dẫn /api của ứng dụng Express
app.use('/api', jsonServer.router('db.json'))

// định nghĩa các route


app.get('/', async (req, res) => {
   
    const blogs = await fetch('http://localhost:3000/api/blogs').then(res =>
        res.json()
    )

    res.render('home', { blogs})
    // console.log(blogs)
    // render file home.ejs trong folder views-là folder mà ta đã định nghĩa ở trên, truyền dữ liệu users vào file home.ejs
   
})



app.delete('/api/comments/:id', async (req, res) => {
    const comments = await fetch(
        'http://localhost:3000/api/comments/'
    ).then(res => res.json())

    const index = comments.findIndex(item => item.id === req.params.id)
    
    if (index === -1){
        return res.status(404).send("Data not found")
    }

    comments.splice(index, 1);
    
    res.render('blog-detail', { blogs, comments })
})

app.get('/create-blog', async (req, res) => {
    
    res.render('create-blog')
})


app.get('/blogs/:id', async (req, res) => {

    const blog = await fetch(
        'http://localhost:3000/api/blogs/' + req.params.id
    ).then(res => res.json())
    const comments = await fetch(
        'http://localhost:3000/api/comments?blogId=' + req.params.id 
    ).then(res => res.json())

    res.render('blog-detail', { blog, comments })
})


app.get('/blogs/:id/edit', async (req, res) => {
    const blog = await fetch(
        'http://localhost:3000/api/blogs/' + req.params.id
    ).then(res => res.json())

 
    res.render('update-blog', { blog })
})


app.delete('/blogs/:id', async (req, res) => {
    const blogs = await fetch(
        'http://localhost:3000/api/blogs/'
    ).then(res => res.json())

    const index = blogs.findIndex(item => item.id === req.params.id)
    
    if (index === -1){
        return res.status(404).send("Data not found")
    }

    blogs.splice(index, 1);
    
    res.render('home', { blogs })
})




// sử dụng env
app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}`)
})
