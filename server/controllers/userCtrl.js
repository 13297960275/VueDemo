const User = require('../models/user')
const Product = require('../models/product')
const Util = require('../common/utils')
const fs = require('fs')
const path = require('path')

/*user module page*/

//  admin user list page
exports.getUsers = (req, res) => {
	User.fetch((err, users) => {
		if (err) {
			console.log(err)
		}

		res.render('user/userList', {
			title: 'user list',
			users: users
		})
	})
}

/* upload avatar */
exports.uploadAvatar = (req, res, next) => {
	//接收前台POST过来的base64
	let imgData = req.body.imgData
	//过滤data:URL
	let base64Data = imgData.replace(/^data:image\/\w+base64,/, '')
	let dataBuffer = new Buffer(base64Data, 'base64')
	let timeStamp = Date.now()
	let avatar = timeStamp + '.png'
	let newPath = path.join(__dirname, '../../', '/public/upload/avatar/' + avatar)
	// console.log(dataBuffer)
	fs.writeFile(newPath, dataBuffer, (err) => {
		if (err) {
			console.log(err)
		} else {
			res.json({
				success: 1,
				avatar: avatar
			})
		}
	})
}

// check user sign in
exports.checkLogin = (req, res) => {
	if (req.session.user) {
		return res.json({
			status: 1,
			result: req.session.user.name,
			msg: ''
		})
	} else {
		return res.json({
			status: 0,
			result: '',
			msg: '未登录，请登陆后重试'
		})
	}
}

// user sign up
exports.signUp = (req, res) => {
	let _user = {
		name: req.body.userName,
		password: req.body.userPwd
	}

	User.find({
		name: _user.name
	}, (err, user) => {
		if (err) {
			return res.json({
				status: 0,
				result: '',
				msg: '服务器错误，请稍后重试'
			})
		}

		if (user.length > 0) { // 已有账号
			return res.json({
				status: 0,
				result: user.name,
				msg: '用户名已存在'
			})
		} else {
			_user.addressList = [{
				userName: '小花',
				postCode: '10001',
				isDefault: true,
				streetName: '北京市朝阳区前门48号',
				userTel: '13568794568'
			}, {
				userName: '小红',
				postCode: '10001',
				isDefault: false,
				streetName: '北京市朝阳区前门48号',
				userTel: '13568794568'
			}, {
				userName: '小美',
				postCode: '10001',
				isDefault: false,
				streetName: '北京市朝阳区前门48号',
				userTel: '13568794568'
			}, {
				userName: '大龙',
				postCode: '10001',
				isDefault: false,
				streetName: '北京市朝阳区前门48号',
				userTel: '13568794568'
			}, {
				userName: '小虎',
				postCode: '10001',
				isDefault: false,
				streetName: '北京市朝阳区前门48号',
				userTel: '13568794568'
			}]
			userObj = new User(_user)
			userObj.save((err, user2) => {
				if (err) {
					return res.json({
						status: 0,
						result: '',
						msg: '服务器错误，请稍后重试'
					})
				} else {
					req.session.user = user2

					return res.json({
						status: 1,
						result: user2.name,
						msg: ''
					})
				}
			})
		}
	})
}

// user sign in
exports.signIn = (req, res) => {
	let _user = {
		name: req.body.userName,
		password: req.body.userPwd
	}

	// console.log(_user.name + '===' + _user.password)

	User.findOne({
		name: _user.name
	}, (err, user) => {
		if (err) {
			return res.json({
				status: 0,
				result: '',
				msg: '服务器错误，请稍后重试'
			})
		}

		if (!user) { // 没有账号
			return res.json({
				status: 0,
				result: _user.name,
				msg: '用户未注册'
			})
		} else {
			// console.log(user.password)
			// 密码比对
			user.comparePassword(_user.password, (err, isMatch) => {
				if (err) {
					return res.json({
						status: 0,
						result: '',
						msg: '服务器错误，请稍后重试'
					})
				}

				if (isMatch) { // 密码匹配
					// 将user信息通过session写到cookie
					// console.log('isMatch')
					req.session.user = user

					return res.json({
						status: 1,
						result: user.name,
						msg: ''
					})
				} else { // 密码不匹配
					// console.log('is not Match')
					res.json({
						status: 0,
						result: '',
						msg: '密码不正确'
					})
				}
			})
		}
	})
}

//  admin user sign out
exports.signOut = (req, res) => {
	delete req.session.user

	return res.json({
		status: 1,
		result: '',
		msg: ''
	})
}

// 获取用户购物车、地址、订单信息（type:'cart'/'address'/'order'
exports.getUserInfo = (req, res) => {
	let uId = req.session.user._id
	let type = req.query.type

	User.findById(uId, (err, user) => {
		if (err) {
			return res.json({
				status: 0,
				result: '',
				msg: '服务器错误，请稍后重试'
			})
		} else {
			let msg
			switch (type) {
				case 'cart':
					msg = user.cartList
					break;
				case 'address':
					msg = user.addressList
					break;
				case 'order':
					msg = user.orderList
					break;
				default:
					msg = []
					break;
			}
			return res.json({
				status: 1,
				result: msg,
				msg: ''
			})
		}
	})
}

// 从用户的购物车中删除商品
exports.removeCart = (req, res) => {
	let uId = req.session.user._id
	let pId = req.body.pId

	User.findById(uId, (err, user) => {
		if (err) {
			return res.json({
				status: 0,
				result: '',
				msg: '服务器错误，请稍后重试'
			})
		} else {
			if (user) {
				let index = user.cartList.findIndex(prod => prod.productId === pId)
				user.cartList.splice(index, 1)

				user.save((err, user2) => {
					if (err) {
						return res.json({
							status: 0,
							result: '',
							msg: '服务器错误，请稍后重试'
						})
					} else {
						return res.json({
							status: 1,
							result: user2.cartList,
							msg: '移除商品成功'
						})
					}
				})
			} else {
				return res.json({
					status: 0,
					result: '',
					msg: '用户不存在'
				})
			}
		}
	})
}

// 用户地址CUD
exports.CUDAddress = (req, res) => {
	let uId = req.session.user._id
	let params = req.body.params
	let type = req.body.type
	User.findById(uId, (err, _user) => {
		if (_user) {
			let msg = ''
			switch (type) {
				case 0:
					_user.addressList.forEach((item) => {
						if (item._id == params) {
							item.isDefault = true
						} else {
							item.isDefault = false
						}
					})
					msg = '设置默认地址'
					break;
				case 1:
					_user.addressList.push(params)
					msg = '添加地址'
					break;
				case -1:
					let index = _user.addressList.findIndex(prod => prod._id == params)
					_user.addressList.splice(index, 1)
					msg = '删除地址'
					break;
				default:
					// statements_def
					break;
			}
			_user.save((err, user2) => {
				if (err) {
					return res.json({
						status: 0,
						result: '',
						msg: msg + '失败，请稍后重试'
					})
				} else {
					return res.json({
						status: 1,
						result: user2.addressList,
						msg: msg + '成功'
					})
				}
			})
		} else {
			return res.json({
				status: 0,
				result: '',
				msg: '用户不存在'
			})
		}
	})
}

//编辑用户购物车
exports.editCart = (req, res) => {
	let uId = req.session.user._id
	let pId = req.body.pId
	let checkAll = req.body.checkAll
	console.log(checkAll)
	let checkedNum = req.body.checkedNum
	let checked = req.body.checked

	User.findById(uId, (err, _user) => {
		if (_user) {
			if (!checkedNum) {
				_user.cartList.forEach((item) => {
					item.checked = checkAll
				})
			} else {
				let index = _user.cartList.findIndex(prod => prod.productId === pId)
				_user.cartList[index].checkedNum = checkedNum
				_user.cartList[index].checked = checked
			}
			_user.save((err, user2) => {
				if (err) {
					return res.json({
						status: 0,
						result: '',
						msg: '编辑购物车失败，请稍后重试'
					})
				} else {
					return res.json({
						status: 1,
						result: user2.cartList,
						msg: '编辑购物车成功'
					})
				}
			})
		} else {
			return res.json({
				status: 0,
				msg: '用户不存在'
			})
		}
	})
}

// 创建订单
exports.makeOrder = (req, res) => {
	let uId = req.session.user._id

	User.findById(uId, (err, user) => {
		if (err) {
			return res.json({
				status: 0,
				result: '',
				msg: '服务器错误，请稍后重试'
			})
		} else {
			let goods = []
			user.cartList.filter((item) => {
				if (item.checked) {
					goods.push(item)
				}
			})

			let orderId = '1314' + parseInt(Math.random() * 90 + 10) + new Date().Format('yyyyMMddhhmmss')

			let order = {
				orderId: orderId,
				createDate: Date.now(),
				addrId: req.body.addrId,
				orderTotal: req.body.orderTotal,
				totalPrice: req.body.totalPrice,
				shipping: req.body.shipping,
				discount: req.body.discount,
				tax: req.body.tax,
				goods: goods
			}
			user.orderList.push(order)

			user.save((err, user2) => {
				if (err) {
					return res.json({
						status: 0,
						result: '',
						msg: '创建订单失败，请稍后重试'
					})
				} else {
					return res.json({
						status: 1,
						result: orderId,
						msg: '创建订单成功'
					})
				}
			})
		}
	})
}

// 获取订单
exports.getOrder = (req, res) => {
	let uId = req.session.user._id
	let orderId = req.query.orderId

	User.findById(uId, (err, _user) => {
		if (_user) {
			let orderTotal = 0
			_user.orderList.filter((item) => {
				if (item.orderId == orderId) {
					orderTotal = item.orderTotal
				}
			})
			return res.json({
				status: 1,
				result: {
					orderId: orderId,
					orderTotal: orderTotal
				},
				msg: '获取订单成功'
			})
		} else {
			return res.json({
				status: 0,
				msg: '用户不存在'
			})
		}
	})
}


//  admin delete user fun
exports.delUserFun = (req, res) => {
	let id = req.query.id
	// console.log(id)
	if (id) {
		User.remove({
			_id: id
		}, (err, user) => {
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

// permission control middleware

// 登录验证
exports.userSignInRequired = (req, res, next) => {
	let user = req.session.user
	if (!user) {
		// 用户未登录
		// console.log('userSignInRequired session.user === ' + JSON.stringify(req.session.user))
		return res.json({
			status: 1001,
			msg: '未登录，请登陆后重试',
			result: ''
		})
	} else {
		next()
	}
}

// 管理员角色验证
exports.userAdminRequired = (req, res, next) => {
	let user = req.session.user
	if (user.role <= 10) {
		// 普通用户
		// console.log('userAdminRequired session.user === ' + JSON.stringify(req.session.user))
		return res.json({
			status: 1002,
			msg: '非管理员账号，拒绝访问',
			result: ''
		})
	} else {
		next()
	}
}