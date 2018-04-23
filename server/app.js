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
mongoose.connection.on('connected', () => {
	console.log('Mongoose connection open to ' + dbUrl)
})
// 连接异常
mongoose.connection.on('error', (err) => {
	console.log('Mongoose connection error: ' + err)
})
// 连接断开
mongoose.connection.on('disconnected', () => {
	console.log('Mongoose connection disconnected')
})

// 视图路径及解析模板
app.set('views', path.join(__dirname, 'views'))
app.engine('.html', ejs.__express)
app.set('view engine', 'html')

// uncomment after placing your favicon
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

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
// app.use((req, res, next) => {
//   next(createError(404));
// });

// // error handler
// app.use((err, req, res, next) => {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

require('./router/routes')(app)

console.log('Server start on ' + port)

// 捕获到异常后关闭服务
process.on('uncaughtException', (err) => {
	//打印出错误
	console.log(err)
	//打印出错误的调用栈方便调试
	console.log(err.stack)

	console.log('\ncaught exception at: \n' + new Date() + '\n')
	try {
		let killTimer = setTimeout(() => {
			console.log('\nprocess exit at: \n' + new Date() + '\n')
			process.exit(1)

		}, 8000)
		killTimer.unref()

	} catch (e) {
		console.log('error when exit', e.stack)
	}
})

// 调用一个不存在的函数，应用会抛出未捕获的异常。
// nonexistentFunc()
// console.log('这里不会运行。')