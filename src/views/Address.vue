<template>
	<div>
		<nav-header></nav-header>

		<nav-bread>
			<span>Address</span>
		</nav-bread>

		<div class="container">
			<div class="checkout-addr">
				<div class="page-title-normal">
					<h2 class="page-title-h2"><span>check out</span></h2>
				</div>
				<!-- process step -->
				<div class="check-step">
					<ul>
						<li class="cur"><span>Confirm</span> address</li>
						<li><span>View your</span> order</li>
						<li><span>Make</span> payment</li>
						<li><span>Order</span> confirmation</li>
					</ul>
				</div>

				<!-- address list -->
				<div class="page-title-normal checkout-title">
					<h2><span>Shipping address</span></h2>
				</div>
				<div class="addr-list-wrap">
					<div class="addr-list">
						<ul>
							<li v-for="(item, index) in addressListFilter" :key="item._id" v-bind:class="{'check':checkIdx === index}" @click="checkIdx = index">
								<dl>
									<dt>{{item.userName}}</dt>
									<dd class="address">{{item.streetName}}</dd>
									<dd class="tel">{{item.userTel}}</dd>
								</dl>
								<div class="addr-opration addr-del">
									<a href="javascript:;" class="addr-del-btn">
										<svg class="icon icon-del"><use xlink:href="#icon-del"></use></svg>
									</a>
								</div>
								<div class="addr-opration addr-set-default" v-if="!item.isDefault" @click="setDetault(item._id)">
									<a href="javascript:;" class="addr-set-default-btn"><i>Set default</i></a>
								</div>
								<div class="addr-opration addr-default" v-if="item.isDefault">Default address</div>
							</li>
							<li class="addr-new">
								<div class="add-new-inner">
									<i class="icon-add">
										<svg class="icon icon-add"><use xlink:href="#icon-add"></use></svg>
									</i>
									<p>Add new address</p>
								</div>
							</li>
						</ul>
					</div>

					<div class="shipping-addr-more">
						<a class="addr-more-btn up-down-btn" href="javascript:;" @click="expend" v-bind:class="{'open': limit > 3}">
							more
							<i class="i-up-down">
								<i class="i-up-down-l"></i>
								<i class="i-up-down-r"></i>
							</i>
						</a>
					</div>
				</div>

				<!-- shipping method-->
				<div class="page-title-normal checkout-title">
					<h2><span>Shipping method</span></h2>
				</div>
				<div class="lemall-msg-info hidden">
					<span>The region you selected is not within our delivery area. Please select another shipping address within our delivery areas.</span>
				</div>
				<div class="shipping-method-wrap">
					<div class="shipping-method">
						<ul>
							<li class="check">
								<div class="name">Standard shipping</div>
								<div class="price">Free</div>
								<div class="shipping-tips">
									<p>Once shipped，Order should arrive in the destination in 1-7 business days</p>
								</div>
							</li>
						</ul>
					</div>
				</div>
				<div class="next-btn-wrap">
					<a class="btn btn--m btn--red">Next</a>
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
				<a href="javascript:;" v-if="ensureRemove" class="btn btn--m" @click="removeProd">确认</a>
				<a href="javascript:;" class="btn btn--m" @click="closeModal">关闭</a>
			</div>
		</pop-modal> -->

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
		name: 'thisName',
		data () {
			return {
				checkIdx: 0, // 选中的地址
				limit: 3, // 默认显示地址数
				addressList: [] // 地址列表
			}
		},
		components: {
			NavHeader,
			NavFooter,
			NavBread,
			PopModal
		},
		mounted () {
			this.getAddress()
		},
		computed: {
			addressListFilter () {
				return this.addressList.slice(0, this.limit)
			}
		},
		methods: {
			getAddress () {
				axios.get('/users/userinfo?type=address').then((resp) => {
					let res = resp.data
					if (res.status === 1) {
						this.addressList = res.msg
					} else {
						this.addressList = []
					}
				}).catch((err) => {
					console.log(err)
				})
			},
			expend () {
				if (this.limit === 3) {
					this.limit = this.addressList.length
				} else {
					this.limit = 3
				}
			},
			setDetault (aId) {
				axios.post('/users/setdefault', {
					aId: aId
				}).then((resp) => {
					let res = resp.data
					if (res.status === 1) {
						this.addressList = res.list
					} else {
						this.addressList = []
					}
				}).catch((err) => {
					console.log(err)
				})
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
