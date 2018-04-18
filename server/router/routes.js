const indexCtrl = require('../controllers/indexCtrl')
const productCtrl = require('../controllers/productCtrl')
const userCtrl = require('../controllers/userCtrl')

const multiparty = require('connect-multiparty')
const multipart = multiparty()

const _ = require('underscore')

module.exports = function(app) {

	// pre handler user
	// app.use(function(req, res, next) {
	// 	// console.log('pre req.path==' + req.path)
	// 	// console.log('pre req.ip==' + req.ip)
	// 	logCtrl.saveLogFun(req, res)

	// 	// console.log('pre session==' + JSON.stringify(req.session.user))

	// 	let _user = req.session.user
	// 	if (_user) {
	// 		app.locals.user = _user
	// 	}
	// 	return next()
	// })

	//  index page
	app.get('/getproducts', productCtrl.getProducts)

	app.get('/getproductsbypage', productCtrl.getProductsByPage)

}