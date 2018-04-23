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
							<li v-for="item in cartList">
								<div class="cart-tab-1">
									<div class="cart-item-check">
										<a href="javascipt:;" class="checkbox-btn item-check-btn" v-bind:class="{'check':item.checked=='1'}" @click="editCart('checked',item)">
											<svg class="icon icon-ok">
												<use xlink:href="#icon-ok"></use>
											</svg>
										</a>
									</div>
									<div class="cart-item-pic">
										<img src="/static/img/1.jpg">
									</div>
									<div class="cart-item-title">
										<div class="item-name">XX</div>
									</div>
								</div>
								<div class="cart-tab-2">
									<div class="item-price">1000</div>
								</div>
								<div class="cart-tab-3">
									<div class="item-quantity">
										<div class="select-self select-self-open">
											<div class="select-self-area">
												<a class="input-sub">-</a>
												<span class="select-ipt">10</span>
												<a class="input-add">+</a>
											</div>
										</div>
									</div>
								</div>
								<div class="cart-tab-4">
									<div class="item-price-total">100</div>
								</div>
								<div class="cart-tab-5">
									<div class="cart-item-opration">
										<a href="javascript:;" class="item-edit-btn">
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

	<!-- <pop-modal v-bind:modalShow="modalShow" v-bind:formTitle="formTitle" v-on:close="closeModal">
		<div slot="formContent">
			<svg v-if="isStatusOK" class="icon-status-ok">
				<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
			</svg>		
			<span>{{formMsg}}</span>	
		</div>
		<div slot="formBtnGrop">
			<a href="javascript:;" v-if="!isStatusOK" class="btn btn--m" @click="closeModal">关闭</a>
			<a href="javascript:;" v-if="isStatusOK" class="btn btn--m" @click="closeModal">继续购物</a>
			<router-link v-if="isStatusOK" class="btn btn--m" to="/cart">查看购物车</router-link>
		</div>
	</pop-modal> -->

	<nav-footer></nav-footer>
</div>
</template>

<script>
	
	import NavHeader from '@/components/NavHeader'
	import NavFooter from '@/components/NavFooter'
	import NavBread from '@/components/NavBread'
	// import PopModal from '@/components/PopModal'

	import axios from 'axios'
	export default {
		name: 'Cart',
		data () {
			return {
				cartList: []
			}
		},
		mounted(){
			this.getCart()
		},
		components: {
			NavHeader,
			NavFooter,
			NavBread,
			// PopModal
		},
		methods: {
			getCart () {
				axios.get('/users/getcart').then((resp) => {
					let res = resp.data
					if (res.status == 1) {
						this.cartList = res.msg
					} else {
						this.cartList = []
					}
				}).catch((err) => {
					console.log(err)
				})
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
