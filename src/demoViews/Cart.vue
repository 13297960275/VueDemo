<template>
	<div>
		购物车页面
		<p>query.name:<span>{{$route.query.name}}</span></p>
		<p>params.name:<span>{{$route.params.name}}</span></p>
	</div>
</template>

<script>
	// import inportComp from './inportComp'
	export default {
		name: 'Cart',
		data () {
			return {
				data: data
			}
		},
		components:{
			// inportComp
		},
		methods:{
			fun(){
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
