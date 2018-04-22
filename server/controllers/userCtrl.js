const User = require('../models/user')
const fs = require('fs')
const path = require('path')

/*user module page*/

//  admin user list page
exports.getUsers = function(req, res) {
	User.fetch(function(err, users) {
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
exports.uploadAvatar = function(req, res, next) {
	//接收前台POST过来的base64
	let imgData = req.body.imgData
	//过滤data:URL
	let base64Data = imgData.replace(/^data:image\/\w+base64,/, '')
	let dataBuffer = new Buffer(base64Data, 'base64')
	let timeStamp = Date.now()
	let avatar = timeStamp + '.png'
	let newPath = path.join(__dirname, '../../', '/public/upload/avatar/' + avatar)
	// console.log(dataBuffer)
	fs.writeFile(newPath, dataBuffer, function(err) {
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
exports.checkLogin = function(req, res) {
	if (req.session.user) {
		return res.json({
			status: 1,
			result: req.session.user.name
		})
	} else {
		return res.json({
			status: 0,
			msg: '未登录，请登陆后重试'
		})
	}
}

// user sign up
exports.signUp = function(req, res) {
	let _user = {
		name: req.body.userName,
		password: req.body.userPwd
	}

	User.find({
		name: _user.name
	}, function(err, user) {
		if (err) {
			return res.json({
				status: 0,
				msg: '服务器错误，请稍后重试'
			})
		}

		if (user.length > 0) { // 已有账号
			return res.json({
				status: 0,
				msg: '用户名已存在'
			})
		} else {
			user = new User(_user)
			user.save(function(err, user) {
				if (err) {
					return res.json({
						status: 0,
						msg: '服务器错误，请稍后重试'
					})
				} else {
					req.session.user = user

					return res.json({
						status: 1,
						msg: ''
					})
				}
			})
		}
	})
}

// user sign in
exports.signIn = function(req, res) {
	let _user = {
		name: req.body.userName,
		password: req.body.userPwd
	}

	User.findOne({
		name: _user.name
	}, function(err, user) {
		if (err) {
			return res.json({
				status: 0,
				msg: '服务器错误，请稍后重试'
			})
		}

		if (!user) { // 没有账号
			return res.json({
				status: 0,
				msg: '用户名不存在'
			})
		}

		// 密码比对
		user.comparePassword(_user.password, function(err, isMatch) {
			if (err) {
				return res.json({
					status: 0,
					msg: '服务器错误，请稍后重试'
				})
			}

			if (isMatch) { // 密码匹配
				// 将user信息通过session写到cookie
				req.session.user = user

				return res.json({
					status: 1,
					msg: ''
				})
			} else { // 密码不匹配
				res.json({
					status: 0,
					msg: '密码不正确'
				})
			}
		})
	})
}

//  admin user sign out
exports.signOut = function(req, res) {
	delete req.session.user

	return res.json({
		status: 1,
		msg: ''
	})
}

//  admin delete user fun
exports.delUserFun = function(req, res) {
	let id = req.query.id
	// console.log(id)
	if (id) {
		User.remove({
			_id: id
		}, function(err, user) {
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
exports.userSignInRequired = function(req, res, next) {
	let user = req.session.user
	if (!user) {
		// 用户未登录
		// console.log('userSignInRequired session.user == ' + JSON.stringify(req.session.user))
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
exports.userAdminRequired = function(req, res, next) {
	let user = req.session.user
	if (user.role <= 10) {
		// 普通用户
		// console.log('userAdminRequired session.user == ' + JSON.stringify(req.session.user))
		return res.json({
			status: 1002,
			msg: '非管理员账号，拒绝访问',
			result: ''
		})
	} else {
		next()
	}
}