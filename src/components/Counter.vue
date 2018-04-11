<template>
	<div>
		<button @click="increment">+</button>
		<button v-on:click="decrement">-</button>
		<p>Child:<span>{{num}}</span></p>
	</div>

</template>

<script>
	export default {
		props: ['num'],/* 父組件流向子組件的數據*/
		data() {
			return {
				num: 0
			}
		},
		methods: {
			increment() {
				this.$emit('incre'); /* 子組件想父組件傳遞的方法*/
			},
			decrement() {
				this.$emit('decre');
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
