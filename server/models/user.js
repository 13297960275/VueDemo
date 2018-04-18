const mongoose = require('mongoose')
const userSchema = require('../schemas/userService')
const user = mongoose.model('user',userSchema)

module.exports = user