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
					<!-- <a href="javascript:void(0)" class="default cur">Default</a> -->
					<a href="javascript:void(0)" class="price default cur" @click="sortGoods">Price <svg class="icon icon-arrow-short" v-bind:class="{'rotate180':sortFlag}"><use xlink:href="#icon-arrow-short"></use></svg></a>
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
							<div class="infinite-loading" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="scrollHeight">
								<span v-show="!loading">{{loadMsg}}</span>
								<img v-show="loading" src="/static/loading/loading-spinning-bubbles.svg" alt="">
							</div>
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
						endPrice:200.00
					},
					{
						startPrice:200.00,
						endPrice:1000.00
					},
					{
						startPrice:1000.00,
						endPrice:2000.00
					},
					{
						startPrice:2000.00,
						endPrice:3000.00
					},
					{
						startPrice:3000.00,
						endPrice:5000.00
					},
					{
						startPrice:5000.00,
						endPrice:7000.00
					},
				],
				priceChecked: 0,
				filterBy: false, // 价格选择框
				overlayFlag: false, // 遮罩层显示
				sortFlag: true, // 排序方式（1：升序，0：降序）
				page: 1,
				pageSize: 8,
				busy: false, // 滚动插件是否启用(true:disable)
				loading: false,
				loadMsg: '下拉加载更多',
				scrollHeight: 20,
			}
		},
		components: {
			NavHeader,
			NavFooter,
			NavBread
		},
		mounted: function () {
			this.scrollHeight = document.documentElement.clientHeight / 2
			this.getGoods(false)
			
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
			getGoods(flag) {
				this.loading = true
				let param = {
					page: this.page,
					pageSize: this.pageSize,
					sort: this.sortFlag ? 1 : -1,
					gt: this.priceFilter[this.priceChecked].endPrice,
					lt: this.priceFilter[this.priceChecked].startPrice
				}
				axios.get('/getproductsbypage',{params: param}).then((result) => {
					// console.log(result)
					this.loading = false
					this.loadMsg = '下拉加载更多'
					let res = result.data
					if (res.status == 1) {
						if (flag == true) {
							this.goodList = this.goodList.concat(res.result.list)
							if (res.result.count < this.pageSize) {
								this.busy = true
								this.loadMsg = '已加载全部'
							} else {
								this.busy = false
								this.loadMsg = '下拉加载更多'
							}
						} else {
							this.goodList = res.result.list
							this.busy = false
						}
					}
				}).catch((err) => {
					console.log(err)
				})
			},
			sortGoods () {
				this.sortFlag = !this.sortFlag
				this.page = 1
				this.getGoods(false)
			},
			setPriceFilter (index) {
				this.priceChecked = index
				this.page = 1
				this.getGoods(false)
				this.closeFilterPop()
			},
			showFilterPop () {
				this.filterBy = true
				this.overlayFlag = true
			},
			closeFilterPop () {
				this.filterBy = false
				this.overlayFlag = false
			},
			loadMore () {
				this.busy = true
				setTimeout(() => {
					this.page++
					this.getGoods(true)
					// this.busy = false
				}, 500);
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
	.list-wrap ul::after{
		clear: both;
		content: '';
		height: 0;
		display: block;
		visibility: hidden;
	}
	.infinite-loading{
		height: 100px;
		line-height: 100px;
		text-align: center;
	}
	.rotate180{
		transform:rotate(180deg);
		-ms-transform:rotate(180deg); /* IE 9 */
		-webkit-transform:rotate(180deg); /* Safari and Chrome */
	}
</style>
