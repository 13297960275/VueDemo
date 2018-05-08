const indexCtrl = require('../controllers/indexCtrl')
const productCtrl = require('../controllers/productCtrl')
const userCtrl = require('../controllers/userCtrl')

const multiparty = require('connect-multiparty')
const multipart = multiparty()

const _ = require('underscore')

module.exports = (app) => {

	// pre handler user
	app.use((req, res, next) => {
		// console.log('pre session===' + JSON.stringify(req.session.user))

		let _user = req.session.user
		if (_user) {
			app.locals.user = _user
		}
		return next()
	})

	// 获取商品信息
	app.get('/goods/getproducts', productCtrl.getProducts)

	// 带查询条件（跟爷、排序、金额过滤等）获取商品信息
	app.get('/goods/getproductsbypage', productCtrl.getProductsByPage)

	// 添加商品到购物车
	app.post('/goods/add2cart', userCtrl.userSignInRequired, productCtrl.add2Cart)

	// 查询用户购物车数据、地址、订单
	app.get('/users/userinfo/', userCtrl.userSignInRequired, userCtrl.getUserInfo)

	// 移除用户购物车数据
	app.post('/users/removecart', userCtrl.userSignInRequired, userCtrl.removeCart)

	// 编辑用户购物车
	app.post('/users/editcart', userCtrl.userSignInRequired, userCtrl.editCart)

	// 编辑用户购物车
	app.post('/users/cudaddress', userCtrl.userSignInRequired, userCtrl.CUDAddress)

	// 创建订单
	app.post('/users/makeorder', userCtrl.userSignInRequired, userCtrl.makeOrder)
	
	// 获取订单
	app.get('/users/getorder', userCtrl.userSignInRequired, userCtrl.getOrder)

	// 用户登录
	app.post('/users/signin', userCtrl.signIn)

	// 检查用户是否登录
	app.get('/users/checklogin', userCtrl.checkLogin)

	// 用户注册
	app.post('/users/signup', userCtrl.signUp)

	// 用户登出
	app.get('/users/signout', (req, res) => {
		delete app.locals.user;
		userCtrl.signOut(req, res);
	})

}