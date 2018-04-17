<template>
	<div>
		<nav-header></nav-header>

		<nav-bread>
			<span>Goods</span>
			<!-- <span name="bread">测试插槽</span> -->
		</nav-bread>

		<div class="accessory-result-page accessory-page">
			<div class="container">
				<div class="filter-nav">
					<span class="sortby">Sort by:</span>
					<a href="javascript:void(0)" class="default cur">Default</a>
					<a href="javascript:void(0)" class="price">Price <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
					<a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
				</div>
				<div class="accessory-result">
					<!-- filter -->
					<div class="filter stopPop" id="filter" v-bind:class="{'filterby-show':filterBy}">
						<dl class="filter-price">
							<dt>Price:</dt>
							<!-- <dd><a href="javascript:void(0)" v-bind:class="{'cur':priceChecked == 'All'}" @click="priceChecked = 'All'">All</a></dd> -->
							<dd v-for="(item,index) in priceFilter">
								<a href="javascript:void(0)" @click="setPriceFilter(index)" v-bind:class="{'cur':priceChecked == index}">{{item.startPrice}} <span v-if="item.endPrice">-</span> {{item.endPrice}}</a>
							</dd>
						</dl>
					</div>

					<!-- search result accessories list -->
					<div class="accessory-list-wrap">
						<div class="accessory-list col-4">
							<ul>
								<li v-for="(item,index) in goodList">
									<div class="pic">
										<a href="#">
											<!-- <img alt="" v-bind:src="'/static/'+item.prodcutImg"> -->
											<img alt="" v-lazy="'/static/'+item.prodcutImg">
										</a>
									</div>
									<div class="main">
										<div class="name">{{item.productName}}</div>
										<div class="price">{{item.prodcutPrice}}</div>
										<div class="btn-area">
											<a v-bind:id="item.productId" href="javascript:;" class="btn btn--m">加入购物车
											</a>
										</div>
									</div>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="md-overlay" v-show="overlayFlag" @click="closeFilterPop"></div>

		<nav-footer></nav-footer>
	</div>
</template>

<script>

	import NavHeader from '@/components/NavHeader'
	import NavFooter from '@/components/NavFooter'
	import NavBread from '@/components/NavBread'
	import axios from 'axios'

	export default {
		name: 'GoodList',
		data () {
			return {
				goodList: [], // 商品列表
				priceFilter: [ // 价格区间
					{
						startPrice:'All'
					},
					{
						startPrice:0.00,
						endPrice:500.00
					},
					{
						startPrice:500.00,
						endPrice:1000.00
					},
					{
						startPrice:1500.00,
						endPrice:2000.00
					},
					{
						startPrice:2500.00,
						endPrice:3000.00
					},
				],
				priceChecked: 0,
				filterBy: false, // 价格选择框
				overlayFlag: false // 遮罩层显示
			}
		},
		components: {
			NavHeader,
			NavFooter,
			NavBread
		},
		mounted: function () {
			this.getGoods()
			
			axios.interceptors.request.use(function (config) {
				console.log("request init.");

				return config;
			})
			axios.interceptors.response.use(function (response) {
				console.log("response init.");
				return response;
			})
		},
		methods: {
			getGoods () {
				axios.get('./static/mock/goods.json').then((result) => {
					let res = result.data
					this.goodList = res.result
				}).catch((err) => {
					console.log(err)
				})
			},
			setPriceFilter (index) {
				this.priceChecked = index
				this.closeFilterPop()
			},
			showFilterPop () {
				this.filterBy = true
				this.overlayFlag = true
			},
			closeFilterPop () {
				this.filterBy = false
				this.overlayFlag = false
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

