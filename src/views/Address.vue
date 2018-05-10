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
							<li v-for="(item, index) in addressListFilter" :key="item._id" v-bind:class="{'check':checkIdx === index}" @click="checkIdx = index; selectedAddrId = item._id">
								<dl>
									<dt>{{item.userName}}</dt>
									<dd class="address">{{item.streetName}}</dd>
									<dd class="tel">{{item.userTel}}</dd>
								</dl>
								<div class="addr-opration addr-del" @click="addOrDelAddress(0, item._id)">
									<a href="javascript:;" class="addr-del-btn">
										<svg class="icon icon-del"><use xlink:href="#icon-del"></use></svg>
									</a>
								</div>
								<div class="addr-opration addr-set-default" v-if="!item.isDefault" @click="CUDAddress(0, item._id)">
									<a href="javascript:;" class="addr-set-default-btn"><i>Set default</i></a>
								</div>
								<div class="addr-opration addr-default" v-if="item.isDefault">Default address</div>
							</li>
							<li class="addr-new">
								<div class="add-new-inner" @click="addOrDelAddress(1)">
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
					<router-link class="btn btn--m btn--red" v-bind:to="{path: 'order', query: {'addressId': selectedAddrId}}">Next</router-link>
				</div>
			</div>
		</div>

		<pop-modal v-bind:modalShow="modalShow" v-bind:formTitle="formTitle" v-on:close="closeModal">
			<div v-if="!isAdd" slot="formContent">
				<span>{{formMsg}}</span>
			</div>
			<div slot="formContent" v-if="isAdd">
				<form>
					<ul>
						<li class="regi_form_input">
							<i class="icon IconPeople"></i>
							<input type="text" v-model="address.userName" placeholder="User Name" class="regi_login_input" tabindex="1" name="">
						</li>
						<li class="regi_form_input noMargin">
							<i class="icon IconMobile"></i>
							<input type="text" v-model="address.postCode" placeholder="User Post Code" class="regi_login_input" tabindex="2" name="">
						</li>
						<li class="regi_form_input noMargin">
							<i class="icon IconMobile"></i>
							<input type="text" v-model="address.streetName" placeholder="User Address" class="regi_login_input" tabindex="3" name="">
						</li>
						<li class="regi_form_input noMargin">
							<i class="icon IconMobile"></i>
							<input type="text" v-model="address.userTel" placeholder="User Mobole" class="regi_login_input" tabindex="4" name="">
						</li>
					</ul>
				</form>
			</div>
			<div slot="formBtnGrop">
				<a href="javascript:;" class="btn btn--m" @click="ensureAddOrDel">确认</a>
				<a href="javascript:;" class="btn btn--m" @click="closeModal">取消</a>
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
		name: 'Address',
		data () {
			return {
				checkIdx: 0, // 选中的地址
				limit: 3, // 默认显示地址数
				addressList: [], // 地址列表
				modalShow: false, // 模态框是否显示
				formTitle: '', // 模态框标题
				formMsg: '', // 模态框提示内容
				delAddressId: '', // 要移除的地址id
				isAdd: false, // 添加/删除地址
				address: {}, // 新增地址模型类
				selectedAddrId: '' // 选中的地址id
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
						this.addressList = res.result
						this.selectedAddrId = this.addressList[this.addressList.findIndex(addr => addr.isDefault === true)]._id
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
			closeModal () {
				this.modalShow = false
			},
			CUDAddress (num, params) {
				axios.post('/users/cudaddress', {
					type: num,
					params: params
				}).then((resp) => {
					let res = resp.data
					if (res.status === 1) {
						this.addressList = res.result
					} else {
						this.addressList = []
					}
					this.modalShow = false
					this.address = {}
				}).catch((err) => {
					console.log(err)
					this.modalShow = false
				})
			},
			addOrDelAddress (num, aId) {
				if (num > 0) {
					this.formTitle = '地址信息'
					this.isAdd = true
				} else {
					if (this.addressList.length <= 1) {
						this.formTitle = '提示'
						this.formMsg = '最后一条地址信息了，确认移除该地址？'
						this.delAddressId = aId
						this.isAdd = false
					} else {
						this.formTitle = '警告'
						this.formMsg = '确认移除该地址'
						this.delAddressId = aId
						this.isAdd = false
					}
				}
				this.modalShow = true
			},
			ensureAddOrDel () {
				if (this.isAdd) {
					console.log(this.address)
					this.CUDAddress(1, this.address)
				} else {
					this.CUDAddress(-1, this.delAddressId)
				}
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
