const express = require('express')
const path = require('path')
const fs = require('fs')
const ejs = require('ejs')
const favicon = require('serve-favicon')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const mongoStore = require('connect-mongo')(session)
const serveStatic = require('serve-static')
const port = process.env.PORT || 3900
const app = express()
const dbUrl = 'mongodb://localhost/mall'

mongoose.connect(dbUrl)
// 连接成功
mongoose.connection.on('connected', function () {    
    console.log('Mongoose connection open to ' + dbUrl)  
})   
// 连接异常
mongoose.connection.on('error',function (err) {    
    console.log('Mongoose connection error: ' + err)  
})    
// 连接断开
mongoose.connection.on('disconnected', function () {    
    console.log('Mongoose connection disconnected')  
})  

// 视图路径及解析模板
app.set('views', path.join(__dirname, 'views'))
app.engine('.html',ejs.__express)
app.set('view engine', 'html')

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'favicon.ico')))

// handle request entity too large
app.use(bodyParser.json({
	limit: '50mb'
}))
app.use(bodyParser.urlencoded({
	limit: '50mb',
	extended: true
}))

// session及session持久化
app.use(session({
	secret: 'mall',
	resave: false,
	saveUninitialized: true,
	store: new mongoStore({
		url: dbUrl,
		collection: 'sessions'
	})
}))

app.listen(port)
app.locals.moment = require('moment')
app.use(serveStatic(path.join(__dirname, 'static')))

require('./router/routes')(app)

console.log('Server start on ' + port)