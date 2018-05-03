const Product = require('../models/product')
const User = require('../models/user')
const _ = require('underscore')
const fs = require('fs')
const path = require('path')

function serProducts() {
	let products = [{
		"productName": "华为P20 pro",
		"productPrice": "4399",
		"productImg": "1.jpg"
	}, {
		"productName": "华为P20",
		"productPrice": "3799",
		"productImg": "2.jpg"
	}, {
		"productName": "小米1",
		"productPrice": "1599",
		"productImg": "3.jpg"
	}, {
		"productName": "小米2",
		"productPrice": "999",
		"productImg": "4.jpg"
	}, {
		"productName": "小米3",
		"productPrice": "599",
		"productImg": "5.jpg"
	}, {
		"productName": "小米4",
		"productPrice": "399",
		"productImg": "6.jpg"
	}, {
		"productName": "小米5",
		"productPrice": "3999",
		"productImg": "7.jpg"
	}, {
		"productName": "小米MIX",
		"productPrice": "6999",
		"productImg": "8.jpg"
	}, {
		"productName": "华为pro",
		"productPrice": "4309",
		"productImg": "9.jpg"
	}, {
		"productName": "华20",
		"productPrice": "3799",
		"productImg": "10.jpg"
	}, {
		"productName": "小米笔记本",
		"productPrice": "4055",
		"productImg": "11.jpg"
	}, {
		"productName": "小米MIX2",
		"productPrice": "3399",
		"productImg": "12.jpg"
	}, {
		"productName": "小米6",
		"productPrice": "2199",
		"productImg": "13.jpg"
	}, {
		"productName": "小米7",
		"productPrice": "1479",
		"productImg": "14.jpg"
	}, {
		"productName": "小米8",
		"productPrice": "2319",
		"productImg": "15.jpg"
	}, {
		"productName": "小米9",
		"productPrice": "2699",
		"productImg": "16.jpg"
	}, {
		"productName": "小米10",
		"productPrice": "199",
		"productImg": "mi6.jpg"
	}, {
		"productName": "小米笔记本",
		"productPrice": "3999",
		"productImg": "note.jpg"
	}, {
		"productName": "平衡",
		"productPrice": "99",
		"productImg": "pingheng.jpg"
	}, {
		"productName": "华为",
		"productPrice": "4399",
		"productImg": "zipai.jpg"
	}, {
		"productName": "P20",
		"productPrice": "3799",
		"productImg": "photo.jpg"
	}]

	for (let i = 0; i < products.length; i++) {
		_product = new Product(products[i])
		_product.save((err, user) => {
			if (err) {
				console.log(err)
			} else {
				console.log(i)
			}
		})
	}
}
// serProducts()

// 获取商品信息
exports.getProducts = (req, res) => {
	Product.fetch((err, products) => {
		if (err) {
			res.json({
				status: 0,
				result: '',
				msg: '服务器错误，请稍后重试'
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

// 带条件查询商品信息
exports.getProductsByPage = (req, res) => {
	let page = parseInt(req.query.page)
	let pageSize = parseInt(req.query.pageSize)
	let sort = req.query.sort

	let params
	if (req.query.lt !== 'All') {
		params = {
			productPrice: {
				$lte: parseInt(req.query.gt),
				$gt: parseInt(req.query.lt)
			}
		}
	} else {
		params = {}
	}

	let skip = pageSize * (page - 1)
	// console.log(JSON.stringify(params) + '===' + page + '===' + pageSize + '=====' + sort + '===' + skip)
	let productModal = Product.find(params).skip(skip).limit(pageSize)
	productModal.sort({
		'productPrice': sort
	})
	productModal.exec((err, products) => {
		if (err) {
			res.json({
				status: 0,
				result: '',
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

// 添加商品到购物车
exports.add2Cart = (req, res) => {
	let uId = req.session.user._id
	let pId = req.body.prodId
	let pNum = 1
	// let pNum = parseInt(req.body.prodNum)

	User.findById(uId, (err, user) => {
		if (err) {
			return res.json({
				status: 0,
				result: '',
				msg: '服务器错误，请稍后重试'
			})
		} else {
			if (user) {
				Product.findById(pId, (err, product) => {
					if (err) {
						return res.json({
							status: 0,
							result: '',
							msg: '该商品已下架，请稍后重试'
						})
					} else {
						let hasProd = user.cartList.some((item) => {
							return item.productId === pId
						}) // 判断购物车中是否已存在当前商品
						if (!hasProd) {
							let prod = {
								productId: pId,
								checked: true,
								checkedNum: pNum
							}
							user.cartList.push(prod)
						} else {
							let index = user.cartList.findIndex(prod => prod.productId === pId)
							user.cartList[index].checkedNum += pNum
						}
						// console.log('user2')

						// 保存
						user.save((err, user) => {
							if (err) {
								return res.json({
									status: 0,
									result: '',
									msg: '服务器错误，请稍后重试'
								})
							} else {
								return res.json({
									status: 1,
									result: user.cartList,
									msg: ''
								})
							}
						})
					}
				})
			}
		}
	})
}

//  admin add product page
exports.addproduct = (req, res) => {
	Category.find({}, (err, categories) => {
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
exports.editproductFun = (req, res) => {
	let id = req.params.id

	if (id) {
		product.findById(id, (err, product) => {

			res.render('product/detail', {
				title: 'product update',
				product: product
			})
		})
	}
}

/* upload poster */
exports.uploadPoster = (req, res, next) => {
	// console.log(req.body, req.files)
	// console.log(req.files)
	// return
	let posterData = req.files.uploadPoster
	let filePath = posterData.path
	let originalFilename = posterData.originalFilename
	// console.log(req.files)
	// console.log(posterData, filePath, originalFilename)
	if (originalFilename) {
		fs.readFile(filePath, (err, data) => {
			let timeStamp = Date.now()
			let type = posterData.type.split('/')[1]
			let poster = timeStamp + '.' + type
			let newPath = path.join(__dirname, '../../', '/public/upload/poster/' + poster)
			// console.log(newPath)

			fs.writeFile(newPath, data, (err) => {
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
exports.addproductFun = (req, res) => {
	let id = req.body.product._id
	let productObj = req.body.product
	let _product
	// console.log(productObj)
	// console.log(id)

	// console.log(req.poster)

	if (id) { // 有product id则编辑，没有则新增
		// console.log("1")

		product.findById(id, (err, product) => {
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
			_product.save((err, product) => {
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
		_product.save((err, product) => {
			if (err) {
				console.log(err)
			}
			// console.log(product)

			if (categoryId) {
				Category.findById(categoryId, (err, category) => {

					category.products.push(product._id)
					category.save((err, category) => {
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
				category.save((err, category) => {
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
exports.delproductFun = (req, res) => {
	let id = req.query.id
	// console.log(id)
	if (id) {
		product.remove({
			_id: id
		}, (err, product) => {
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