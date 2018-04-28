<template>
	<div>
		<nav-header></nav-header>

		<nav-bread>
			<span>Cart</span>
			<!-- <span name="bread">测试插槽</span> -->
		</nav-bread>

		<div class="container">
			<div class="cart">
				<div class="page-title-normal">
					<h2 class="page-title-h2"><span>My Cart</span></h2>
				</div>
				<div class="item-list-wrap">
					<div class="cart-item">
						<div class="cart-item-head">
							<ul>
								<li>Items</li>
								<li>Price</li>
								<li>Quantity</li>
								<li>Subtotal</li>
								<li>Edit</li>
							</ul>
						</div>
						<ul class="cart-item-list">
							<li v-for="item in cartList" v-bind:id="item.productId">
								<div class="cart-tab-1">
									<div class="cart-item-check">
										<a href="javascipt:;" class="checkbox-btn item-check-btn" v-bind:class="{'check':item.checked}" @click="editProd(0,item)">
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
												<a class="input-sub" @click="editProd(-1,item)">-</a>
												<span class="select-ipt">{{item.checkedNum}}</span>
												<a class="input-add" @click="editProd(1,item)">+</a>
											</div>
										</div>
									</div>
								</div>
								<div class="cart-tab-4">
									<div class="item-price-total">{{item.product.productPrice * item.checkedNum}}</div>
								</div>
								<div class="cart-tab-5">
									<div class="cart-item-opration">
										<a href="javascript:;" @click="openModal(item.productId)" class="item-edit-btn">
											<svg class="icon icon-del">
												<use xlink:href="#icon-del"></use>
											</svg>
										</a>
									</div>
								</div>
							</li>
						</ul>
					</div>
				</div>
				<div class="cart-foot-wrap">
					<div class="cart-foot-inner">
						<div class="cart-foot-l">
							<div class="item-all-check">
								<a href="javascipt:;">
									<span class="checkbox-btn item-check-btn">
										<svg class="icon icon-ok"><use xlink:href="#icon-ok"/></svg>
									</span>
									<span>Select all</span>
								</a>
							</div>
						</div>
						<div class="cart-foot-r">
							<div class="item-total">
								Item total: <span class="total-price">500</span>
							</div>
							<div class="btn-wrap">
								<a class="btn btn--red">Checkout</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<pop-modal v-bind:modalShow="modalShow" v-bind:formTitle="formTitle" v-on:close="closeModal">
			<div slot="formContent">
				<svg v-if="isStatusOK" class="icon-status-ok">
					<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
				</svg>
				<span>{{formMsg}}</span>
			</div>
			<div slot="formBtnGrop">
				<a href="javascript:;" v-if="ensureRemove" class="btn btn--m" @click="removeProd">确认</a>
				<a href="javascript:;" class="btn btn--m" @click="closeModal">关闭</a>
			</div>
		</pop-modal>

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
		name: 'Cart',
		data () {
			return {
				cartList: [],
				modalShow: false, // 模态框是否显示
				formTitle: '', // 模态框标题
				formMsg: '', // 模态框提示内容
				removeProdId: '', // 要移除的商品id
				isStatusOK: false, // 是否操作成功
				ensureRemove: true // 确认键是否显示
			}
		},
		mounted () {
			this.getCart()
		},
		components: {
			NavHeader,
			NavFooter,
			NavBread,
			PopModal
		},
		methods: {
			getCart () {
				axios.get('/users/getcart').then((resp) => {
					let res = resp.data
					if (res.status === 1) {
						axios.get('/goods/getproducts').then((result) => {
							if (result.data.status === 1) {
								let prods = result.data.result.list
								for (let j = 0; j < res.msg.length; j++) {
									for (let i = 0; i < prods.length; i++) {
										if (prods[i]._id === res.msg[j].productId) {
											res.msg[j].product = prods[i]
										}
									}
								}
								this.cartList = res.msg
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
			openModal (pId) {
				this.modalShow = true
				this.formTitle = '警告'
				this.formMsg = '确认从购物车移除该商品'
				this.removeProdId = pId
				this.ensureRemove = true
			},
			closeModal () {
				this.modalShow = false
			},
			removeProd () {
				axios.post('/users/removecart', {
					params: {
						pId: this.removeProdId
					}
				}).then((resp) => {
					let res = resp.data
					console.log(res)
					if (res.status === 1) {
						console.log('true')
						this.modalShow = true
						this.formTitle = '成功'
						this.formMsg = '从购物车移除商品成功'
						this.isStatusOK = true
						this.ensureRemove = false
						this.getCart()
					} else {
						console.log('false')
						this.modalShow = true
						this.formTitle = '失败'
						this.formMsg = '从购物车移除商品失败'
						this.ensureRemove = false
					}
				}).catch((err) => {
					console.log(err)
					this.modalShow = true
					this.formTitle = '失败'
					this.formMsg = '从购物车移除商品失败'
					this.ensureRemove = false
				})
			},
			editProd (num, prod) {
				if (num === 0) {
					prod.checked = !prod.checked
				}
				if (num < 0 && prod.checkedNum <= 1) {
					this.openModal(prod.productId)
				} else {
					prod.checkedNum += num
				}
				axios.post('/users/editcart', {
					params: {
						pId: prod.productId,
						checkedNum: prod.checkedNum,
						checked: prod.checked
					}
				}).then((resp) => {
					let res = resp.data
					if (res.status === 1) {
					} else {
					}
				}).catch((err) => {
					console.log(err)
				})
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
