const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const bcrypt = require('bcrypt')
const SALT_WORK_FACTOR = 10

const userSchema = new Schema({
	name: {
		unique: true,
		type: String
	},
	password: String,
	avatar: {
		type: String,
		default: 'default.jpg'
	},

	// carts: [{
	// 	type: ObjectId,
	// 	ref: 'product',
	// 	checked: Boolean,
	// 	checkedNum: Number
	// }],	
	// orders: [{
	// 	type: ObjectId,
	// 	ref: 'product',
	// 	checked: Boolean,
	// 	checkedNum: Number
	// }],	

	cartList: [{
		productId: String,
		checked: Boolean,
		checkedNum: Number
	}],
	orderList: Array,
	addressList: Array,

	// 0: normal user
	// 1: letified user
	// 2: professional user
	// >10: admin 
	// >50: super admin
	role: {
		type: Number,
		default: 0
	},

	meta: {
		createAt: {
			type: Date,
			default: Date.now()
		},
		updateAt: {
			type: Date,
			default: Date.now()
		}
	}
})

userSchema.pre('save', function(next) {
	let user = this
	// console.log('user.js===user=' + user)
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now()
	} else {
		this.meta.updateAt = Date.now()
	}

	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if (err) {
			return next(err)
		}
		// console.log('user.js===salt=' + salt)

		bcrypt.hash(user.password, salt, function(err, hash) {
			if (err) {
				return next(err)
			}

			// console.log('user.js===hash=' + hash)
			user.password = hash
			next()
		})
	})

	// next()// 加上这个会不执行密码加密的操作
})

userSchema.methods = {
	comparePassword: function(_pwd, cb) {
		bcrypt.compare(_pwd, this.password, function(err, isMatch) {
			if (err) {
				return cb(err)
			}

			cb(null, isMatch)
		})
	}
}

userSchema.statics = {
	fetch: function(cb) {
		return this
			.find({})
			.sort('meta.updateAt')
			.exec(cb)
	},
	findById: function(id, cb) {
		return this
			.findOne({
				_id: id
			})
			.exec(cb)
	}
}

module.exports = userSchema