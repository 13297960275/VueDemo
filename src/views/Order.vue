<template>
	<div>
		<nav-header></nav-header>

		<nav-bread>
			<span>Order Confirm</span>
		</nav-bread>

		<div class="container">
			<div class="checkout-order">
				<div class="page-title-normal">
					<h2 class="page-title-h2"><span>check out</span></h2>
				</div>
				<!-- process step -->
				<div class="check-step">
					<ul>
						<li class="cur"><span>Confirm</span> address</li>
						<li class="cur"><span>View your</span> order</li>
						<li><span>Make</span> payment</li>
						<li><span>Order</span> confirmation</li>
					</ul>
				</div>

				<!-- order list -->
				<div class="page-title-normal checkout-title">
					<h2><span>Order content</span></h2>
				</div>
				<div class="item-list-wrap confirm-item-list-wrap">
					<div class="cart-item order-item">
						<div class="cart-item-head">
							<ul>
								<li>Order contents</li>
								<li>Price</li>
								<li>Quantity</li>
								<li>Subtotal</li>
							</ul>
						</div>

						<ul class="cart-item-list">
							<li v-for="item in cartList" :key="item.productId" v-if="item.checked" v-bind:id="item.productId">
								<div class="cart-tab-1">
									<div class="cart-item-check">
										<a href="javascipt:;" class="checkbox-btn item-check-btn" v-bind:class="{'check':item.checked}">
											<svg class="icon icon-ok">
												<use xlink:href="#icon-ok"></use>
											</svg>
										</a>
									</div>
									<div class="cart-item-pic">
										<img v-bind:src="'/static/img/products/'+item.product.productImg">
									</div>
									<div class="cart-item-title">
										<div class="item-name">{{item.product.productName}}</div>
									</div>
								</div>
								<div class="cart-tab-2">
									<div class="item-price">{{item.product.productPrice}}</div>
								</div>
								<div class="cart-tab-3">
									<div class="item-quantity">
										<div class="select-self select-self-open">
											<div class="select-self-area">
												<span class="select-ipt">{{item.checkedNum}}</span>
											</div>
										</div>
									</div>
								</div>
								<div class="cart-tab-4">
									<div class="item-price-total">{{item.product.productPrice * item.checkedNum}}</div>
								</div>
							</li>
						</ul>
					</div>
				</div>

				<!-- Price count -->
				<div class="price-count-wrap">
					<div class="price-count">
						<ul>
							<li>
								<span>Item subtotal:</span>
								<span>{{totalPrice | currency('￥')}}</span>
							</li>
							<li>
								<span>Shipping:</span>
								<span>{{shipping | currency('￥')}}</span>
							</li>
							<li>
								<span>Discount:</span>
								<span>{{discount | currency('￥')}}</span>
							</li>
							<li>
								<span>Tax:</span>
								<span>{{tax | currency('￥')}}</span>
							</li>
							<li class="order-total-price">
								<span>Order total:</span>
								<span>{{orderTotal | currency('￥')}}</span>
							</li>
						</ul>
					</div>
				</div>

				<div class="order-foot-wrap">
					<div class="prev-btn-wrap">
						<router-link class="btn btn--m" to="address">Previous</router-link>
					</div>
					<div class="next-btn-wrap">
						<button class="btn btn--m btn--red" @click="makeOrder">Proceed to payment</button>
					</div>
				</div>
			</div>
		</div>

		<nav-footer></nav-footer>
	</div>
</template>

<script>
	import NavHeader from '@/components/NavHeader'
	import NavFooter from '@/components/NavFooter'
	import NavBread from '@/components/NavBread'
	import PopModal from '@/components/PopModal'

	import axios from 'axios'
	export default {
		name: 'Order',
		data () {
			return {
				cartList: [],
				shipping: 30, // 运费
				discount: 300, // 折扣
				tax: 300 // 缴税
			}
		},
		components: {
			NavHeader,
			NavFooter,
			NavBread,
			PopModal
		},
		computed: {
			totalPrice () { // 商品总费用
				let money = 0
				this.cartList.forEach((item) => {
					if (item.checked) money += item.product.productPrice * item.checkedNum
				})
				return money
			},
			orderTotal () { // 订单总费用
				return this.totalPrice + this.shipping - this.discount + this.tax
			}
		},
		mounted () {
			this.getCart()
		},
		methods: {
			getCart () {
				axios.get('/users/userinfo?type=cart').then((resp) => {
					let res = resp.data
					if (res.status === 1) {
						axios.get('/goods/getproducts').then((result) => {
							if (result.data.status === 1) {
								let prods = result.data.result.list
								for (let j = 0; j < res.result.length; j++) {
									for (let i = 0; i < prods.length; i++) {
										if (prods[i]._id === res.result[j].productId) {
											res.result[j].product = prods[i]
										}
									}
								}
								this.cartList = res.result
							} else {
								this.cartList = []
							}
						})
					} else {
						this.cartList = []
					}
				}).catch((err) => {
					console.log(err)
				})
			},
			makeOrder () {
				axios.post('/users/makeorder', {
					totalPrice: this.totalPrice,
					// cartList: this.cartList,
					addrId: this.$route.query.addressId,
					shipping: this.shipping,
					discount: this.discount,
					tax: this.tax,
					orderTotal: this.orderTotal
				}).then((resp) => {
					let res = resp.data
					if (res.status === 1) {
						console.log(res.msg)
						this.$router.push({
							path: '/ordersuccess?orderId=' + res.result
						})
					} else {
						console.log(res.msg)
					}
				})
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
