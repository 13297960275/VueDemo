const Product = require('../models/product')
const _ = require('underscore')
const fs = require('fs')
const path = require('path')

function serProducts () {
	let products = [
		{
			"productId": "10001",
			"productName": "小米6",
			"prodcutPrice": "2499",
			"prodcutImg": "mi6.jpg"
		}, {
			"productId": "10002",
			"productName": "小米笔记本",
			"prodcutPrice": "3999",
			"prodcutImg": "note.jpg"
		}, {
			"productId": "10003",
			"productName": "小米MIX2S",
			"prodcutPrice": "2799",
			"prodcutImg": "mi6.jpg"
		}, {
			"productId": "10004",
			"productName": "华为P20 pro",
			"prodcutPrice": "4399",
			"prodcutImg": "1.jpg"
		}, {
			"productId": "10005",
			"productName": "华为P20",
			"prodcutPrice": "3799",
			"prodcutImg": "2.jpg"
		}, {
			"productId": "10006",
			"productName": "小米6",
			"prodcutPrice": "1599",
			"prodcutImg": "3.jpg"
		}, {
			"productId": "10007",
			"productName": "小米6",
			"prodcutPrice": "999",
			"prodcutImg": "4.jpg"
		}, {
			"productId": "10008",
			"productName": "小米6",
			"prodcutPrice": "599",
			"prodcutImg": "5.jpg"
		}, {
			"productId": "10001",
			"productName": "小米6",
			"prodcutPrice": "399",
			"prodcutImg": "mi6.jpg"
		}, {
			"productId": "10002",
			"productName": "小米笔记本",
			"prodcutPrice": "3999",
			"prodcutImg": "note.jpg"
		}, {
			"productId": "10003",
			"productName": "小米MIX2S",
			"prodcutPrice": "6999",
			"prodcutImg": "mi6.jpg"
		}, {
			"productId": "10004",
			"productName": "华为P20 pro",
			"prodcutPrice": "4399",
			"prodcutImg": "1.jpg"
		}, {
			"productId": "10005",
			"productName": "华为P20",
			"prodcutPrice": "3799",
			"prodcutImg": "2.jpg"
		}, {
			"productId": "10006",
			"productName": "小米6",
			"prodcutPrice": "2199",
			"prodcutImg": "3.jpg"
		}, {
			"productId": "10007",
			"productName": "小米6",
			"prodcutPrice": "1799",
			"prodcutImg": "4.jpg"
		}, {
			"productId": "10008",
			"productName": "小米6",
			"prodcutPrice": "2799",
			"prodcutImg": "5.jpg"
		}, {
			"productId": "10001",
			"productName": "小米6",
			"prodcutPrice": "2699",
			"prodcutImg": "mi6.jpg"
		}, {
			"productId": "10002",
			"productName": "小米笔记本",
			"prodcutPrice": "4055",
			"prodcutImg": "note.jpg"
		}, {
			"productId": "10003",
			"productName": "小米MIX2S",
			"prodcutPrice": "4399",
			"prodcutImg": "mi6.jpg"
		}, {
			"productId": "10004",
			"productName": "华为P20 pro",
			"prodcutPrice": "4399",
			"prodcutImg": "1.jpg"
		}, {
			"productId": "10005",
			"productName": "华为P20",
			"prodcutPrice": "3799",
			"prodcutImg": "2.jpg"
		}, {
			"productId": "10006",
			"productName": "小米6",
			"prodcutPrice": "6999",
			"prodcutImg": "3.jpg"
		}, {
			"productId": "10007",
			"productName": "小米6",
			"prodcutPrice": "5999",
			"prodcutImg": "4.jpg"
		}, {
			"productId": "10008",
			"productName": "小米6",
			"prodcutPrice": "299",
			"prodcutImg": "5.jpg"
		}
	]

	for (let i = 0; i < products.length; i++) {
		_product = new Product(products[i])
		_product.save(function(err, user) {
			if (err) {
				console.log(err)
			} else {
				console.log(i)
			}
		})
	}
}
serProducts()

exports.getProducts = function(req, res) {
	Product.fetch(function(err, products) {
		if (err) {
			res.json({
				status: 0,
				msg: err.message
			})
		} else {
			res.json({
				status: 1,
				msg: '',
				result: {
					count: products.length,
					list: products
				}
			})
		}
	})
}

exports.getProductsByPage = function(req, res) {
	let page = parseInt(req.query.page)
	let pageSize = parseInt(req.query.pageSize)
	let sort = req.query.sort

	let params
	if (req.query.lt !== 'All') {
		params = {
			prodcutPrice:{
				$lte: parseInt(req.query.gt),
				$gt: parseInt(req.query.lt)
			}
		}
	} else {
		params = {}
	}

	let skip = pageSize * (page - 1)
	console.log(JSON.stringify(params) + '===' + page + '===' + pageSize + '====' + sort + '===' + skip)
	let productModal = Product.find(params).skip(skip).limit(pageSize)
	productModal.sort({
		'prodcutPrice': sort
	})
	productModal.exec(function(err, products) {
		if (err) {
			res.json({
				status: 0,
				msg: err.message
			})
		} else {
			res.json({
				status: 1,
				msg: '',
				result: {
					count: products.length,
					list: products
				}
			})
		}
	})
}


//  admin add product page
exports.addproduct = function(req, res) {
	Category.find({}, function(err, categories) {
		res.render('product/product', {
			title: 'admin product',
			categories: categories,
			product: {
				title: '',
				doctor: '',
				country: '',
				language: '',
				poster: '',
				flash: '',
				year: '',
				summary: ''
			}
		})
	})
}

/*product module fun*/

//  admin update product func
exports.editproductFun = function(req, res) {
	let id = req.params.id

	if (id) {
		product.findById(id, function(err, product) {

			res.render('product/detail', {
				title: 'product update',
				product: product
			})
		})
	}
}

/* upload poster */
exports.uploadPoster = function(req, res, next) {
	// console.log(req.body, req.files)
	// console.log(req.files)
	// return
	let posterData = req.files.uploadPoster
	let filePath = posterData.path
	let originalFilename = posterData.originalFilename
	// console.log(req.files)
	// console.log(posterData, filePath, originalFilename)
	if (originalFilename) {
		fs.readFile(filePath, function(err, data) {
			let timeStamp = Date.now()
			let type = posterData.type.split('/')[1]
			let poster = timeStamp + '.' + type
			let newPath = path.join(__dirname, '../../', '/public/upload/poster/' + poster)
			// console.log(newPath)

			fs.writeFile(newPath, data, function(err) {
				// console.log('data:' + data)
				req.poster = poster
				next()
			})
		})
	} else {
		next()
	}
}

// admin add product fun
exports.addproductFun = function(req, res) {
	let id = req.body.product._id
	let productObj = req.body.product
	let _product
	// console.log(productObj)
	// console.log(id)

	// console.log(req.poster)

	if (id) { // 有product id则编辑，没有则新增
		// console.log("1")

		product.findById(id, function(err, product) {
			if (err) {
				console.log(err)
			}

			if (req.poster) { // 编辑海报，删除旧的海报
				productObj.poster = req.poster
				let newPath = path.join(__dirname, '../../', '/public/upload/poster/' + product.poster)
				fs.unlinkSync(newPath)
			}

			_product = _.extend(product, productObj)
			// console.log(_product)
			_product.save(function(err, product) {
				if (err) {
					console.log(err)
				}

				res.redirect('/product/' + product._id)
			})
		})
	} else {
		// console.log("2")
		_product = new product(productObj)

		let categoryId = productObj.category
		let categoryName = productObj.categoryName
		let categoryIntro = productObj.categoryIntro

		// console.log(_product)
		_product.save(function(err, product) {
			if (err) {
				console.log(err)
			}
			// console.log(product)

			if (categoryId) {
				Category.findById(categoryId, function(err, category) {

					category.products.push(product._id)
					category.save(function(err, category) {
						// if (err) {
						// 	console.log(err)
						// }
						res.redirect('/product/' + product._id)
						// res.redirect('/admin/product')
					})
				})
			} else {
				let category = new Category({
					name: categoryName,
					intro: categoryIntro,
					products: product._id
				})
				// console.log(category)
				category.save(function(err, category) {
					// if (err) {
					// 	console.log(err)
					// }
					res.redirect('/product/' + product._id)
					// res.redirect('/admin/product')
				})
			}
		})
	}
}

//  admin delete product fun
exports.delproductFun = function(req, res) {
	let id = req.query.id
	// console.log(id)
	if (id) {
		product.remove({
			_id: id
		}, function(err, product) {
			if (err) {
				console.log(err)
			} else {
				res.json({
					success: 1
				})
			}
		})
	}
}