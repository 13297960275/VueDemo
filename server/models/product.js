const mongoose = require('mongoose')
const productSchema = require('../schemas/productService')
const product = mongoose.model('product',productSchema)

module.exports = product