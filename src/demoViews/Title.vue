<template>
	<div>
		商品标题子组件
		<router-link to="/goods/title/subtitle">显示子标题</router-link>
		<div>
			<router-view></router-view>
		</div>	
	</div>
</template>

<script>
	// import inportComp from './inportComp'
	export default {
		name: 'Title',
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
