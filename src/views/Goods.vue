<template>
	<div>
		商品列表组件
		<p>goodId:<span>{{$route.params.goodId}}</span></p>
		<p>userId:<span>{{$route.params.userId}}</span></p>
		<router-link to="/goods/title">显示标题</router-link>
		<router-link to="/goods/image">显示图片</router-link>
		<div>
			<router-view></router-view>
		</div>
		<router-link to="/cart">跳转购物车页面</router-link>
		<router-link v-bind:to="{name:'cart'}">命名路由 - 跳转购物车页面</router-link>
		<router-link v-bind:to="{name:'cart',params:{name:123}}">命名路由 - 带参数跳转购物车页面</router-link>
		<button v-on:click="jump">button - 跳转购物车页面</button>
		<button v-on:click="jumps">button - 带参数到跳转购物车页面</button>
		<button v-on:click="back">button - 返回</button>
	</div>
</template>

<script>
	import Title from './Title'
	import Image from './Image'
	export default {
		name: 'Goods',
		data () {
			return {
				data: lists
			}
		},
		components:{
			Title,Image
		},
		methods:{
			jump(){
				// this.$router.push('/cart');
				this.$router.push({path:'/cart'});
			},
			jumps(){
				// this.$router.push({path:'/cart?name=123'});
				this.$router.push({path:'/cart',query:{name:123}});
			},
			back(){
				this.$router.go(-1);
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
